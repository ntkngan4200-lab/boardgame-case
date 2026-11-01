import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const poster = (
    <div className="product-card__poster">
      <img src={product.poster} alt="" width="900" height="900" loading="lazy" draggable="false" />
      {product.comingSoon ? <span className="product-card__soon">Sắp ra mắt</span> : null}
    </div>
  )

  return (
    // data-featured: thẻ được căn giữa khi mở trang
    <li className="product-card" data-featured={product.featured ? 'true' : undefined}>
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

function ArrowIcon({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'left' ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  )
}

// Thanh vụ án trượt ngang: vuốt trên điện thoại, hai nút mũi tên trên mọi màn hình
export function ProductCarousel({ products, label }) {
  const trackId = useId()
  const trackRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  useEffect(() => {
    const track = trackRef.current
    const updateEdges = () => {
      setAtStart(track.scrollLeft <= 4)
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4)
    }

    const featured = track.querySelector('[data-featured="true"]')
    if (featured) {
      track.scrollLeft = featured.offsetLeft - (track.clientWidth - featured.clientWidth) / 2
    }
    updateEdges()

    track.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      track.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [])

  // Nhảy đúng một thẻ mỗi lần bấm (không dùng hiệu ứng cuộn mượt)
  function step(direction) {
    const track = trackRef.current
    const card = track.querySelector('.product-card')
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({ left: direction * (card.clientWidth + gap) })
  }

  return (
    <div className="product-carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul id={trackId} ref={trackRef} className="product-track">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Vụ án trước"
          aria-controls={trackId}
          disabled={atStart}
          onClick={() => step(-1)}
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Vụ án tiếp theo"
          aria-controls={trackId}
          disabled={atEnd}
          onClick={() => step(1)}
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  )
}
