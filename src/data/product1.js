import bangTinImage from '../assets/evidence/bao-buon-lau.webp'
import bienBan1Image from '../assets/evidence/bien-ban-kham-nghiem-1.webp'
import bienBan2Image from '../assets/evidence/bien-ban-kham-nghiem-2.webp'
import cctvImage from '../assets/evidence/cctv-21g00.webp'
import ggMapsImage from '../assets/evidence/gg-maps.webp'

// Product 1 — Vụ án Phạm Thùy Chi.
// Mỗi câu hỏi có key "<product>/<objective>/<question>" khớp với URL.
// pick: số lựa chọn người chơi phải đánh dấu (mặc định 1).
// answerHash = SHA-256 của "<id>:<các optionId đúng, sắp xếp, nối bằng dấu phẩy>", tạo bằng:
//   printf '%s' 'p1-o1-q2:tl-03,tl-05,tl-23' | shasum -a 256
//   printf '%s' 'p1-o2-q2:tl-05,tl-27' | shasum -a 256

// "Danh mục tài liệu" (Drive › Web) — STT = vị trí trong danh sách
const caseDocuments = [
  'Danh mục hồ sơ và vật chứng vụ án',
  'Chân dung nạn nhân Phạm Thùy Chi',
  'Bản tin ngày 10/10/2026',
  'Kết luận Giám định Tử thi',
  'Biên bản Khám nghiệm Hiện trường',
  'Bản vẽ Mặt bằng Khách sạn Mai Hoa',
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
  'Ảnh vật chứng phụ - Bài thơ Trần Trung Đức viết cho Phạm Thùy Chi',
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
    // Câu tự điền: các ô hiện lần lượt, ô sau chỉ hiện khi ô trước đã đúng; sai thì báo ngay dưới ô, không chuyển trang
    type: 'text',
    fields: [
      {
        id: 'muc-dich',
        label: 'Mục đích là gì?',
        // Đúng khi câu trả lời có chứa một cụm từ được chấp nhận (bỏ dấu, không phân biệt hoa thường),
        // vd. buôn lậu, hàng lậu, hàng cấm, buôn bán trái phép, smuggling. Xem textAnswer.js để tạo thêm hash.
        phraseHashes: [
          'd9f008d532e55c56dd49b3344ab71fa6fe6f0365e80d76c247937a6a03d8cf11',
          'd43d303cdaee02df3e87c0f3536742744dfa5d1812b607d21b2da1283d16bca6',
          '267ae850d86481ee671db0fbcec4c1d2f5a50b223e3d95a8af64f37999556cc4',
          '1cf21bc1d9e3d3e81aec4f486b0ebd69b42ad593e903b19804796ce170ff6ec7',
          '1b9ce3a49a211517f00c40bddbecc6af0f0b4b9b63165c60c2e734de5cb5c323',
          'fcb9dc9cb173dffc8859f65f95fea0baee1d8f1e03517b5c6823e2b1b6b7734e',
          '8316dc1b127278ad044e9f0a237b95200c1c7874e51e49535a3859e8116bd5e4',
          '4efe053d5394052c3d690db75c7604777e4143dcfc6a2b185c4cf0bf31d2b47c',
          '679a06b5568bc681053fe0af10a1acd0cdb4784d0a78c54a4b06997cde555b47',
          'fe8ae1ef604278868b750278aba3d2713dfbdf600df63098d731d8f867ba5489',
          'f8d1ae6637f794f2994676f513f035a0f92c5ef4000d0eef2becd06f81f6947f',
          '2a244e48f320251e0129c4658a8faf47f7f2db2c38b91e1df41cd8426c5904f5',
          '0a8fe92e41655edd5a9cd916c644390ac6365ac928552c8745eac6193a0e8cad',
          '50a880f6a6fc12911b69046e150fe399879ce7040e0f995dec1cb8ee95f3c600',
          '3d6e7f5f63234ae0cb2945da4923e7d461b06da8f873cea785f501b7c2d19747',
        ],
        wrong: 'Phạm Thùy Chi không đến Khách sạn Mai Hoa với mục đích này. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      },
      {
        id: 'mat-hang',
        label: 'Mặt hàng nào?',
        // vd. thuốc lá điện tử, thuốc điện tử, vape, pod, e-cigarette
        phraseHashes: [
          'c573a71aafe4cb0215f80fd04887d49c4cbb6cb60f9de40733b98197eb7ade3e',
          '4a935fd078140144ab158f7fa526066ea39ba758a76ca052fdd233b7528be757',
          '4c07e0ef0cfead80be9686a8586d3f8cb6da2143afb26454bdbe2a76eeee1bbc',
          '7ff7aa94c3823a4ed2960b8e636041fbc16e239c4dfc8a1f0731ea47ad29f7fe',
          '6db57a7694b7b3cdd3e8833c46eefff35b3380833f3eca7594d8e828c3e8231a',
          '26f20c4a76a48297e88604ef0a8a8da061d4e14bc639c260906329059205c049',
          'e4f742ba331b9120f67ea6396e72c77f76eaf4b03c697068c3d79e764e8eca95',
          'e0bcef7f33ae27d766d79dbbc34d67596f85ec99e0ad3b78d534e318c07b8d63',
          'd36baf1f23efc08d9fb2d1b920ab48dce2ab3c23ba9da0facbf73d871a9360d7',
          '4ab5da634632749e4903c2fe12656e78b78e1c49512aca1cf7dc9e28ea18a7e1',
          '71c896da85f3b156c6a2cc563edfbb8e87d27583c31f41294905bf8af845dced',
          'be0dbd2311f6fe02b766786a51d5fa038ca4addb7f0c1721bccb624fb085a231',
        ],
        wrong: 'Phạm Thùy Chi không buôn lậu mặt hàng này. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
      },
    ],
    backTo: '/p1/truy-cap',
    next: {
      correct: '/p1/o1/q2',
    },
  },
  'p1/o1/q2': {
    id: 'p1-o1-q2',
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    backTo: '/p1/o1/q1',
    prompt: 'Phạm Thùy Chi đến Khách sạn Mai Hoa để buôn lậu. Ba bằng chứng nào có thể chứng minh được việc đó?',
    pick: 3,
    options: documentOptions(24),
    // Đúng: tl-03 (Bản tin) + tl-05 (Biên bản Khám nghiệm Hiện trường) + tl-23 (camera 21g00)
    answerHash: '141809bbc25f5b68fdb3c9864fec622db83ed8229f615f2706cd25e0d488df2b',
    // Hash từng đáp án đúng ("<id>:<optionId>") để đếm số bằng chứng người chơi chọn đúng
    correctOptionHashes: [
      '1c133ea9dd4a3b7deb2054cfd8be9a2ba3e6b0f49a4727e75ccd9aeba3e82154',
      '540ebaa1d758c6edf9ff70a9b5b993ee0e849df65fa4383e94add3446f42ee15',
      'fa11ec72094bc0fec4a7eb1e79d003d429a4b1e2400e905599b37ee560d394fd',
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
    options: documentOptions(27),
    // Đúng: tl-05 (Biên bản Khám nghiệm Hiện trường) + tl-27 (Ảnh chụp màn hình điện thoại)
    answerHashes: ['a0f715b420e2fbafbc564ee5fdfb28d318574cb4d7688ac6394c2821e4cca96a'],
    correctOptionHashes: [
      'c9195088c3fd8be7349658f6646e4287dfe9f6fd32f947431a631aa1f93fca6c',
      '116e272fac6688aea7fedd4f6ad26585bbf494e0b16cb479998118c66ff63e7e',
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
// wall.items[].marks: chi tiết khoanh đỏ, u/v = vị trí theo tỉ lệ ảnh, r = bán kính theo bề rộng ảnh, aspect = kéo dọc vòng khoanh (mặc định 1).
// wall.strings: cặp chi tiết được nối dây đỏ. layouts: wide (≥768px) và tall (điện thoại), đơn vị theo viewBox.
const explanations = {
  'p1/o1': {
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    conclusion: 'Ba bằng chứng trên đã chứng minh trực tiếp Phạm Thùy Chi đến Khách sạn Mai Hoa để buôn lậu',
    wall: {
      description:
        'Bức tường bằng chứng: mẩu Bản tin ngày 10/10/2026 xé từ trang báo, hai trang Biên bản Khám nghiệm Hiện trường (trang 2 ghim đè lên trang 1, chừa tiêu đề) và Ảnh trích xuất camera lúc 21g00 ghim trên bảng. Chiếc nhẫn đỏ trên tay hai người đàn ông trong bản tin được khoanh đỏ, phóng to bằng kính lúp và nối với nhau bằng dây đỏ; từ giữa sợi dây này rẽ hai nhánh tới chiếc nhẫn đỏ số 2 trong ảnh vật chứng thu giữ ở trang 2 biên bản và chiếc nhẫn đỏ trên ngón tay người trong camera, cả hai cũng được khoanh, phóng to và nối thẳng với nhau.',
      items: [
        {
          id: 'bang-tin',
          src: bangTinImage,
          ratio: 1600 / 629,
          frame: 'torn',
          caption: 'Bản tin ngày 10/10/2026',
          marks: [
            // Hai kính lúp toả sang hai bên để dây nối giữa chúng đủ dài cho hai nhánh rẽ
            { id: 'nhan-bao-1', u: 0.724, v: 0.765, r: 0.028, ring: 0.011, lensAngle: 130, handleAngle: 115 },
            { id: 'nhan-bao-2', u: 0.829, v: 0.774, r: 0.028, ring: 0.011, lensAngle: 50 },
          ],
        },
        // Biên bản Khám nghiệm Hiện trường (Drive "Tài liệu chung/Hiện trường edited.pdf"): trang 1 nằm dưới, trang 2 ghim đè lên
        { id: 'bien-ban-1', src: bienBan1Image, ratio: 1600 / 2263, frame: 'paper', marks: [] },
        {
          id: 'bien-ban-2',
          src: bienBan2Image,
          ratio: 1600 / 2263,
          frame: 'paper',
          // Chiếc nhẫn số 2 trong "Ảnh vật chứng thu giữ tại hiện trường 1" (ảnh chiếm u .50–.92, v .092–.273 của trang)
          marks: [{ id: 'nhan-vat-chung', u: 0.5464, v: 0.2006, r: 0.03, ring: 0.017, lensAngle: 180 }],
        },
        {
          id: 'cctv',
          src: cctvImage,
          ratio: 1240 / 827,
          frame: 'photo',
          caption: 'Ảnh trích xuất camera lúc 21g00',
          marks: [{ id: 'nhan-cctv', u: 0.5313, v: 0.423, r: 0.03, ring: 0.008, lensAngle: 15 }],
        },
      ],
      // Hai nhẫn trong bản tin nối với nhau; dây tới biên bản và camera rẽ ra từ giữa sợi dây đó
      strings: [
        ['nhan-bao-1', 'nhan-bao-2'],
        [{ mid: ['nhan-bao-1', 'nhan-bao-2'] }, 'nhan-vat-chung'],
        [{ mid: ['nhan-bao-1', 'nhan-bao-2'] }, 'nhan-cctv'],
        ['nhan-vat-chung', 'nhan-cctv'],
      ],
      layouts: {
        wide: {
          width: 1000,
          height: 830,
          captionSize: 14,
          strokeWidth: 2.4,
          minMarkRadius: 14,
          lensRadius: 46,
          lensGap: 30,
          place: {
            'bang-tin': { x: 110, y: 50, w: 520, rotate: -1.5 },
            'bien-ban-1': { x: 650, y: 270, w: 290, rotate: 1.5 },
            'bien-ban-2': { x: 675, y: 390, w: 290, rotate: -1 },
            cctv: { x: 90, y: 470, w: 380, rotate: 2.5 },
          },
        },
        tall: {
          width: 600,
          height: 1420,
          captionSize: 17,
          strokeWidth: 3,
          minMarkRadius: 16,
          lensRadius: 56,
          lensGap: 34,
          place: {
            // Điện thoại: hai kính lúp chụm hơn để không tràn mép bảng
            'bang-tin': {
              x: 24,
              y: 56,
              w: 540,
              rotate: -1.5,
              marks: { 'nhan-bao-1': { lensAngle: 120, handleAngle: 110 }, 'nhan-bao-2': { lensAngle: 50, handleAngle: 80 } },
            },
            'bien-ban-1': { x: 50, y: 400, w: 330, rotate: -1.5 },
            'bien-ban-2': { x: 150, y: 530, w: 330, rotate: 1.5 },
            cctv: { x: 110, y: 1060, w: 420, rotate: 2.5 },
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
        'Bức tường bằng chứng: hai trang Biên bản Khám nghiệm Hiện trường (trang 2 ghim đè lên nửa dưới trang 1) và Ảnh chụp màn hình điện thoại ghim trên bảng. Sợi dây chuyền trong tay nạn nhân ở Ảnh hiện trường 1 (trang 1), toàn bộ sợi dây chuyền số 3 trong ảnh vật chứng thu giữ (trang 2) và toàn bộ sợi dây chuyền người phụ nữ đeo trên cổ trong ảnh chụp màn hình được khoanh đỏ, phóng to bằng kính lúp và nối với nhau bằng dây đỏ.',
      items: [
        // Biên bản Khám nghiệm Hiện trường (Drive "Tài liệu chung/Hiện trường edited.pdf"): trang 2 đè lên trang 1 nhưng chừa Ảnh hiện trường 1
        {
          id: 'bien-ban-1',
          src: bienBan1Image,
          ratio: 1600 / 2263,
          frame: 'paper',
          // Sợi dây chuyền trong bàn tay phải nạn nhân, "Ảnh hiện trường 1" (ảnh chiếm u .417–.955, v .299–.512 của trang)
          marks: [{ id: 'day-chuyen-nan-nhan', u: 0.598, v: 0.4704, r: 0.028, ring: 0.016, lensAngle: 0 }],
        },
        {
          id: 'bien-ban-2',
          src: bienBan2Image,
          ratio: 1600 / 2263,
          frame: 'paper',
          // Toàn bộ sợi dây chuyền số 3 (dây + mặt) trong "Ảnh vật chứng thu giữ tại hiện trường 1": vòng khoanh dọc theo dáng dây
          marks: [{ id: 'day-chuyen-vat-chung', u: 0.6215, v: 0.2196, r: 0.04, aspect: 1.8, ring: 0.034, lensAngle: 0 }],
        },
        {
          id: 'gg-maps',
          src: ggMapsImage,
          ratio: 1080 / 1920,
          frame: 'photo',
          caption: 'Ảnh chụp màn hình điện thoại',
          // Khoanh toàn bộ dây chuyền trên cổ người phụ nữ (từ gáy cổ áo tới mặt dây); kính lúp ra ngoài ảnh để không che dây chuyền
          marks: [{ id: 'day-chuyen-le-tan', u: 0.773, v: 0.462, r: 0.045, ring: 0.026, lensAngle: 60, handleAngle: 50 }],
        },
      ],
      strings: [
        ['day-chuyen-nan-nhan', 'day-chuyen-le-tan'],
        ['day-chuyen-nan-nhan', 'day-chuyen-vat-chung'],
        ['day-chuyen-vat-chung', 'day-chuyen-le-tan'],
      ],
      layouts: {
        wide: {
          width: 1000,
          height: 760,
          captionSize: 14,
          strokeWidth: 2.4,
          minMarkRadius: 14,
          lensRadius: 46,
          lensGap: 30,
          place: {
            'bien-ban-1': { x: 80, y: 40, w: 300, rotate: -1.5 },
            'bien-ban-2': { x: 110, y: 280, w: 300, rotate: 1.5 },
            'gg-maps': { x: 640, y: 60, w: 300, rotate: 2 },
          },
        },
        tall: {
          width: 600,
          height: 1520,
          captionSize: 19,
          strokeWidth: 3,
          minMarkRadius: 16,
          lensRadius: 56,
          lensGap: 34,
          place: {
            'bien-ban-1': { x: 40, y: 56, w: 340, rotate: -1.5 },
            'bien-ban-2': { x: 130, y: 330, w: 340, rotate: 1.5 },
            'gg-maps': { x: 150, y: 880, w: 300, rotate: -1.5, marks: { 'day-chuyen-le-tan': { lensAngle: 0, handleAngle: 30 } } },
          },
        },
      },
    },
    // Tờ ghi chú ghim trên bảng: kết luận điều tra
    note: {
      label: 'Kết luận điều tra',
      text: 'Qua đối chiếu vật chứng, cơ quan điều tra xác định sợi dây chuyền Phạm Thùy Chi nắm trong tay thuộc sở hữu của Trần Chi Linh, cho thấy Linh là người cuối cùng tiếp xúc với nạn nhân. Từ đó, cơ quan điều tra tiến hành bắt giữ và lấy lời khai để làm rõ vai trò của Linh trong vụ việc.',
    },
    // Trang cuối của vụ án: nút về Trang chủ và nút sang trang Tóm tắt
    backTo: '/',
    backLabel: 'Về trang chủ',
    next: {
      text: 'Hãy mở phong bì Giai đoạn 3 để hoàn tất vụ án.',
      to: '/p1/tom-tat',
      label: 'Xem tóm tắt',
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
