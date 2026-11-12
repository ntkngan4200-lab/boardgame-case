import { Link } from 'react-router-dom'
import { BuyButton } from '../components/BuyButton'
import { CaseBand } from '../components/CaseBand'
import { FoldList } from '../components/FoldList'
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
      // Cùng bố cục Bước 1: chữ bên trái, decal bên phải
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center sm:gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <p>
          Tiếp theo, hãy quét mã QR và nhập mã bảo mật được cung cấp trên bìa thư để truy cập trang điện tử của vụ án.
          Đây là không gian để bạn vừa đối chiếu đáp án từ các phán đoán của mình, vừa nhận thêm những gợi ý mấu chốt
          cho hành trình điều tra.
        </p>
        <GuideImage image={guideImages.decal} className="mx-auto w-3/5 sm:w-full" />
      </div>
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
          được cung cấp. Những manh mối đắt giá đôi khi ẩn giấu ở những chi tiết nhỏ nhất — <em>Insight starts in sight!</em>
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

      <FoldList items={steps.map((step, index) => ({ ...step, label: `Bước ${index + 1}` }))} />

      <div className="flex justify-center px-4 pb-20 pt-12 sm:pt-14">
        <BuyButton />
      </div>
    </>
  )
}
