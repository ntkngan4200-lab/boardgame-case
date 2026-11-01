// Ghi nhớ sản phẩm đã nhập đúng mã truy cập trong phiên trình duyệt (mất khi đóng tab).
// Chỉ là chặn phía trình duyệt cho trải nghiệm chơi, không phải bảo mật thật.
const storageKey = (productId) => `kinh-lup:truy-cap:${productId}`
const grantedInMemory = new Set()

export function hasAccess(productId) {
  if (grantedInMemory.has(productId)) return true
  try {
    return sessionStorage.getItem(storageKey(productId)) === '1'
  } catch {
    return false
  }
}

export function grantAccess(productId) {
  grantedInMemory.add(productId)
  try {
    sessionStorage.setItem(storageKey(productId), '1')
  } catch {
    // Trình duyệt chặn sessionStorage: vẫn giữ quyền trong bộ nhớ tới khi tải lại trang
  }
}
