import { buyUrl } from '../data/home'

// Nút "Mua ngay" dùng chung (Trang chủ, Access Page); chưa có link thì để nút trơn
export function BuyButton() {
  return buyUrl ? (
    <a href={buyUrl} className="buy-button">
      Mua ngay
    </a>
  ) : (
    <button type="button" className="buy-button">
      Mua ngay
    </button>
  )
}
