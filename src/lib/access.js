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
