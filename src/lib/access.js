import { matchPath } from 'react-router-dom'
import { getAccessPage } from '../data/access'

// Ghi nhớ mã truy cập đã nhập đúng trong phiên trình duyệt (mất khi đóng tab) để lưu tiến trình theo mã.
// Chỉ là chặn phía trình duyệt cho trải nghiệm chơi, không phải bảo mật thật.
const storageKey = (productId) => `kinh-lup:truy-cap:${productId}`
const sessionsInMemory = new Map()

// { code, admin } của sản phẩm đang chơi, hoặc null khi chưa nhập mã
export function getAccessSession(productId) {
  if (sessionsInMemory.has(productId)) return sessionsInMemory.get(productId)
  try {
    const session = JSON.parse(sessionStorage.getItem(storageKey(productId)))
    return session?.code ? session : null
  } catch {
    return null
  }
}

export function hasAccess(productId) {
  return getAccessSession(productId) !== null
}

export function grantAccess(productId, session) {
  sessionsInMemory.set(productId, session)
  try {
    sessionStorage.setItem(storageKey(productId), JSON.stringify(session))
  } catch {
    // Trình duyệt chặn sessionStorage: vẫn giữ quyền trong bộ nhớ tới khi tải lại trang
  }
}

// Mở thẳng link hoặc quét QR vào trang chơi (/p1/o1/q1, /p1/o2/giai-thich, /p1/tom-tat…) khi chưa nhập mã:
// đổi URL sang trang Nhập mã TRƯỚC khi React vẽ lần đầu, để trang hiện một lần, không hiện khung trống rồi mới đổi trang.
// Trang Nhập mã đọc state.from để quay lại đúng trang này sau khi nhập đúng mã (giống RequireAccess).
export function redirectBlockedDeepLink() {
  const { pathname } = window.location
  const match = matchPath('/:productId/:objectiveId/:page/*', pathname) ?? matchPath('/:productId/tom-tat', pathname)
  const productId = match?.params.productId
  if (!productId || !getAccessPage(productId) || hasAccess(productId)) return
  window.history.replaceState({ usr: { from: pathname } }, '', `/${productId}/truy-cap`)
}
