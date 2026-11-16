import bangTinImage from '../assets/evidence/bao-buon-lau.jpg'
import cctvImage from '../assets/evidence/cctv-21g00.jpg'
import ggMapsImage from '../assets/evidence/gg-maps.jpg'
import nanNhanImage from '../assets/evidence/nan-nhan.jpg'
import vatChungImage from '../assets/evidence/vat-chung.jpg'

// Product 1 — Vụ án Phạm Thùy Chi.
// Mỗi câu hỏi có key "<product>/<objective>/<question>" khớp với URL.
// pick: số lựa chọn người chơi phải đánh dấu (mặc định 1).
// answerHash = SHA-256 của "<id>:<các optionId đúng, sắp xếp, nối bằng dấu phẩy>", tạo bằng:
//   printf '%s' 'p1-o1-q1:buon-lau' | shasum -a 256
//   printf '%s' 'p1-o1-q2:tl-03,tl-22,tl-26' | shasum -a 256
//   printf '%s' 'p1-o2-q2:tl-23,tl-30' | shasum -a 256   (cặp thứ hai: 'p1-o2-q2:tl-22,tl-30')

// "Danh mục tài liệu" (Drive › Web) — STT = vị trí trong danh sách
const caseDocuments = [
  'Danh mục hồ sơ và vật chứng vụ án',
  'Chân dung nạn nhân Phạm Thùy Chi',
  'Bản tin ngày 10/10/2026',
  'Kết luận Giám định Tử thi',
  'Bản vẽ Mặt bằng Khách sạn Mai Hoa',
  'Biên bản Khám nghiệm Hiện trường',
  'Ảnh nhân chứng - Lê Văn Út',
  'Ảnh nhận dạng nghi phạm - Vũ Văn Dũng',
  'Ảnh nhận dạng nghi phạm - Bành Thu Cúc',
  'Ảnh nhận dạng nghi phạm - Trần Trung Đức',
  'Ảnh nhận dạng nghi phạm - Trần Chi Linh',
  'Lý lịch cá nhân - Vũ Văn Dũng',
  'Lý lịch cá nhân - Bành Thu Cúc',
  'Lý lịch cá nhân - Trần Trung Đức',
  'Lý lịch cá nhân - Trần Chi Linh',
  'Biên bản Lời khai - Vũ Văn Dũng',
  'Biên bản Lời khai - Bành Thu Cúc',
  'Biên bản Lời khai - Trần Trung Đức',
  'Biên bản Lời khai - Trần Chi Linh',
  'Biên bản Lời khai Nhân chứng - Lê Văn Út',
  'Ảnh vật chứng 1 - Bài thơ Trần Trung Đức viết cho Phạm Thùy Chi',
  'Ảnh vật chứng 2 - Vật chứng thu giữ tại hiện trường',
  'Ảnh hiện trường 1 - Thi thể nạn nhân Phạm Thùy Chi',
  'Ảnh hiện trường 2 - Phòng 404',
  'Ảnh hiện trường 3 - Phòng 403 với nhiều hình ảnh của Phạm Thùy Chi',
  'Ảnh trích xuất camera lúc 21g00 09/10/2026',
  'Ảnh trích xuất từ camera lúc 21g30 09/10/2026',
  'Thư gửi các thám tử - Giai đoạn 2',
  'Record cuộc gọi từ bàn lễ tân',
  'Ảnh chụp màn hình điện thoại của Phạm Thùy Chi',
  'Thư gửi các thám tử - Giai đoạn 3',
  'Biên bản Hỏi cung Bị can - Trần Chi Linh',
]

// Hồ sơ người chơi có trong tay tới STT maxNumber (mỗi giai đoạn mở thêm hồ sơ)
function documentOptions(maxNumber) {
  return caseDocuments.slice(0, maxNumber).map((label, index) => ({
    id: `tl-${String(index + 1).padStart(2, '0')}`,
    number: index + 1,
    label,
  }))
}

// Toàn bộ Danh mục hồ sơ (trang Hỗ trợ › Hồ sơ)
export const caseDocumentOptions = documentOptions(caseDocuments.length)

const questions = {
  'p1/o1/q1': {
    id: 'p1-o1-q1',
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    options: [
      { id: 'lam-gai', label: 'Làm gái' },
      { id: 'hen-ho', label: 'Hẹn hò' },
      { id: 'buon-lau', label: 'Buôn lậu' },
      { id: 'vuot-bien', label: 'Vượt biên' },
      { id: 'tham-gia-dinh', label: 'Thăm gia đình' },
      { id: 'nghi-duong', label: 'Nghỉ dưỡng' },
    ],
    answerHash: 'c0ce7f45e88d70ff2d00fae07c40bd3096fdc41415bf38e5f2ca5bdd59a9d0ed',
    backTo: '/p1/truy-cap',
    next: {
      correct: '/p1/o1/q2',
      wrong: '/p1/o1/q1/sai',
    },
  },
  'p1/o1/q2': {
    id: 'p1-o1-q2',
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    backTo: '/p1/o1/q1',
    prompt: 'Phạm Thùy Chi đến Khách sạn Mai Hoa để buôn lậu. Ba bằng chứng nào có thể chứng minh được việc đó?',
    pick: 3,
    options: documentOptions(27),
    answerHash: '5be24700b48924ee55aa5c60e7ccb7cd0d7487f17c2a341ac3b93f13d7307486',
    // Hash từng đáp án đúng ("<id>:<optionId>") để đếm số bằng chứng người chơi chọn đúng
    correctOptionHashes: [
      '1c133ea9dd4a3b7deb2054cfd8be9a2ba3e6b0f49a4727e75ccd9aeba3e82154',
      '30624a162015b359406fd7f737a617a49796d9deb32023a03bccee06ea150935',
      '6a621b6eb0934ef797294f7565e929e7dde16c40ca99afcde28d7a013bb7e4aa',
    ],
    next: {
      correct: '/p1/o1/giai-thich',
      wrong: '/p1/o1/q2/sai',
    },
  },
  'p1/o2/q1': {
    id: 'p1-o2-q1',
    stage: 'Giai đoạn 2',
    heading: 'Hung thủ đã sát hại Phạm Thùy Chi',
    backTo: '/p1/o1/giai-thich',
    options: [
      { id: 'tran-trung-duc', label: 'Trần Trung Đức' },
      { id: 'banh-thu-cuc', label: 'Bành Thu Cúc' },
      { id: 'vu-van-dung', label: 'Vũ Văn Dũng' },
      { id: 'tran-chi-linh', label: 'Trần Chi Linh' },
    ],
    answerHash: '72b9198b78b15e9bc85a9b1a039fbada40c37ded63f778d0c4cf198e507fb6be',
    next: {
      correct: '/p1/o2/q2',
      wrong: '/p1/o2/q1/sai',
    },
  },
  'p1/o2/q2': {
    id: 'p1-o2-q2',
    stage: 'Giai đoạn 2',
    heading: 'Hung thủ đã sát hại Phạm Thùy Chi',
    backTo: '/p1/o2/q1',
    prompt: 'Hai bằng chứng nào có thể chứng minh Trần Chi Linh là hung thủ sát hại Phạm Thùy Chi?',
    pick: 2,
    options: documentOptions(30),
    // Hai cặp đáp án đúng: tl-23 + tl-30 (Ảnh hiện trường 1 + Ảnh chụp màn hình) hoặc tl-22 + tl-30 (Ảnh vật chứng 2 + Ảnh chụp màn hình)
    answerHashes: [
      'e4151bd00948035a6efd84800a72165b032573ffe38fb648d9226dc9b943fbfd',
      '4cfef2a2a50354e1952529223515ea056ec3bb6ea79bb76c75aa59417ea93885',
    ],
    correctOptionHashes: [
      '8fd5241afdaaaf207f2429b0188ab9f1ad701f03ebed9bdca7b741bf934e8ad5',
      'c1481ba887bea9eee54f0854bcf2bbadbe95b1bdb0fe57d5c71508813346c30e',
      'e22e8cd2e430d08619f2fb7d604443619d31ce17b53db692a38d52decd00770d',
    ],
    next: {
      correct: '/p1/o2/giai-thich',
      wrong: '/p1/o2/q2/sai',
    },
  },
}

// False Answer Page của từng câu hỏi (cùng key với câu hỏi).
// hints: [] = không có gợi ý (ẩn nút Gợi ý); mỗi lần bấm "Gợi ý" mở thêm 1 mục theo thứ tự.
const falseAnswers = {
  'p1/o1/q1': {
    claim:
      'Phạm Thùy Chi không thật sự đến khách sạn vì lý do này. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    hints: [],
  },
  'p1/o1/q2': {
    // Chọn theo số bằng chứng đúng; không biết số (mở trực tiếp trang) thì dùng "default"
    claims: {
      0: 'Chưa có bằng chứng nào được chọn chứng minh trực tiếp mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      1: 'Chỉ 1/3 bằng chứng được chọn chứng minh trực tiếp mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      2: 'Chỉ 2/3 bằng chứng được chọn chứng minh trực tiếp mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      default: 'Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    },
    hints: [
      'Vật chứng thu giữ tại hiện trường có điểm gì bất thường?',
      'Tại sao Phạm Thùy Chi phải giữ một chiếc nhẫn bên trong túi váy?',
      'Liệu chiếc nhẫn Phạm Thùy Chi cất giữ có phải là chiếc duy nhất?',
    ],
  },
  'p1/o2/q1': {
    claim: 'Người này không phải là hung thủ đã sát hại Phạm Thùy Chi. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    hints: [],
  },
  'p1/o2/q2': {
    claims: {
      0: 'Chưa có bằng chứng nào được chọn chứng minh trực tiếp Trần Chi Linh là hung thủ đã sát hại Phạm Thùy Chi. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      1: 'Chỉ 1/2 bằng chứng được chọn chứng minh trực tiếp Trần Chi Linh là hung thủ đã sát hại Phạm Thùy Chi. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      default: 'Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    },
    hints: [
      'Ai là người có nhiều khả năng đã gặp nạn nhân cuối cùng?',
      'Tại sao Phạm Thùy Chi phải nắm chặt sợi dây chuyền trong giờ phút cuối cùng?',
    ],
  },
}

// Explanation Page sau khi trả lời đúng câu cuối của mỗi giai đoạn (key "<product>/<objective>").
// wall.items[].marks: chi tiết khoanh đỏ, u/v = vị trí theo tỉ lệ ảnh, r = bán kính theo bề rộng ảnh.
// wall.strings: cặp chi tiết được nối dây đỏ. layouts: wide (≥768px) và tall (điện thoại), đơn vị theo viewBox.
const explanations = {
  'p1/o1': {
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    conclusion: 'Ba bằng chứng trên đã chứng minh trực tiếp Phạm Thùy Chi đến Khách sạn Mai Hoa để buôn lậu',
    wall: {
      description:
        'Bức tường bằng chứng: Bản tin ngày 10/10/2026, Ảnh vật chứng 2 và Ảnh trích xuất camera lúc 21g00. Chiếc nhẫn đỏ trên tay hai người đàn ông trong bài báo, chiếc nhẫn đỏ số 2 trong vật chứng và chiếc nhẫn đỏ trên ngón tay người trong camera được khoanh đỏ và nối với nhau bằng dây đỏ.',
      items: [
        {
          id: 'bang-tin',
          src: bangTinImage,
          ratio: 1600 / 629,
          frame: 'clipping',
          caption: 'Bản tin ngày 10/10/2026',
          marks: [
            { id: 'nhan-bao-1', u: 0.724, v: 0.765, r: 0.028, ring: 0.011, lensAngle: 120 },
            { id: 'nhan-bao-2', u: 0.829, v: 0.774, r: 0.028, ring: 0.011, lensAngle: 60 },
          ],
        },
        {
          id: 'vat-chung',
          src: vatChungImage,
          ratio: 4 / 3,
          frame: 'polaroid',
          caption: 'Ảnh vật chứng 2',
          marks: [{ id: 'nhan-vat-chung', u: 0.116, v: 0.598, r: 0.065 }],
        },
        {
          id: 'cctv',
          src: cctvImage,
          ratio: 1240 / 827,
          frame: 'polaroid',
          caption: 'Ảnh trích xuất camera lúc 21g00',
          marks: [{ id: 'nhan-cctv', u: 0.5313, v: 0.423, r: 0.03, ring: 0.008, lensAngle: 15 }],
        },
      ],
      strings: [
        ['nhan-bao-1', 'nhan-vat-chung'],
        ['nhan-bao-2', 'nhan-cctv'],
        ['nhan-vat-chung', 'nhan-cctv'],
      ],
      layouts: {
        wide: {
          width: 1000,
          height: 790,
          captionSize: 14,
          strokeWidth: 2.4,
          minMarkRadius: 14,
          lensRadius: 46,
          lensGap: 30,
          place: {
            'bang-tin': { x: 200, y: 50, w: 600, rotate: -1.5 },
            'vat-chung': { x: 110, y: 440, w: 300, rotate: -4 },
            cctv: { x: 600, y: 430, w: 300, rotate: 3.5 },
          },
        },
        tall: {
          width: 600,
          height: 1400,
          captionSize: 19,
          strokeWidth: 3,
          minMarkRadius: 16,
          lensRadius: 56,
          lensGap: 34,
          place: {
            'bang-tin': { x: 30, y: 56, w: 540, rotate: -1.5 },
            'vat-chung': { x: 40, y: 410, w: 420, rotate: -3 },
            cctv: { x: 140, y: 920, w: 420, rotate: 2.5 },
          },
        },
      },
    },
    // Tờ ghi chú ghim trên bảng, giải thích vì sao ba bằng chứng nối được với nhau
    note: {
      label: 'Ghi chú điều tra',
      text: 'Phạm Thùy Chi không chỉ sở hữu chiếc nhẫn đỏ này mà còn tiếp xúc với người đàn ông đeo chiếc nhẫn tương tự. Chiếc nhẫn đó được nhận dạng là nhẫn của đường dây buôn lậu nhờ thông tin trong bản tin ngày 10/10/2026. Chính vì thế, có thể bước đầu khẳng định rằng Khách sạn Mai Hoa và Phạm Thùy Chi có khả năng liên quan đến đường dây buôn lậu thuốc lá điện tử.',
    },
    backTo: '/p1/o1/q2',
    next: {
      text: 'Hãy mở phong bì Giai đoạn 2 để truy vết Thủ phạm đã sát hại Phạm Thùy Chi',
      label: 'Giai đoạn 2',
      to: '/p1/o2/q1',
    },
  },
  'p1/o2': {
    stage: 'Giai đoạn 2',
    heading: 'Hung thủ đã sát hại Phạm Thùy Chi',
    conclusion: 'Hai bằng chứng trên đã chứng minh Trần Chi Linh là hung thủ đã sát hại Phạm Thùy Chi',
    wall: {
      description:
        'Bức tường bằng chứng: Ảnh hiện trường 1, Ảnh chụp màn hình điện thoại và Ảnh vật chứng 2. Sợi dây chuyền trong tay nạn nhân và sợi dây chuyền người phụ nữ đeo trên cổ được khoanh đỏ, nối bằng dây đỏ với nhau và với vật chứng số 3 là sợi dây chuyền có mặt hình chiếc nhẫn đỏ.',
      items: [
        {
          id: 'nan-nhan',
          src: nanNhanImage,
          ratio: 1200 / 675,
          frame: 'polaroid',
          caption: 'Ảnh hiện trường 1',
          marks: [{ id: 'day-chuyen-nan-nhan', u: 0.337, v: 0.803, r: 0.04, ring: 0.03, lensAngle: -5, handleAngle: -70 }],
        },
        {
          id: 'gg-maps',
          src: ggMapsImage,
          ratio: 1080 / 1920,
          frame: 'polaroid',
          caption: 'Ảnh chụp màn hình điện thoại',
          // Kính lúp đặt dưới bên phải người phụ nữ, ra ngoài ảnh để không che dây chuyền; ring nhỏ = phóng to hơn
          marks: [{ id: 'day-chuyen-le-tan', u: 0.772, v: 0.476, r: 0.06, ring: 0.02, lensAngle: 60, handleAngle: 50 }],
        },
        {
          id: 'vat-chung',
          src: vatChungImage,
          ratio: 4 / 3,
          frame: 'polaroid',
          caption: 'Ảnh vật chứng 2',
          marks: [{ id: 'day-chuyen-vat-chung', u: 0.293, v: 0.827, r: 0.05, circle: false }],
        },
      ],
      strings: [
        ['day-chuyen-nan-nhan', 'day-chuyen-le-tan'],
        ['day-chuyen-nan-nhan', 'day-chuyen-vat-chung'],
        ['day-chuyen-le-tan', 'day-chuyen-vat-chung'],
      ],
      layouts: {
        wide: {
          width: 1000,
          height: 820,
          captionSize: 14,
          strokeWidth: 2.4,
          minMarkRadius: 14,
          lensRadius: 46,
          lensGap: 30,
          place: {
            'nan-nhan': { x: 60, y: 50, w: 500, rotate: -2 },
            'gg-maps': { x: 635, y: 75, w: 300, rotate: 2 },
            'vat-chung': { x: 115, y: 440, w: 420, rotate: -1.5 },
          },
        },
        tall: {
          width: 600,
          height: 1540,
          captionSize: 19,
          strokeWidth: 3,
          minMarkRadius: 16,
          lensRadius: 56,
          lensGap: 34,
          place: {
            'nan-nhan': { x: 40, y: 56, w: 520, rotate: -1.5 },
            'vat-chung': { x: 150, y: 480, w: 420, rotate: 2 },
            // Kính lúp sang phải, ra ngoài ảnh để dây đỏ đi từ trên xuống không cắt qua người phụ nữ
            'gg-maps': { x: 80, y: 920, w: 300, rotate: -1.5, marks: { 'day-chuyen-le-tan': { lensAngle: 0, handleAngle: 30 } } },
          },
        },
      },
    },
    // Tờ ghi chú ghim trên bảng: kết luận điều tra
    note: {
      label: 'Kết luận điều tra',
      text: 'Qua đối chiếu vật chứng, cơ quan điều tra xác định sợi dây chuyền Phạm Thùy Chi nắm trong tay thuộc sở hữu của Trần Chi Linh, cho thấy Linh là người cuối cùng tiếp xúc với nạn nhân. Từ đó, cơ quan điều tra tiến hành bắt giữ và lấy lời khai để làm rõ vai trò của Linh trong vụ việc.',
    },
    // Trang cuối của vụ án: nút về Trang chủ
    backTo: '/',
    backLabel: 'Về trang chủ',
    next: {
      text: 'Hãy mở phong bì Giai đoạn 3 để hoàn tất vụ án.',
    },
  },
}

export function getExplanation(productId, objectiveId) {
  return explanations[`${productId}/${objectiveId}`] ?? null
}

export function getQuestion(productId, objectiveId, questionId) {
  return questions[`${productId}/${objectiveId}/${questionId}`] ?? null
}

export function getFalseAnswer(productId, objectiveId, questionId) {
  const key = `${productId}/${objectiveId}/${questionId}`
  const page = falseAnswers[key]
  const question = questions[key]
  if (!page || !question) return null
  return { ...page, question, backTo: `/${key}` }
}
