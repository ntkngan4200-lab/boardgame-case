import { getExplanation, getQuestion } from '../data/product1'
import { getAccessSession } from './access'
import { callBackend } from './backend'
import { lookupLocation } from './location'

// Tiến trình chơi theo mã truy cập: { path, pageLabel, selections: { [questionId]: optionIds }, finished, updatedAt }.
// Lưu ngay vào localStorage (mở lại nhanh trên thiết bị này) và gửi lên Apps Script để mở lại trên thiết bị khác.
const localKey = (productId, code) => `kinh-lup:tien-trinh:${productId}:${code}`
const cache = new Map()
let saveTimer

function emptyProgress() {
  return { path: null, pageLabel: null, selections: {}, finished: false, updatedAt: 0 }
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

function update(productId, change) {
  const entry = current(productId)
  if (!entry) return
  const progress = { ...entry.progress, ...change, updatedAt: Date.now() }
  cache.set(entry.key, progress)
  writeLocal(productId, entry.code, progress)
  // Gộp các lần chọn liên tiếp thành một lần gửi
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    callBackend('progress', { productId, code: entry.code, progress }, { keepalive: true }).catch((error) =>
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

// Vừa nhập đúng mã: ghi lượt truy cập, lấy tiến trình mới nhất (máy chủ hoặc thiết bị này), trả về trang chơi tiếp.
// Mã đã chơi tới trang cuối của vụ án thì bắt đầu lại từ Câu hỏi 1, xoá các lựa chọn cũ.
export async function openSession(access, code) {
  const { productId } = access
  let remote = null
  try {
    const result = await callBackend('access', {
      productId,
      code,
      location: await lookupLocation(),
      startLabel: describePlayPath(access.next),
    })
    remote = result.progress
  } catch (error) {
    // Máy chủ lỗi: vẫn cho chơi tiếp bằng tiến trình trên thiết bị này
    console.warn('[Kính Lúp] Chưa ghi được lượt truy cập', error)
  }
  const local = readLocal(productId, code)
  const latest = (remote?.updatedAt ?? 0) > (local?.updatedAt ?? 0) ? remote : local
  const progress = !latest || latest.finished ? emptyProgress() : { ...emptyProgress(), ...latest }
  cache.set(`${productId}:${code}`, progress)
  return progress.path ?? access.next
}

// Ghi trang đang chơi (gọi mỗi khi đổi trang trong vụ án). Trang Trả lời sai: lần sau mở lại chính câu hỏi đó.
export function recordVisit(access, pathname) {
  const path = pathname.replace(/\/sai$/, '')
  const pageLabel = describePlayPath(path)
  const entry = current(access.productId)
  if (!entry || !pageLabel || entry.progress.path === path) return
  update(access.productId, { path, pageLabel, finished: entry.progress.finished || path === access.finalPath })
}

export function getSavedSelection(productId, questionId) {
  return current(productId)?.progress.selections[questionId] ?? []
}

export function saveSelection(productId, questionId, optionIds) {
  const entry = current(productId)
  if (!entry) return
  update(productId, { selections: { ...entry.progress.selections, [questionId]: optionIds } })
}
