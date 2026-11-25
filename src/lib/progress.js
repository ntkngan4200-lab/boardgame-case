import { getExplanation, getQuestion } from '../data/product1'
import { getAccessSession } from './access'
import { callBackend } from './backend'
import { lookupLocation } from './location'

// Tiến trình chơi theo mã truy cập: { path, pageLabel, selections: { [questionId]: optionIds }, finished, timing, updatedAt }.
// Lưu ngay vào localStorage (mở lại nhanh trên thiết bị này) và gửi lên Apps Script để mở lại trên thiết bị khác.
const localKey = (productId, code) => `kinh-lup:tien-trinh:${productId}:${code}`
const cache = new Map()
const listeners = new Set()
const results = new Map()
let saveTimer

// Thời gian chơi tính liên tục từ lúc nhập mã, chỉ trừ các khoảng bấm Tạm dừng (quên tạm dừng thì vẫn tính).
// Đồng hồ dừng hẳn khi tới trang cuối của vụ án (finalPath).
// timing: { startedAt (cũng là mã lượt chơi), elapsed (ms đã cộng), lastAt (mốc đã cộng tới), pausedAt, stoppedAt }

function emptyProgress() {
  return { path: null, pageLabel: null, selections: {}, finished: false, timing: null, updatedAt: 0 }
}

function startTiming(now) {
  return { startedAt: now, elapsed: 0, lastAt: now, pausedAt: null, stoppedAt: null }
}

// Cộng khoảng từ mốc trước tới bây giờ vào elapsed (đang tạm dừng hoặc đã dừng thì giữ nguyên)
function tick(timing, now) {
  if (!timing) return startTiming(now)
  if (timing.pausedAt || timing.stoppedAt) return timing
  return { ...timing, elapsed: playedTime(timing, now), lastAt: now }
}

// Thời gian chơi (ms) tính tới lúc now
export function playedTime(timing, now = Date.now()) {
  if (!timing) return 0
  if (timing.pausedAt || timing.stoppedAt) return timing.elapsed
  return timing.elapsed + Math.max(now - timing.lastAt, 0)
}

function readLocal(productId, code) {
  try {
    return JSON.parse(localStorage.getItem(localKey(productId, code)))
  } catch {
    return null
  }
}

function writeLocal(productId, code, progress) {
  try {
    localStorage.setItem(localKey(productId, code), JSON.stringify(progress))
  } catch {
    // Trình duyệt chặn localStorage: vẫn còn bản trên máy chủ (nếu có)
  }
}

function current(productId) {
  const session = getAccessSession(productId)
  if (!session) return null
  const key = `${productId}:${session.code}`
  // Tải lại trang giữa chừng: lấy lại tiến trình từ localStorage
  if (!cache.has(key)) cache.set(key, { ...emptyProgress(), ...readLocal(productId, session.code) })
  return { code: session.code, key, progress: cache.get(key) }
}

// Mỗi lần cập nhật tiến trình thì lưu luôn đồng hồ chơi tới lúc này (change.timing ghi đè nếu có)
function update(productId, change) {
  const entry = current(productId)
  if (!entry) return
  const now = Date.now()
  const progress = { ...entry.progress, timing: tick(entry.progress.timing, now), ...change, updatedAt: now }
  cache.set(entry.key, progress)
  listeners.forEach((listener) => listener())
  save(productId, entry.code, progress)
}

function save(productId, code, progress) {
  writeLocal(productId, code, progress)
  // Gộp các lần chọn liên tiếp thành một lần gửi
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    callBackend('progress', { productId, code, progress }, { keepalive: true }).catch((error) =>
      console.warn('[Kính Lúp] Chưa lưu được tiến trình lên máy chủ', error),
    )
  }, 600)
}

// "Giai đoạn 1 · Câu hỏi 2" / "Giai đoạn 2 · Lời giải" (ghi trong email thống kê); null nếu không phải trang chơi
function describePlayPath(path) {
  const [, productId, objectiveId, page] = path.split('/')
  if (page === 'giai-thich') {
    const explanation = getExplanation(productId, objectiveId)
    return explanation ? `${explanation.stage} · Lời giải` : null
  }
  const question = getQuestion(productId, objectiveId, page)
  return question ? `${question.stage} · Câu hỏi ${page.slice(1)}` : null
}

// Vừa nhập đúng mã: ghi lượt truy cập, lấy tiến trình mới nhất (máy chủ hoặc thiết bị này), trả về trang sẽ mở.
// mode 'continue': mở lại trang đang chơi dở; lượt đã phá xong thì mở trang Tóm tắt để xem lại.
// mode 'restart': lượt chơi mới từ Câu hỏi 1, xoá các lựa chọn cũ, đồng hồ về 0 (vd. mã được chuyển cho nhóm khác).
export async function openSession(access, code, mode = 'continue') {
  const restart = mode === 'restart'
  const { productId } = access
  let remote = null
  try {
    const result = await callBackend('access', {
      productId,
      code,
      location: await lookupLocation(),
      startLabel: describePlayPath(access.next),
      restart,
    })
    remote = result.progress
  } catch (error) {
    // Máy chủ lỗi: vẫn cho chơi tiếp bằng tiến trình trên thiết bị này
    console.warn('[Kính Lúp] Chưa ghi được lượt truy cập', error)
  }
  const local = readLocal(productId, code)
  const latest = (remote?.updatedAt ?? 0) > (local?.updatedAt ?? 0) ? remote : local
  const now = Date.now()
  const progress = restart || !latest ? emptyProgress() : { ...emptyProgress(), ...latest }
  // Lượt chơi mới bắt đầu đồng hồ từ 0; lượt đã phá xong giữ nguyên thời gian đã dừng
  if (!progress.finished) progress.timing = tick(progress.timing, now)
  cache.set(`${productId}:${code}`, progress)
  listeners.forEach((listener) => listener())
  // Chơi mới: ghi đè tiến trình cũ ngay, thiết bị khác nhập mã cũng thấy lượt mới
  if (restart) save(productId, code, { ...progress, updatedAt: now })
  if (progress.finished && progress.timing?.stoppedAt) return access.summaryPath
  return progress.path ?? access.next
}

// Ghi trang đang chơi (gọi mỗi khi đổi trang trong vụ án). Trang Trả lời sai: lần sau mở lại chính câu hỏi đó.
// Tới trang cuối của vụ án: dừng đồng hồ và gửi thời gian chơi lên máy chủ.
export function recordVisit(access, pathname) {
  const path = pathname.replace(/\/sai$/, '')
  const pageLabel = describePlayPath(path)
  const entry = current(access.productId)
  if (!entry || !pageLabel || entry.progress.path === path) return
  const now = Date.now()
  const timing = tick(entry.progress.timing, now)
  const finishing = path === access.finalPath && !timing.stoppedAt
  update(access.productId, {
    path,
    pageLabel,
    finished: entry.progress.finished || path === access.finalPath,
    timing: finishing ? { ...timing, stoppedAt: now } : timing,
  })
  if (finishing) fetchPlayResult(access.productId).catch(() => {})
}

// Đồng hồ chơi của mã đang dùng (null khi chưa nhập mã); subscribeProgress báo mỗi khi tiến trình đổi
export function getPlayTiming(productId) {
  return current(productId)?.progress.timing ?? null
}

// Trang đang chơi dở của mã đang dùng (null khi chưa có)
export function getProgressPath(productId) {
  return current(productId)?.progress.path ?? null
}

export function subscribeProgress(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function pausePlay(productId) {
  const entry = current(productId)
  if (!entry) return
  const now = Date.now()
  const timing = tick(entry.progress.timing, now)
  if (timing.pausedAt || timing.stoppedAt) return
  update(productId, { timing: { ...timing, pausedAt: now } })
}

// Bấm Tiếp tục: đồng hồ chạy lại từ lúc này, khoảng tạm dừng không được cộng
export function resumePlay(productId) {
  const timing = current(productId)?.progress.timing
  if (!timing?.pausedAt) return
  update(productId, { timing: { ...timing, pausedAt: null, lastAt: Date.now() } })
}

// Gửi thời gian của lượt chơi đã xong lên máy chủ (gửi lại cùng lượt thì máy chủ không ghi thêm).
// Trả về { seconds, fasterThan, compared }: fasterThan = % lượt chơi khác chậm hơn, null khi chưa đủ dữ liệu so sánh.
export function fetchPlayResult(productId) {
  const entry = current(productId)
  const timing = entry?.progress.timing
  if (!timing?.stoppedAt) return Promise.reject(new Error('Lượt chơi chưa kết thúc'))
  const key = `${entry.key}:${timing.startedAt}`
  if (!results.has(key)) {
    const request = lookupLocation().then((location) =>
      callBackend('result', {
        productId,
        code: entry.code,
        runId: timing.startedAt,
        seconds: Math.round(timing.elapsed / 1000),
        location,
      }),
    )
    // Lỗi mạng: lần gọi sau (mở lại trang Tóm tắt) thử gửi lại
    request.catch(() => results.delete(key))
    results.set(key, request)
  }
  return results.get(key)
}

export function getSavedSelection(productId, questionId) {
  return current(productId)?.progress.selections[questionId] ?? []
}

export function saveSelection(productId, questionId, optionIds) {
  const entry = current(productId)
  if (!entry) return
  update(productId, { selections: { ...entry.progress.selections, [questionId]: optionIds } })
}
