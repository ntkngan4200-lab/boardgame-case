import mascot from '../assets/brand/mascot-chao.png'
import { CaseBand } from '../components/CaseBand'

// Trang "Về Kính Lúp" theo thiết kế Drive "Web/About Us.png"
export function AboutPage() {
  return (
    <>
      <title>Về Kính Lúp · Kính Lúp</title>
      <CaseBand stage="Kính Lúp" heading="Về Kính Lúp" />

      <section className="px-4 pt-12 sm:px-8 sm:pt-16">
        <div className="answer-sheet support-copy mx-auto max-w-3xl px-5 py-8 sm:px-12 sm:py-12">
          {/* Mascot hàng 4, cột 1 trong "Bảng 25 tư thế mascot đáng yêu" */}
          <div className="mb-6 flex items-center gap-4 sm:mb-8 sm:gap-6">
            <img src={mascot} alt="" width="156" height="213" className="h-24 w-auto shrink-0 sm:h-32" />
            <h2 className="font-display text-3xl leading-tight tracking-wide text-maroon sm:text-5xl">
              Xin chào,
              <br />
              Tụi mình là <span className="whitespace-nowrap">Kính Lúp!</span>
            </h2>
          </div>
          <p>
            Bắt đầu từ niềm yêu thích dành cho những câu chuyện trinh thám và trò chơi suy luận, tụi mình tạo nên những
            bộ trò chơi phá án được chăm chút từ cốt truyện đến từng vật chứng.
          </p>
          <p>
            Mỗi vụ án mở ra một thế giới riêng, nơi những lời khai, mối quan hệ và dấu vết đan xen, tạo nên những góc
            nhìn khác nhau về cùng một sự việc. Không có sẵn câu trả lời, bạn sẽ là người kết nối các manh mối và tự
            mình đi đến sự thật.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12">
        <div className="answer-sheet support-copy mx-auto max-w-3xl rotate-[-0.6deg] border-l-8 border-[rgb(var(--red))] px-5 py-8 sm:px-12 sm:py-10">
          <h2 className="font-display text-3xl leading-tight tracking-wide text-maroon sm:text-5xl">
            Insight starts in sight.
          </h2>
          <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[rgb(var(--red))] sm:text-sm">
            Tinh ý từ tinh mắt.
          </p>
          <p className="mt-5">
            Sự thật luôn ở ngay trước mắt, ẩn trong những chi tiết mà ta vô tình bỏ qua. Một manh mối tưởng chừng vô
            nghĩa cũng có thể trở thành chìa khóa, thay đổi hoàn toàn cách bạn nhìn nhận câu chuyện.
          </p>
        </div>
      </section>

      <section aria-labelledby="nguoi-sang-lap" className="pb-24 sm:pb-32">
        <div className="case-band px-4 py-10 text-center sm:px-8 sm:py-12">
          <h2 id="nguoi-sang-lap" className="case-band__title relative z-10 font-display text-cream">
            Về người sáng lập
          </h2>
        </div>
        {/* Nội dung về người sáng lập: điền sau */}
      </section>
    </>
  )
}
