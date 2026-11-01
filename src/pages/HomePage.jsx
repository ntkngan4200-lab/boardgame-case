import { BuyButton } from '../components/BuyButton'
import { ProductCarousel } from '../components/ProductCarousel'
import { hook, products } from '../data/home'

export function HomePage() {
  return (
    <>
      <title>Kính Lúp</title>
      <h1 className="sr-only">Kính Lúp</h1>

      {/* Hook: ảnh tràn hết bề ngang ngay đầu trang, giữ đúng tỉ lệ gốc, không bị cắt */}
      <section aria-label="Giới thiệu">
        <figure className="full-bleed-image">
          <img
            srcSet={hook.srcSet}
            sizes="100vw"
            src={hook.src}
            width={hook.width}
            height={hook.height}
            alt={hook.alt}
            fetchPriority="high"
          />
        </figure>
        <div className="mt-6 flex justify-center px-3 sm:mt-8">
          <a href="#vu-an" className="pill-button pill-button--light">
            Khám phá các Vụ án
          </a>
        </div>
      </section>

      <section id="vu-an" className="scroll-mt-6 px-3 pb-6 pt-14 sm:px-8 sm:pt-20" aria-labelledby="vu-an-tieu-de">
        <div className="mx-auto max-w-6xl">
          <h2 id="vu-an-tieu-de" className="text-center font-display text-4xl tracking-wide text-cream sm:text-5xl">
            Vụ án
          </h2>
          <div className="mt-8 sm:mt-10">
            <ProductCarousel products={products} label="Danh sách vụ án" />
          </div>
          <div className="mt-10 flex justify-center">
            <BuyButton />
          </div>
        </div>
      </section>

      {/* Để trống, điền sau: link quảng cáo, mua hàng, feedback */}
      <div className="min-h-24" />
    </>
  )
}
