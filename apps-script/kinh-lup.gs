// Google Apps Script cho web Kính Lúp — một Web app làm 4 việc:
//   1. doc-request: khách gửi yêu cầu bổ sung hồ sơ → gửi thông báo về NOTIFY_EMAIL
//   2. access:      người chơi nhập đúng mã → ghi lượt truy cập vào tab của sản phẩm ("Thời gian chơi - P1"…), trả về tiến trình đã lưu
//   3. progress:    lưu tiến trình chơi theo mã (trang đang chơi + các ô đã chọn + đồng hồ chơi) để mở lại trên thiết bị khác
//   4. result:      người chơi phá xong vụ án → ghi hàng "Hoàn thành vụ án" kèm thời gian chơi vào cùng tab của sản phẩm,
//                   trả về nhanh hơn bao nhiêu % số nhóm
// và mỗi ngày gửi email thống kê lượt truy cập 24 giờ qua (hàm guiThongKe, chạy theo trigger).
//
// Cách dựng (một lần):
//   a. Tạo một Google Sheet mới (vd. "Kính Lúp – Truy cập") → Tiện ích mở rộng → Apps Script → dán toàn bộ file này → Lưu.
//   b. Chọn hàm caiDat → Chạy → cấp quyền (gửi email, sửa trang tính). Hàm tạo lịch gửi thống kê lúc 8 giờ sáng,
//      lịch tự đặt tên tab mới thành "Thời gian chơi - P(n+1)" (khiThemTab), và chuyển trang tính "Truy cập" cũ, nếu có,
//      thành tab "Thời gian chơi - P1". Tab cũ tên "P1", "P2"… (bản trước) tự được đổi tên, giữ nguyên dữ liệu.
//   c. Triển khai → Tùy chọn triển khai mới → Ứng dụng web (Thực thi với tư cách: Tôi; Người có quyền truy cập: Bất kỳ ai)
//      → chép URL /exec vào appsScriptUrl trong src/lib/backend.js.
//   Sửa file này về sau: Triển khai → Quản lý các lần triển khai → sửa → Phiên bản mới (giữ nguyên URL).

const NOTIFY_EMAIL = 'kinhlupinfo@gmail.com'
const TIME_ZONE = 'Asia/Ho_Chi_Minh'
const LEGACY_LOG_SHEET = 'Truy cập'
// Mỗi sản phẩm một tab "Thời gian chơi - P1", "Thời gian chơi - P2"…: mỗi lần nhập mã ghi một hàng (4 cột đầu),
// mỗi lượt phá xong vụ án ghi thêm một hàng "Hoàn thành vụ án" kèm Lượt chơi + Thời gian chơi
const SHEET_PREFIX = 'Thời gian chơi - '
const SHEET_NAME = /^Thời gian chơi - P(\d+)$/
const LOG_HEADER = [
  'Thời gian',
  'Mã truy cập',
  'Vị trí truy cập',
  'Trang đang chơi',
  'Lượt chơi',
  'Thời gian chơi (phút)',
  'Thời gian chơi (giây)',
  'Tính vào thống kê',
]
const FINISHED_PAGE = 'Hoàn thành vụ án'
const REVIEW_PAGE = 'Xem lại tóm tắt'
const DAY_SHADE = '#d9d9d9'
const MAX_DOCUMENTS = 3
const MAX_PROGRESS_LENGTH = 8000
// Trang Tóm tắt: chỉ hiện % khi đã có ít nhất MIN_COMPARE lượt khác để so sánh.
// Lượt dưới MIN_RECORDED_SECONDS (nhanh bất thường) không được ghi, trừ mã Admin.
// Mỗi lượt được ghi một hàng riêng (mã được chuyển cho nhóm khác thì có thêm hàng mới, không ghi đè lượt cũ)
// và đều được tính vào thống kê, trừ lượt của mã Admin.
// Có thể tự thêm hàng vào tab của sản phẩm (vd. thời gian các buổi chơi thử): Thời gian chơi (giây) = số giây,
// Tính vào thống kê = "Có". Hàm themDuLieuMau thêm sẵn SAMPLE_COUNT lượt mẫu (mã "Mẫu"), xoaDuLieuMau xoá chúng đi.
const MIN_COMPARE = 20
const SAMPLE_CODE = 'Mẫu'
const SAMPLE_COUNT = 20
const MIN_RECORDED_SECONDS = 15 * 60
const MAX_RESULT_SECONDS = 7 * 24 * 60 * 60

// SHA-256 của "p1:<mã>" — giống codeHashes / adminCodeHash trong src/data/access.js (không để mã gốc trong mã nguồn)
const CODE_HASHES = [
  'cc6f3ababb8998e6efb480170407488ea260379dde5c649b80ef616e34db5ca6',
  'b5ee893b5970422f4fd8b246afd3ca0819ec26cab17fcae27b410d89997999be',
  'ceb68db10fd2f5d80746b7cf0dd06b002f39c8c3eae042bbf5d77792e3185db7',
  '37d598c677309e68c7639b00c557e16a2ed1da03cb510fb7b18043628d6eb363',
  'fe7e6055b71a751dff944730d83f04a9887a76e2f777dec94d6aa6ee83e88a7e',
  '4ff10289e247e6d512f7ee12c7972c70cbbca1a4ca1117253f8ef5f3afea96a0',
  '77085d6475198acc3177b85ed1196e677d17c4178f1c76c0d56daa9de6596f97',
  'aead45491353e6a32666cc55fa6c4e16d6c5fdaded52b66ab9a9023a9747296f',
  '9a70edbe2cd7933cd732a6b7862debe212ce5c13795dd9f246c10f3d75353a7e',
  '0342b770ffe90442458961f5b0e18214347dbc07f2036841cd0409f4b787ca9c',
  '423b44d09d2b0a6e5aa6c26832d0fad101f6d32f61ff60bb67d24c7f66f540b8',
  '320f2096b6de2aa412160b4782f040b5b47d8da3f5618338b1c3974d9d2fad76',
  '8db968a6515466a5bde80560eb8508f80d959443df187302e270aab889e7064b',
  '04733c73d1539c12ad70ef02b7a32a111a07a6b715a365f7f99d754c1513e403',
  '565f7804b56d1ba745d665019d74c9197211c6d5ab47649cf158ac34b27e5cc8',
  'f0265f7b6eef2d07db746e5366ee41e1dc0dd9c5fe8be32b6c12aa3445410ea3',
  '909c95f320e4acf24726fb24a22cdea06054f8c549b72632bd2159aee62d11aa',
  '78c4db85aa76d02b1e0a8ffa6defbd709b7dedb0eedfd1ac0b19e524891788ec',
  'e87743374e2ed70c9854b040888a0fc38e20cf297bb54b2a66617237335f00a6',
  '46040f024bed8b9ba5cb69376cc2ac35f2150b6ec179611db3f970cf213c392c',
  '6fff6ebd5e91e8f227bdf7311c8a24272320840f6ad493921ac170d196dea53b',
  '539720d096facaed35eb62877e983f561d973d51cad3c19e85f748803e9b8580',
  '8f6209f860fdeb9ce6ddae4b1754e3dc02412bfd73e4f2dc2a14681c169add24',
  'd0d8c2d144c7967024c19d2bb0e9c874af9c275dcabcee487a957449805cb8a1',
  '04591b6ae276d7541d322ca61a3e2d13e6911010669f8d1ce862b5a768d49a0d',
  'c9dc5f2e2b83950c0a254b511dd74164143a72cee90a3ea88adf684621500475',
  '38e24341a20ce3102b9ff2b7dac0c235d479639067f10c8a220dcf100e63e9db',
  '4e73c432aba1604506adada84c7ee914b7d2c145bedff5481de95540d5a967f4',
  '66364c58f9dddc8fed90b66b818ae81a8d0fa7c2d7abc43974b52a18f6e7a544',
  'cc66999b7398e181a51e9ae360c3727c52062b7140f965e55d4b63cd73b5417c',
  'd3128b43255c73ce491ffdf6fbbebf6cd72e85fef23a3568da0b26e8a4a4f5bd',
  'dd17230316bcb9a5a6cea50368ef0a32cf4ecd74859a250e346187613d0dc6bb',
  'f71a8054645efe3a80d31bdc9a971a1c72a765daed023a671591554c617575d8',
  '224e3cdd37aec8d52f1df2676518fd2d1a31e41d6956d60c34aacd999e3b5657',
  'd20a95ed1403a77e4ee7e5c4e8422b47fc4c50b957a26f9400b56acedf3a9138',
  'fdbdae1396113f396ab95470d0119cdff655851cd60936a9776e20eb386131e2',
  '6c2db5fcc9d0b462e6f481b0819786716f8f804182f29265b0fed57dfaa0ff5b',
  '0ffa87fcb727c32499882173a370f565579dd2acd2665e0b7f2b23dc3a5fe420',
  'eb3e1499a2796b9ec85e4f8085fbd026ca0685983d0366c8097a331647bf1d49',
  '109d7cd25acf871a89f9dc480ebf6450e176b1777b606a2f91b0aa3a98b1500c',
  '05995eabd7fab6a36ee4dc830125442b0b25ad9aa3a4bb2afdd0c8eba71cd064',
  'e0a039b62382effb3186a68d4563b4020a8da549fa6a1d4932e4023111d6a7bd',
  '40bb77047ed4fac3aec9086c5f920b8551106cf489e9705a1d49fc95f601149b',
  '55ce3c94cebcee5c341af325ca7659e1e48e25da763ed6759e74eb9b64ed9263',
  '6e6e19f697b8f61ae82056e4ee46bc85d3f14e50e70b9d9f6b8b68a6e1097115',
  '52bcc8fccf81b900c66e31c206255ce60cfa03a1b50b35289caf963113634dce',
  '55825c9a457876c729788f77d033492d9253f1026e58954f738ffab504987b90',
  'fc5b0137230346a602fa2716cda121889521b5f72c2b9c2583b5c26bb7f85941',
  '4778d0a3171c4d66e596233983b7d56af7f1cf14aed2e0a70b731a285ae4b8e8',
  '5b5a7a1587b79cf223944af741e389d8ec00b7a643fa6cf36931d8c0ca58cb14',
]
const ADMIN_CODE_HASH = 'd8d29ce91917f861eeb68a86562bb2c152bb0b713a86586d33ece39ef219bf8a'

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents)
    if (request.action === 'doc-request') return reply(handleDocRequest(request))
    if (request.action === 'access') return reply(handleAccess(request))
    if (request.action === 'progress') return reply(handleProgress(request))
    if (request.action === 'result') return reply(handleResult(request))
    return reply({ ok: false })
  } catch (error) {
    console.error(error)
    return reply({ ok: false })
  }
}

function handleDocRequest(request) {
  const email = String(request.email || '').trim()
  const documents = (Array.isArray(request.documents) ? request.documents : [])
    .map((doc) => String((doc && doc.label) || '').trim())
    .filter(Boolean)
    .slice(0, MAX_DOCUMENTS)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || documents.length === 0) return { ok: false }

  // "P1 - Phạm Thùy Chi", "P2 - <tên vụ án>"… theo productId và tên vụ án web gửi lên
  const product = [text(request.productId, 20).toUpperCase(), text(request.caseTitle, 120)].filter(Boolean).join(' - ')
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `Yêu cầu hỗ trợ hồ sơ – ${product}`,
    body:
      'Dear team Kính Lúp,\n' +
      `${email} đã gửi yêu cầu hỗ trợ về sản phẩm ${product}. ` +
      `Các hồ sơ cần hỗ trợ bao gồm ${joinVietnamese(documents)}. ` +
      'Vui lòng team liên hệ với khách hàng để biết thêm chi tiết và hỗ trợ.',
  })
  return { ok: true }
}

// Ghi lượt truy cập; trang đang chơi = trang đã lưu của mã (chưa chơi hoặc bấm Chơi mới thì là trang bắt đầu,
// đã phá xong mà bấm Tiếp tục thì là "Xem lại tóm tắt")
function handleAccess(request) {
  const player = checkCode(request)
  if (!player) return { ok: false }
  const progress = readProgress(player)
  let page = text(request.startLabel, 80)
  if (!request.restart && progress && progress.finished) page = REVIEW_PAGE
  else if (!request.restart && progress && progress.pageLabel) page = progress.pageLabel
  const sheet = productSheet(player.productId)
  sheet.appendRow([new Date(), player.label, text(request.location, 120) || 'Không xác định', page])
  shadeDays(sheet)
  return { ok: true, progress }
}

function handleProgress(request) {
  const player = checkCode(request)
  const json = JSON.stringify(request.progress || null)
  if (!player || !request.progress || json.length > MAX_PROGRESS_LENGTH) return { ok: false }
  PropertiesService.getScriptProperties().setProperty(progressKey(player), json)
  return { ok: true }
}

// Ghi thời gian chơi của lượt (gửi lại cùng lượt thì không ghi thêm) và so sánh với các lượt được tính vào thống kê
function handleResult(request) {
  const player = checkCode(request)
  const seconds = Math.round(Number(request.seconds))
  const runId = text(request.runId, 20)
  if (!player || !runId || !(seconds > 0 && seconds <= MAX_RESULT_SECONDS)) return { ok: false }

  // Khoá: trang cuối và trang Tóm tắt có thể gửi cùng lúc, tránh ghi trùng một lượt
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = productSheet(player.productId)
    const rows = sheet.getDataRange().getValues().slice(1)
    let own = rows.find((row) => String(row[1]) === player.label && String(row[4]) === runId)
    if (!own) {
      const location = text(request.location, 120) || 'Không xác định'
      const minutes = Math.round(seconds / 6) / 10
      own = [new Date(), player.label, location, FINISHED_PAGE, runId, minutes, seconds, player.admin ? 'Không' : 'Có']
      // Lượt quá nhanh: vẫn so sánh để hiện trên trang Tóm tắt nhưng không ghi vào Sheet
      if (player.admin || seconds >= MIN_RECORDED_SECONDS) {
        sheet.appendRow(own)
        shadeDays(sheet)
        rows.push(own)
      }
    }

    const ownSeconds = Number(own[6])
    const others = rows
      .filter((row) => row !== own && row[7] === 'Có' && Number(row[6]) > 0)
      .map((row) => Number(row[6]))
    const slower = others.filter((value) => value > ownSeconds).length
    // Thời gian nhanh nhất / chậm nhất trong các lượt được so sánh, tính cả lượt này (hiện ở hai đầu thanh vị trí)
    const all = others.concat(ownSeconds)
    return {
      ok: true,
      seconds: ownSeconds,
      compared: others.length,
      fasterThan: others.length >= MIN_COMPARE ? Math.round((slower / others.length) * 100) : null,
      fastest: Math.min.apply(null, all),
      slowest: Math.max.apply(null, all),
    }
  } finally {
    lock.releaseLock()
  }
}

function checkCode(request) {
  const productId = text(request.productId, 20)
  const code = text(request.code, 20).toUpperCase()
  const hash = sha256(`${productId}:${code}`)
  if (hash === ADMIN_CODE_HASH) return { productId, code, label: `${code} (Admin)`, admin: true }
  return CODE_HASHES.indexOf(hash) >= 0 ? { productId, code, label: code } : null
}

function progressKey(player) {
  return `tien-trinh:${player.productId}:${player.code}`
}

function readProgress(player) {
  const json = PropertiesService.getScriptProperties().getProperty(progressKey(player))
  return json ? JSON.parse(json) : null
}

// Chạy theo trigger mỗi ngày: thống kê 24 giờ qua của tất cả sản phẩm (mọi tab "Thời gian chơi - P1", "- P2"…),
// mỗi sản phẩm một phần riêng gồm câu tóm tắt và bảng Mã truy cập · Giờ truy cập · Vị trí truy cập · Trang đang chơi
function guiThongKe() {
  const since = Date.now() - 24 * 60 * 60 * 1000
  const today = Utilities.formatDate(new Date(), TIME_ZONE, 'dd/MM/yyyy')
  const cell = 'border:1px solid #c9b8ad;padding:6px 10px;text-align:left'
  const head = ['Mã truy cập', 'Giờ truy cập', 'Vị trí truy cập', 'Trang đang chơi']
    .map((title) => `<th style="${cell};background:#5b1a1a;color:#fff">${title}</th>`)
    .join('')

  const sections = productSheets().map((sheet) => {
    const product = sheet.getName().slice(SHEET_PREFIX.length)
    const rows = sheet
      .getDataRange()
      .getValues()
      .slice(1)
      .filter((row) => row[0] instanceof Date && row[0].getTime() >= since)
      .sort((a, b) => String(a[1]).localeCompare(String(b[1])) || a[0] - b[0])
    const visits = rows.filter((row) => row[3] !== FINISHED_PAGE)
    const finished = rows.length - visits.length
    const codes = new Set(visits.map((row) => row[1]))
    const summary = rows.length
      ? `Sản phẩm ${product}: trong 24 giờ qua có ${visits.length} lượt truy cập từ ${codes.size} mã truy cập` +
        (finished ? `, ${finished} lượt phá xong vụ án.` : '.')
      : `Sản phẩm ${product}: trong 24 giờ qua chưa có lượt truy cập nào.`
    const body = rows
      .map((row) => {
        // Hàng hoàn thành: ghi kèm thời gian chơi, vd. "Hoàn thành vụ án (82 phút)"
        const page = row[3] === FINISHED_PAGE ? `${FINISHED_PAGE} (${Math.round(Number(row[6]) / 60)} phút)` : row[3]
        const values = [row[1], Utilities.formatDate(row[0], TIME_ZONE, 'HH:mm dd/MM/yyyy'), row[2], page]
        return `<tr>${values.map((value) => `<td style="${cell}">${escapeHtml(value)}</td>`).join('')}</tr>`
      })
      .join('')
    const html =
      `<h3 style="font-family:Arial,sans-serif;margin:22px 0 6px">Sản phẩm ${escapeHtml(product)}</h3>` +
      `<p style="margin:0 0 8px">${escapeHtml(summary)}</p>` +
      (rows.length ? `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px"><tr>${head}</tr>${body}</table>` : '')
    return { summary, html }
  })

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `Thống kê truy cập 24 giờ qua – ${today}`,
    body: sections.map((section) => section.summary).join('\n'),
    htmlBody: `<p>Dear team Kính Lúp,</p>${sections.map((section) => section.html).join('')}`,
  })
}

// Chạy tay một lần: thêm SAMPLE_COUNT lượt mẫu vào tab "Thời gian chơi - P1", thời gian ngẫu nhiên 50 phút – 2 giờ,
// để trang Tóm tắt có dữ liệu so sánh ngay. Cột Thời gian để trống nên email thống kê hằng ngày không đếm các hàng này.
// Đã có lượt mẫu thì không thêm nữa (chạy lại không bị nhân đôi).
function themDuLieuMau() {
  const sheet = productSheet('p1')
  const hasSamples = sheet
    .getDataRange()
    .getValues()
    .some((row) => row[1] === SAMPLE_CODE)
  if (hasSamples) {
    console.log('Tab đã có lượt mẫu, không thêm nữa.')
    return
  }
  for (let index = 1; index <= SAMPLE_COUNT; index++) {
    const seconds = Math.round((50 + Math.random() * 70) * 60)
    sheet.appendRow(['', SAMPLE_CODE, '', 'Dữ liệu mẫu', `mau-${index}`, Math.round(seconds / 6) / 10, seconds, 'Có'])
  }
  console.log(`Đã thêm ${SAMPLE_COUNT} lượt mẫu.`)
}

// Chạy tay khi đã có đủ lượt chơi thật: xoá mọi hàng mã "Mẫu" trong tab "Thời gian chơi - P1"
function xoaDuLieuMau() {
  const sheet = productSheet('p1')
  const values = sheet.getDataRange().getValues()
  let removed = 0
  // Xoá từ dưới lên để số thứ tự các hàng phía trên không bị dịch
  for (let index = values.length - 1; index >= 1; index--) {
    if (values[index][1] === SAMPLE_CODE) {
      sheet.deleteRow(index + 1)
      removed++
    }
  }
  console.log(`Đã xoá ${removed} lượt mẫu.`)
}

// Chạy một lần sau khi dán script: tạo lịch gửi thống kê mỗi ngày lúc 8 giờ sáng và lịch tự đặt tên tab mới.
// Trang tính "Truy cập" cũ (chỉ có P1) được đổi thành tab "Thời gian chơi - P1", bỏ cột "Vụ án" và tô xám cách ngày.
function caiDat() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const legacy = spreadsheet.getSheetByName(LEGACY_LOG_SHEET)
  if (legacy && productSheets().length === 0) {
    if (legacy.getRange(1, 3).getValue() === 'Vụ án') legacy.deleteColumn(3)
    legacy.setName(`${SHEET_PREFIX}P1`)
    prepareLogSheet(legacy)
    shadeDays(legacy)
  }
  ScriptApp.getProjectTriggers()
    .filter((trigger) => ['guiThongKe', 'khiThemTab'].indexOf(trigger.getHandlerFunction()) >= 0)
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger))
  ScriptApp.newTrigger('guiThongKe').timeBased().everyDays(1).atHour(8).inTimezone(TIME_ZONE).create()
  ScriptApp.newTrigger('khiThemTab').forSpreadsheet(spreadsheet).onChange().create()
}

// Chạy theo trigger khi bấm "+" thêm tab: tab trống mới được đặt tên "Thời gian chơi - P(n+1)" (đang có đến P1 thì
// thành P2) và dựng sẵn hàng tiêu đề như tab của P1, để lượt truy cập và thời gian chơi của sản phẩm đó ghi vào đây.
function khiThemTab(e) {
  if (e && e.changeType !== 'INSERT_GRID') return
  SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()
    .filter((sheet) => !SHEET_NAME.test(sheet.getName()) && !/^P\d+$/.test(sheet.getName()))
    .filter((sheet) => sheet.getName() !== LEGACY_LOG_SHEET && sheet.getLastRow() === 0)
    .forEach((sheet) => {
      sheet.setName(`${SHEET_PREFIX}P${nextProductNumber()}`)
      prepareLogSheet(sheet)
    })
}

// Tab của sản phẩm: "Thời gian chơi - P1"… Tab cũ tên "P1" (bản trước) được đổi tên, giữ dữ liệu truy cập.
function productSheet(productId) {
  const product = productId.toUpperCase()
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_PREFIX + product)
  if (sheet) return sheet
  sheet = spreadsheet.getSheetByName(product)
  if (sheet) sheet.setName(SHEET_PREFIX + product)
  else sheet = spreadsheet.insertSheet(SHEET_PREFIX + product)
  prepareLogSheet(sheet)
  return sheet
}

// Ghi hàng tiêu đề (tab cũ chỉ có 4 cột thì bổ sung tiêu đề các cột thời gian chơi)
function prepareLogSheet(sheet) {
  sheet.getRange(1, 1, 1, LOG_HEADER.length).setValues([LOG_HEADER])
  sheet.setFrozenRows(1)
  // Mã truy cập + Lượt chơi để dạng chữ: Sheets không bỏ số 0 đầu mã (vd. "0123")
  sheet.getRange('B:B').setNumberFormat('@')
  sheet.getRange('E:E').setNumberFormat('@')
}

function nextProductNumber() {
  return productSheets().reduce((max, sheet) => Math.max(max, productNumber(sheet)), 0) + 1
}

function productNumber(sheet) {
  return Number(SHEET_NAME.exec(sheet.getName())[1])
}

// Các tab sản phẩm theo thứ tự P1, P2…; tab cũ tên "P1", "P2"… được đổi tên trước
function productSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  spreadsheet
    .getSheets()
    .filter((sheet) => /^P\d+$/.test(sheet.getName()))
    .forEach((sheet) => productSheet(sheet.getName()))
  return spreadsheet
    .getSheets()
    .filter((sheet) => SHEET_NAME.test(sheet.getName()))
    .sort((a, b) => productNumber(a) - productNumber(b))
}

// Tô xám cột Thời gian cách ngày (ngày thứ 1, 3, 5… có lượt truy cập) để dễ phân biệt các ngày
function shadeDays(sheet) {
  const count = sheet.getLastRow() - 1
  if (count < 1) return
  const range = sheet.getRange(2, 1, count, 1)
  let previousDay = null
  let shaded = false
  const colors = range.getValues().map(([time]) => {
    const day = time instanceof Date ? Utilities.formatDate(time, TIME_ZONE, 'yyyy-MM-dd') : String(time)
    if (day !== previousDay) {
      shaded = previousDay === null ? true : !shaded
      previousDay = day
    }
    return [shaded ? DAY_SHADE : null]
  })
  range.setBackgrounds(colors)
}

// "A" · "A và B" · "A, B và C"
function joinVietnamese(items) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} và ${items[items.length - 1]}`
}

function text(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function sha256(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map((byte) => ((byte + 256) % 256).toString(16).padStart(2, '0'))
    .join('')
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
}
