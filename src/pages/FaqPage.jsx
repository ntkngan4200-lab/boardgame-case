import { BuyButton } from '../components/BuyButton'
import { CaseBand } from '../components/CaseBand'
import { FoldList } from '../components/FoldList'
import { socialLinks } from '../data/site'

// Tên mạng xã hội gạch dưới; có link (điền trong src/data/site.js) thì bấm được
function SocialName({ id, children }) {
  const href = socialLinks.find((link) => link.id === id)?.href
  return href ? (
    <a href={href} className="inline-link" target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <span className="font-bold underline decoration-[rgb(var(--red))] decoration-2 underline-offset-[0.22em]">{children}</span>
  )
}

// Câu hỏi từ file "FAQ's" trong thư mục Web; câu trả lời theo nội dung người dùng cung cấp
const questions = [
  {
    title: 'Các Vụ án của Kính Lúp có phải là vụ án có thật không?',
    body: (
      <p>
        Không đâu nha. Các vụ án đều là sản phẩm hoàn toàn từ trí tưởng tượng của Kính Lúp. Mọi sự trùng hợp với nhân
        vật hay sự việc có thật (nếu có) đều hoàn toàn là ngẫu nhiên.
      </p>
    ),
  },
  {
    title: 'Một Vụ án có thể chơi tối đa bao nhiêu người?',
    body: (
      <p>
        Trò chơi không giới hạn số lượng người tham gia. Vì mỗi vụ án sở hữu lượng khá lớn hồ sơ cần nghiên cứu, nên dù
        nhóm có đông người, ai cũng sẽ có phần việc riêng để thỏa sức đóng góp. Tuy nhiên, nếu nhóm của bạn có từ 6–8
        thành viên trở lên, bạn hoàn toàn có thể cân nhắc chia thành nhiều đội nhỏ để cuộc đua phá án thêm phần kịch
        tính.
      </p>
    ),
  },
  {
    title: 'Mỗi Vụ án chỉ chơi được một lần thôi sao?',
    body: (
      <>
        <p>
          Đúng vậy. Giống như việc đọc một cuốn tiểu thuyết hay thưởng thức một bộ phim trinh thám, khi đã biết trước
          cái kết, trải nghiệm hồi hộp ban đầu sẽ khó lòng trọn vẹn như lần đầu tiên.
        </p>
        <p>
          Tuy nhiên, nếu bạn bảo quản bộ hồ sơ nguyên vẹn sau khi hoàn thành, bạn hoàn toàn có thể nhượng lại vụ án cho
          những bạn cùng mê trinh thám khác để lan tỏa niềm vui này.
        </p>
      </>
    ),
  },
  {
    title: 'Mất bao lâu để chơi xong một Vụ án?',
    body: (
      <>
        <p>Thời gian phá án trung bình dao động khoảng 2–3 tiếng.</p>
        <p>
          Khoảng thời gian này có thể chênh lệch tùy thuộc vào quy mô nhóm chơi, năng lực quan sát và một chút may mắn;
          nhưng phần lớn các nhóm từ 2 người trở lên đều có thể giải mã thành công vụ án trong khoảng 2–6 tiếng.
        </p>
      </>
    ),
  },
  {
    title: 'Có thể chơi Vụ án của Kính Lúp một mình không?',
    body: (
      <p>
        Tất nhiên là được rồi! Bạn sẽ có một hành trình thử thách hơn một chút, nhưng đổi lại cảm giác chinh phục cũng
        sẽ vô cùng cuốn hút và đáng nhớ.
      </p>
    ),
  },
  {
    title: 'Vụ án phù hợp với độ tuổi nào?',
    body: (
      <>
        <p>
          Phần lớn các vụ án của Kính Lúp được thiết kế chuyên biệt dành cho người chơi từ 16 tuổi trở lên. Những người
          chơi nhỏ tuổi hơn có thể sẽ cần thêm chút sự hỗ trợ, hướng dẫn từ anh chị hoặc người lớn.
        </p>
        <p>
          Nếu được các bạn nhỏ quan tâm, Kính Lúp chắc chắn sẽ cân nhắc phát triển thêm các dòng vụ án thân thiện hơn
          với lứa tuổi nhỏ, hoàn toàn không chứa yếu tố giết người, bạo lực hay các chủ đề nhạy cảm dành cho người lớn.
        </p>
      </>
    ),
  },
  {
    title: 'Có thể mua Vụ án của Kính Lúp ở đâu?',
    body: (
      <p>
        Bạn có thể dễ dàng tìm mua sản phẩm tại các kênh mạng xã hội chính thức của Kính Lúp, bao gồm{' '}
        <SocialName id="facebook">Facebook</SocialName>, <SocialName id="tiktok">Tiktok</SocialName>,{' '}
        <SocialName id="threads">Threads</SocialName>, <SocialName id="instagram">Instagram</SocialName> và các sàn
        thương mại điện tử như <SocialName id="shopee">Shopee</SocialName>.
      </p>
    ),
  },
]

export function FaqPage() {
  return (
    <>
      <title>FAQ&apos;s · Hỗ trợ · Kính Lúp</title>
      <CaseBand stage="Hỗ trợ · FAQ's" heading="Câu hỏi thường gặp" />

      <FoldList items={questions.map((question, index) => ({ ...question, label: `Câu hỏi ${index + 1}` }))} />

      <div className="flex justify-center px-4 pb-20 pt-12 sm:pt-14">
        <BuyButton />
      </div>
    </>
  )
}
