import { Link, useParams } from 'react-router-dom'
import { getAccessPage } from '../data/access'
import { getQuestion } from '../data/product1'
import { ComingSoonPage } from './ComingSoonPage'

// Trang hướng dẫn ngắn ngay sau khi nhập đúng mã (lượt chơi bắt đầu từ Câu hỏi 1), theo Canva "Web" trang 23.
// Một tờ giấy ở giữa, mép tờ giấy nhoè dần ra nền trang.
export function PlayIntroPage() {
  const { productId } = useParams()
  const access = getAccessPage(productId)
  if (!access) return <ComingSoonPage />

  const [, , objectiveId, questionId] = access.next.split('/')
  const firstQuestion = getQuestion(productId, objectiveId, questionId)
  const start = (
    <Link to={access.next} replace className="intro-start-link">
      BẮT ĐẦU PHÁ ÁN
    </Link>
  )

  return (
    <>
      <title>{`Hướng dẫn · ${access.title} · Kính Lúp`}</title>
      <section className="px-4 py-14 sm:px-8 sm:py-20 lg:py-24" aria-labelledby="intro-title">
        <article className="intro-sheet mx-auto max-w-3xl px-5 py-10 sm:px-12 sm:py-14">
          <header className="text-balance text-center text-lg font-bold leading-snug sm:text-2xl">
            <h1 id="intro-title">Chưa biết bắt đầu từ đâu? Đừng lo, Kính Lúp sẽ đồng hành cùng bạn nhé.</h1>
            <p className="mt-5">Nhưng nếu bạn đã quen thuộc với quá trình phá án thì {start} nào.</p>
          </header>

          <ol className="intro-steps mt-10 sm:mt-12">
            <li>
              <StepTitle n={1}>Kiểm tra hồ sơ</StepTitle>
              <p>Đầu tiên, bạn hãy kiểm tra xem bộ hồ sơ mình nhận được đã hoàn chỉnh chưa nhé.</p>
              <p>
                Nếu phát hiện hồ sơ có dấu hiệu hư hỏng hoặc thiếu sót, bạn vui lòng truy cập ngay mục{' '}
                <Link to="/ho-tro/ho-so" className="inline-link">
                  Hồ sơ
                </Link>{' '}
                để Kính Lúp hỗ trợ bạn kịp thời.
              </p>
            </li>

            <li>
              <StepTitle n={2}>Xác định mục tiêu điều tra của từng Giai đoạn</StepTitle>
              <p>Bạn sẽ thấy mục tiêu ngay đầu trang khi bấm BẮT ĐẦU PHÁ ÁN.</p>
              {firstQuestion ? (
                <div className="intro-band mt-5" aria-hidden="true">
                  <span className="intro-band__stage">
                    <span className="size-1.5 rounded-full bg-maroon" />
                    {firstQuestion.stage}
                  </span>
                  <span className="intro-band__title">{firstQuestion.heading}</span>
                </div>
              ) : null}
            </li>

            <li>
              <StepTitle n={3}>Lập luận từ hồ sơ được bàn giao</StepTitle>
              <p>
                Đây là lúc các bạn phát huy tối đa kỹ năng quan sát và tư duy suy luận để truy vết các dữ kiện từ bộ hồ
                sơ được cung cấp.
              </p>
            </li>

            <li className="grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10">
              <div>
                <StepTitle n={4}>Kiểm tra đáp án</StepTitle>
                <p>Bạn hãy nhập đáp án hoặc chọn đáp án theo yêu cầu nhé.</p>
              </div>
              <PhoneMock />
            </li>
          </ol>

          <footer className="mt-12 border-t border-maroon/20 pt-10 text-center text-lg font-bold leading-snug sm:text-2xl">
            <p className="text-balance">Các bạn đã sẵn sàng để vén màn toàn bộ bí mật chưa?</p>
            <p className="mt-5">{start} nào.</p>
          </footer>
        </article>
      </section>
    </>
  )
}

function StepTitle({ n, children }) {
  return (
    <h2 className="intro-step__title">
      <span className="intro-step__number">Bước {n}</span>
      <span>{children}</span>
    </h2>
  )
}

// Minh hoạ trang câu hỏi trên điện thoại, chữ được làm mờ
function PhoneMock() {
  return (
    <div className="intro-phone mx-auto" aria-hidden="true">
      <div className="intro-phone__screen">
        <div className="intro-phone__header">
          <span className="intro-phone__blur w-7" />
          <span className="intro-phone__search" />
        </div>
        <div className="intro-phone__band">
          <span className="intro-phone__blur mx-auto w-12 bg-blush/80" />
          <span className="intro-phone__blur mx-auto mt-2 h-2.5 w-24 bg-cream/70" />
          <span className="intro-phone__blur mx-auto mt-1 h-2.5 w-20 bg-cream/70" />
        </div>
        <div className="intro-phone__sheet">
          {[16, 12, 18, 10, 14].map((w, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="intro-phone__box" />
              <span className="intro-phone__blur" style={{ width: `${w * 0.25}rem` }} />
            </span>
          ))}
          <span className="mt-1 flex justify-between border-t border-maroon/20 pt-2">
            <span className="intro-phone__pill" />
            <span className="intro-phone__pill rounded-sm" />
          </span>
        </div>
      </div>
    </div>
  )
}
