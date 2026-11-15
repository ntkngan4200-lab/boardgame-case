import { Link } from 'react-router-dom'

// Thẻ dẫn tới product.to (Hỗ trợ › Hồ sơ truyền sẵn link phiếu yêu cầu hồ sơ); không có link thì chỉ hiện poster
function CaseCard({ product }) {
  const poster = (
    <div className="product-card__poster">
      <img src={product.poster} alt="" width="900" height="900" loading="lazy" draggable="false" />
      {product.comingSoon ? <span className="product-card__soon">Sắp ra mắt</span> : null}
    </div>
  )

  return (
    <li className="case-grid__item">
      {product.to ? (
        <Link to={product.to} className="product-card__link">
          {poster}
          <span className="product-card__title">{product.title}</span>
        </Link>
      ) : (
        <div className="product-card__link" role="img" aria-label="Vụ án sắp ra mắt">
          {poster}
        </div>
      )}
    </li>
  )
}

// Lưới vụ án 2 cột xếp dọc xuống (Trang chủ, Hỗ trợ › Hồ sơ)
export function CaseGrid({ products, className = '' }) {
  return (
    <ul className={`mx-auto grid max-w-3xl grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 ${className}`}>
      {products.map((product) => (
        <CaseCard key={product.id} product={product} />
      ))}
    </ul>
  )
}
