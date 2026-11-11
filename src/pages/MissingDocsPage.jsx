import mascot from '../assets/brand/mascot-dung.png'
import { CaseBand } from '../components/CaseBand'
import { ProductCard } from '../components/ProductCarousel'
import { docRequestProducts } from '../data/support'

export function MissingDocsPage() {
  return (
    <>
      <title>Hồ sơ · Hỗ trợ · Kính Lúp</title>
      <CaseBand stage="Hỗ trợ · Hồ sơ" heading="HỖ TRỢ CUNG CẤP HỒ SƠ BỊ THIẾU/HƯ HỎNG" />

      {/* Chừa chỗ phía trên cho mascot đứng trên mép khung văn bản */}
      <section className="px-4 pt-28 sm:px-8 sm:pt-36">
        <div className="answer-sheet support-copy relative mx-auto max-w-3xl px-5 py-8 sm:px-12 sm:py-12">
          {/* Mascot hàng 4, cột 3 trong "Bảng 25 tư thế mascot đáng yêu" */}
          <img src={mascot} alt="" width="155" height="202" className="mascot-perch" />
          <p>
            Kính Lúp rất tiếc vì trải nghiệm của bạn với trò chơi chưa thực sự trọn vẹn do một số vấn đề về hồ sơ.
          </p>
          <p>
            Bạn vui lòng chọn{' '}
            <a href="#chon-vu-an" className="inline-link">
              Vụ án
            </a>{' '}
            cần bổ sung hồ sơ và để lại thông tin liên hệ, Kính Lúp sẽ chủ động gửi bản điện tử cần thiết đến bạn
            nhé.
          </p>
          <p>
            <strong>Lưu ý nhỏ:</strong> nếu vụ án có từ 3 hồ sơ trở lên bị thiếu hoặc hư hỏng, bạn hãy nhắn trực
            tiếp cho Kính Lúp để được hỗ trợ nhận lại bộ hồ sơ hoàn chỉnh hơn.
          </p>
          <p>
            Một lần nữa, cảm ơn bạn đã tin tưởng và đồng hành cùng Kính Lúp. Bọn mình sẽ cố gắng hoàn thiện hơn để bạn
            không phải ghé thăm mục này nữa nha.
          </p>
        </div>
      </section>

      <section id="chon-vu-an" className="scroll-mt-6 px-4 pb-16 pt-14 sm:px-8 sm:pt-16" aria-labelledby="chon-vu-an-tieu-de">
        <h2 id="chon-vu-an-tieu-de" className="text-center font-display text-3xl tracking-wide text-cream sm:text-4xl">
          Chọn Vụ án
        </h2>
        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:gap-x-8 sm:gap-y-10">
          {docRequestProducts.map((product) => (
            <ProductCard key={product.id} product={product} to={product.to} className="case-grid__item" />
          ))}
        </ul>
      </section>
    </>
  )
}
