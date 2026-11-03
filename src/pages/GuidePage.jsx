import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import mascot from '../assets/brand/mascot.webp'
import { BuyButton } from '../components/BuyButton'
import { CaseBand } from '../components/CaseBand'
import { guideDocuments, guideImages } from '../data/guide'

function GuideImage({ image, className = '' }) {
  return (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading="lazy"
      className={`guide-paper ${className}`}
    />
  )
}

// Nét cọ ngăn cách các bước (vẽ tay như reference)
function BrushDivider() {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 16" preserveAspectRatio="none" className="brush-divider">
      <path d="M3 10.6c58-3.3 132-4.7 214-5.2 96-.6 189-1.5 292-3.1 43-.7 85-1 128-.9l-.5 3.4c-52 1.4-109 2.7-171 3.7-101 1.6-196 2.6-286 3.9-61 .9-118 1.6-176 2.2z" />
      <path d="M48 13.6c96-1.4 214-2.6 352-4.1M470 7.4c52-.8 101-1.4 150-2" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9l7 7 7-7" />
    </svg>
  )
}

// Mỗi bước: chỉ hiện tiêu đề + mũi tên; bấm tiêu đề hoặc mũi tên để mở nội dung (không hiệu ứng)
function GuideStep({ number, title, children }) {
  return (
    <details className="guide-step">
      <summary className="guide-step__summary">
        <h2 className="min-w-0">
          <span className="guide-step__number">Bước {number}</span>
          <span className="sr-only">: </span>
          <span className="guide-step__title">{title}</span>
        </h2>
        <span className="guide-step__chevron">
          <ChevronIcon />
        </span>
      </summary>
      <div className="support-copy pb-8 pt-2 sm:pb-10">{children}</div>
    </details>
  )
}

const steps = [
  {
    title: 'Kiểm tra hồ sơ',
    body: (
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center sm:gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <p>
            Trước khi bắt đầu giải mã các vụ án, bạn hãy kiểm tra kỹ xem Kính Lúp đã bàn giao đầy đủ toàn bộ hồ sơ chưa
            nhé.
          </p>
          <p>
            Nếu phát hiện hồ sơ có dấu hiệu hư hỏng hoặc thiếu sót, bạn vui lòng truy cập ngay mục{' '}
            <Link to="/ho-tro/ho-so" className="inline-link">
              Hồ sơ
            </Link>{' '}
            để Kính Lúp hỗ trợ bạn kịp thời.
          </p>
        </div>
        <GuideImage image={guideImages.danhMuc} className="mx-auto w-3/5 sm:w-full" />
      </div>
    ),
  },
  {
    title: 'Truy cập trang điện tử của vụ án',
    body: (
      <p>
        Tiếp theo, hãy quét mã QR và nhập mã bảo mật được cung cấp trên bìa thư để truy cập trang điện tử của vụ án.
        Đây là không gian để bạn vừa đối chiếu đáp án từ các phán đoán của mình, vừa nhận thêm những gợi ý mấu chốt
        cho hành trình điều tra.
      </p>
    ),
  },
  {
    title: 'Xác định mục tiêu điều tra của từng Giai đoạn',
    body: (
      // Điện thoại: chữ ở trên, hai ảnh nằm cạnh nhau bên dưới; laptop: Thư | chữ | tiêu đề giai đoạn
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-x-4 gap-y-6 lg:grid-cols-[11rem_minmax(0,1fr)_19rem] lg:gap-x-8">
        <p className="col-span-2 lg:order-2 lg:col-span-1">
          Việc xác định rõ mục tiêu cho từng giai đoạn sẽ giúp quá trình phá án của bạn diễn ra suôn sẻ và logic hơn.
          Bạn có thể xác định mục tiêu thông qua phần “Thư gửi thám tử” hoặc tiêu đề của từng giai đoạn trên trang điện
          tử của vụ án.
        </p>
        <GuideImage image={guideImages.thu} className="w-full lg:order-1" />
        <GuideImage image={guideImages.giaiDoan} className="w-full lg:order-3" />
      </div>
    ),
  },
  {
    title: 'Lập luận từ hồ sơ được bàn giao',
    body: (
      <>
        <p>
          Đây là lúc các bạn phát huy tối đa kỹ năng quan sát và tư duy suy luận để truy vết các dữ kiện từ bộ hồ sơ
          được cung cấp. Những manh mối đắt giá đôi khi ẩn giấu ở những chi tiết nhỏ nhất — <em>Insight starts in sight!</em>{' '}
          <img src={mascot} alt="" width="120" height="160" className="mascot-inline" />
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-4">
          {guideDocuments.map((document) => (
            <li key={document.id}>
              <GuideImage image={document} className="aspect-[7/10] w-full object-cover object-top" />
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: 'Kiểm tra đáp án',
    body: (
      <div className="grid gap-8 sm:grid-cols-2 sm:items-center sm:gap-10">
        <p>
          Khoảnh khắc quyết định để các ẩn số chính thức lộ diện. Hãy đưa ra kết luận cuối cùng dựa trên chuỗi suy luận
          của bạn. Các bạn đã sẵn sàng để vén màn toàn bộ bí mật chưa?
        </p>
        <PhoneMockup image={guideImages.q1Mobile} />
      </div>
    ),
  },
]

// Khung điện thoại: màn hình cuộn dọc để xem cả Header, các ô lựa chọn và Footnote
function PhoneMockup({ image }) {
  return (
    <div className="phone-frame mx-auto">
      <span className="phone-frame__notch" aria-hidden="true" />
      <div className="phone-frame__screen" tabIndex={0} role="region" aria-label="Trang câu hỏi trên điện thoại, cuộn để xem">
        <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" className="block w-full" />
      </div>
    </div>
  )
}

export function GuidePage() {
  return (
    <>
      <title>Hướng dẫn chơi · Hỗ trợ · Kính Lúp</title>
      <CaseBand stage="Hỗ trợ" heading="Hướng dẫn chơi" />

      <section className="px-4 pt-12 sm:px-8 sm:pt-16">
        <div className="answer-sheet mx-auto max-w-5xl px-5 py-4 sm:px-12 sm:py-8">
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              {index > 0 ? <BrushDivider /> : null}
              <GuideStep number={index + 1} title={step.title}>
                {step.body}
              </GuideStep>
            </Fragment>
          ))}
        </div>
      </section>

      <div className="flex justify-center px-4 pb-20 pt-12 sm:pt-14">
        <BuyButton />
      </div>
    </>
  )
}
