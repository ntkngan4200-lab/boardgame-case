import cauThangImage from '../assets/evidence/cau-thang-dang-sua.webp'
import cctvSanhImage from '../assets/evidence/cctv-sanh-21g00.webp'
import cctvThangMayImage from '../assets/evidence/cctv-thang-may-22g00.jpg'
import loiKhaiUtImage from '../assets/evidence/loi-khai-le-van-ut.jpg'
import vatChungImage from '../assets/evidence/vat-chung.webp'

// Product 1 — Vụ án Phạm Thùy Chi.
// Mỗi câu hỏi có key "<product>/<objective>/<question>" khớp với URL.
// pick: số lựa chọn người chơi phải đánh dấu (mặc định 1).
// answerHash = SHA-256 của "<id>:<các optionId đúng, sắp xếp, nối bằng dấu phẩy>", tạo bằng:
//   printf '%s' 'p1-o1-q2:tl-03,tl-26' | shasum -a 256
//   printf '%s' 'p1-o2-q2:tl-18,tl-25,tl-34' | shasum -a 256

// Google Sheet "Danh mục tài liệu" (Drive › Tài liệu vụ án Phạm Thùy Chi › Web), tab "Hồ sơ": STT = vị trí trong danh sách (bắt đầu từ 0).
// STT 37–41 thuộc phong bì "Sự thật" nên không đưa lên web.
const caseDocuments = [
  'Danh mục hồ sơ và vật chứng vụ án',
  'Chân dung nạn nhân Phạm Thùy Chi',
  'Kết luận Giám định Tử thi',
  'Biên bản Khám nghiệm Hiện trường',
  'Bản vẽ Mặt bằng Khách sạn Mai Hoa',
  'Bài báo ngày 03/10/2026',
  'Bài báo ngày 04/10/2026',
  'Bài báo ngày 06/10/2026',
  'Bài báo ngày 10/10/2026',
  'Ảnh nhận dạng nghi phạm - Lê Văn Út',
  'Ảnh nhận dạng nghi phạm - Vũ Văn Dũng',
  'Ảnh nhận dạng nghi phạm - Trần Chi Linh',
  'Ảnh nhận dạng nghi phạm - Bành Thu Cúc',
  'Lý lịch cá nhân - Lê Văn Út',
  'Lý lịch cá nhân - Vũ Văn Dũng',
  'Lý lịch cá nhân - Trần Trung Đức',
  'Lý lịch cá nhân - Trần Chi Linh',
  'Lý lịch cá nhân - Bành Thu Cúc',
  'Biên bản Lời khai - Lê Văn Út',
  'Biên bản Lời khai - Vũ Văn Dũng',
  'Biên bản Lời khai - Trần Trung Đức',
  'Biên bản Lời khai - Trần Chi Linh',
  'Biên bản Lời khai - Bành Thu Cúc',
  'Ảnh vật chứng - Bài thơ Trần Trung Đức viết cho Phạm Thùy Chi',
  'Ảnh hiện trường phụ 1 - Phòng 405 với nhiều hình ảnh của Phạm Thùy Chi',
  'Ảnh hiện trường phụ 2 - Cầu thang đang sửa chữa',
  'Ảnh trích xuất camera - Sảnh 21g00 09/10/2026',
  'Ảnh trích xuất camera - Sảnh 21g30 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 21g35 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 21g38 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 21g40 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 21g45 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 21g50 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 21g55 09/10/2026',
  'Ảnh trích xuất camera - Thang máy 22g00 09/10/2026',
  'Nhật ký ghi nhận cuộc gọi',
  'Nhật ký truy cập thẻ từ',
]

// id "tl-<STT 2 chữ số>", number = STT trong tab Hồ sơ. Hai giai đoạn dùng chung danh sách.
export const caseDocumentOptions = caseDocuments.map((label, index) => ({
  id: `tl-${String(index).padStart(2, '0')}`,
  number: index,
  label,
}))

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
    // Ô "Gợi ý (1)" luôn hiện dưới câu hỏi. Bấm vào phải trả lời đúng câu hỏi phụ mới mở được gợi ý.
    // Đáp án câu hỏi phụ: dãy 12102006, 12 10 2006 (ký tự ngăn cách bất kỳ) hoặc KQ12102006, hash như phraseHashes với fieldId 'goi-y-1'.
    hint: {
      id: 'goi-y-1',
      label: 'Dãy số nào trông giống ngày sinh nhưng không nằm trong các mục liên quan đến ngày sinh?',
      phraseHashes: [
        '4c93698da44dcd91495a4167a1e73dd6b98f5db60e802c5bba8cde27e9238ad7',
        '0f64c64ced60573d8814d846532d8f736c5db9b2429d56770ca49daec931c04d',
        // nguyên số seri trên tờ tiền: KQ12102006
        'fd22e641b2652cf13ae1d26243d0f9d79617fec7493a665c2af937f2be545f68',
      ],
      wrong: 'Chưa chính xác. Hãy quan sát kỹ các dãy số trong vật chứng.',
      text: 'Mục đích của các bài báo được cung cấp "ngẫu nhiên" trong bộ hồ sơ là gì? Hãy để ý đến ngày phát hành của các số báo đó.',
    },
    backTo: '/p1/huong-dan',
    next: {
      correct: '/p1/o1/q2',
    },
  },
  'p1/o1/q2': {
    id: 'p1-o1-q2',
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    backTo: '/p1/o1/q1',
    prompt: 'Phạm Thùy Chi đến Khách sạn Mai Hoa để buôn lậu. Hai bằng chứng nào có thể chứng minh được việc đó?',
    pick: 2,
    options: caseDocumentOptions,
    // Đúng: tl-03 (Biên bản Khám nghiệm Hiện trường) + tl-26 (camera Sảnh 21g00)
    answerHash: '2c58ca75c196f65f7594325bc6cf6b24d01d770ec34d7e8cb45e8c7c3aea8c98',
    // Hash từng đáp án đúng ("<id>:<optionId>") để đếm số bằng chứng người chơi chọn đúng
    correctOptionHashes: [
      '1c133ea9dd4a3b7deb2054cfd8be9a2ba3e6b0f49a4727e75ccd9aeba3e82154',
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
    prompt: 'Ba bằng chứng nào có thể chứng minh Trần Chi Linh là hung thủ sát hại Phạm Thùy Chi?',
    pick: 3,
    options: caseDocumentOptions,
    // Đúng: tl-18 (Lời khai Lê Văn Út) + tl-25 (Cầu thang đang sửa chữa) + tl-34 (camera Thang máy 22g00)
    answerHash: '3ac0450a1194e51cada364e17aaad36414abf9232e480992700e7601dea0a9ea',
    correctOptionHashes: [
      '74fdd2142a89721eac40917cb4f2fd5edbd5e76681c5cc08114e5747b5869541',
      '2e1eb3e78eff9f5959aa5d2a47b45ae6e8eb568549d3a1151fa74c91a15c8529',
      '04225c538c06b685bae6aabd5f0432fdb0eedc111debdf288b2a9dca718895da',
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
    claim: 'Tổ hợp bằng chứng chưa chứng minh trực tiếp mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    hints: [],
  },
  'p1/o2/q1': {
    claim: 'Người này không phải là hung thủ đã sát hại Phạm Thùy Chi. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    hints: [],
  },
  'p1/o2/q2': {
    claim: 'Tổ hợp bằng chứng chưa chứng minh trực tiếp Trần Chi Linh là hung thủ đã sát hại Phạm Thùy Chi. Hãy chú ý kỹ hơn đến các chi tiết được cung cấp.',
    hints: [
      // Gợi ý 1 khoá bằng câu hỏi phụ. Đáp án: Dũng, Dũng Ngã Sáu, Vũ Văn Dũng, Văn Dũng
      // (hash "p1-o2-q2:goi-y-1:<cụm từ>", câu trả lời chứa cụm "dung" là đúng).
      {
        text: 'Hãy dùng phương pháp loại trừ, ai là người có nhiều khả năng gặp nạn nhân cuối cùng nhất?',
        gate: {
          id: 'goi-y-1',
          label: 'Nhật ký thẻ từ ghi nhận Trần Chi Linh đã lên tầng 4 lúc 16g00 ngày 09/10. Vậy Linh đã gặp ai vào thời điểm đó?',
          phraseHashes: [
            '0314112f21c54a2930f6ccbb7f8096b733c9686f8524e4473868e2a3574f17a6',
            'f679c6da319a5bcb8547557f91ed61b3ba3e96eb4e544c596caed87603a0d7e6',
            '35c04fd7341e9e78ac0f60a1f056010d2afd5b7957dad4f95afe477ceea34196',
            '865d7aa2ef87130f39f7010ffc7642a816abf999e65822edb606df3745cbe722',
          ],
          wrong: 'Chưa chính xác. Hãy đối chiếu kỹ nhật ký thẻ từ với lời khai.',
        },
      },
      'Ai là người có sự thay đổi, có thể nhận thấy được, sau thời điểm nạn nhân tử vong?',
    ],
  },
}

// Explanation Page sau khi trả lời đúng câu cuối của mỗi giai đoạn (key "<product>/<objective>").
// wall.items[].marks: chi tiết khoanh đỏ, u/v = vị trí theo tỉ lệ ảnh, r = bán kính theo bề rộng ảnh, aspect = kéo dọc vòng khoanh (mặc định 1).
// wall.strings: cặp chi tiết được nối dây đỏ. layouts: wide (≥768px) và tall (điện thoại), đơn vị theo viewBox; layout.strings thay cho wall.strings nếu có.
// Thẻ ghi chú (frame 'card'): lines[].anchors = điểm nối dây ở mép trái/phải từng dòng; cardFont = cỡ chữ của bố cục.
const explanations = {
  'p1/o1': {
    stage: 'Giai đoạn 1',
    heading: 'Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
    conclusion: 'Hai bằng chứng trên đã chứng minh trực tiếp Phạm Thùy Chi đến Khách sạn Mai Hoa để buôn lậu',
    // Theo Canva "Web" trang 24: ảnh vật chứng (Biên bản Khám nghiệm Hiện trường) + camera Sảnh 21g00,
    // nội dung giải mã từ giấy ghi chú gom vào một tờ giải thích, dây đỏ nối chi tiết với dòng tương ứng
    wall: {
      description:
        'Bức tường bằng chứng: Ảnh vật chứng tại hiện trường 1 trong Biên bản Khám nghiệm Hiện trường và Ảnh trích xuất camera Sảnh lúc 21g00 ghim trên bảng. Nội dung giải mã giấy ghi chú số 3 được chép trên một tờ giải thích. Giấy ghi chú được khoanh đỏ và nối tới dòng "4 0 4 Mai Hoa, 21 giờ ngày 9 tháng 10"; chiếc nhẫn đỏ số 2 nối tới dòng "nhẫn đỏ"; bàn tay có hình xăm của người đàn ông trong camera nối tới dòng "từ hình xăm trên tay". Dòng "thuốc lá điện tử" nối với dòng "nhận 1 kiện hàng", và từ giữa sợi dây đó một nhánh nối xuống chiếc túi người đàn ông xách trong camera.',
      items: [
        {
          id: 'vat-chung',
          src: vatChungImage,
          ratio: 1600 / 982,
          frame: 'photo',
          caption: 'Ảnh vật chứng tại hiện trường 1',
          marks: [
            // Giấy ghi chú số 3: khoanh cả tờ (bầu dục ngang)
            { id: 'giay-ghi-chu', u: 0.349, v: 0.717, r: 0.2, aspect: 0.8 },
            { id: 'nhan-do', u: 0.093, v: 0.62, r: 0.045, ring: 0.035, lensAngle: 120 },
          ],
        },
        {
          // Một tờ giải thích gom toàn bộ nội dung giải mã từ giấy ghi chú
          id: 'giai-ma',
          frame: 'card',
          lines: [
            { text: '4 0 4 Mai Hoa', anchors: [{ id: 'dong-mai-hoa', side: 'left', span: 2 }] },
            { text: '21 giờ ngày 9 tháng 10' },
            { text: 'nhẫn đỏ', gap: true, anchors: [{ id: 'dong-nhan', side: 'left' }] },
            { text: 'nhận 1 kiện hàng', anchors: [{ id: 'dong-kien-hang', side: 'right' }] },
            {
              text: 'từ hình xăm trên tay',
              anchors: [
                { id: 'dong-hinh-xam', side: 'left' },
                { id: 'dong-hinh-xam-phai', side: 'right' },
              ],
            },
            { text: 'thuốc lá điện tử', gap: true, anchors: [{ id: 'dong-thuoc-la', side: 'right' }] },
          ],
        },
        {
          id: 'cctv-sanh',
          src: cctvSanhImage,
          ratio: 1240 / 827,
          frame: 'photo',
          caption: 'Ảnh trích xuất camera - Sảnh 21g00',
          marks: [
            { id: 'hinh-xam', u: 0.537, v: 0.453, r: 0.04, ring: 0.03, lensAngle: -135 },
            { id: 'tui-hang', u: 0.42, v: 0.733, r: 0.07 },
          ],
        },
      ],
      // Dòng "thuốc lá điện tử" nối với dòng "nhận 1 kiện hàng"; từ giữa sợi dây đó rẽ nhánh xuống kiện hàng trong camera
      strings: [
        ['giay-ghi-chu', 'dong-mai-hoa'],
        ['nhan-do', 'dong-nhan'],
        ['hinh-xam', 'dong-hinh-xam'],
        ['dong-kien-hang', 'dong-thuoc-la', { bend: [90, 0] }],
        [{ mid: ['dong-kien-hang', 'dong-thuoc-la'] }, 'tui-hang', { bend: [170, -40] }],
      ],
      layouts: {
        wide: {
          width: 1000,
          height: 840,
          captionSize: 14,
          cardFont: 21,
          strokeWidth: 2.4,
          minMarkRadius: 14,
          lensRadius: 46,
          lensGap: 30,
          place: {
            'vat-chung': { x: 50, y: 50, w: 480, rotate: -1.5 },
            'giai-ma': { x: 610, y: 70, w: 320, rotate: 1 },
            'cctv-sanh': { x: 380, y: 450, w: 480, rotate: 1.5 },
          },
        },
        tall: {
          width: 600,
          height: 1390,
          captionSize: 17,
          cardFont: 27,
          strokeWidth: 3,
          minMarkRadius: 16,
          lensRadius: 56,
          lensGap: 34,
          place: {
            'vat-chung': { x: 30, y: 50, w: 540, rotate: -1.5, marks: { 'nhan-do': { lensAngle: 90 } } },
            'giai-ma': { x: 100, y: 470, w: 400, rotate: 1 },
            'cctv-sanh': { x: 30, y: 980, w: 540, rotate: 1.5 },
          },
          // Điện thoại: camera nằm dưới tờ giải thích nên dây hình xăm vòng qua mép trái thẻ, nhánh kiện hàng vòng qua mép phải
          strings: [
            ['giay-ghi-chu', 'dong-mai-hoa'],
            ['nhan-do', 'dong-nhan'],
            ['hinh-xam', 'dong-hinh-xam', { bend: [-190, 0] }],
            ['dong-kien-hang', 'dong-thuoc-la', { bend: [60, 0] }],
            [{ mid: ['dong-kien-hang', 'dong-thuoc-la'] }, 'tui-hang', { bend: [90, 0] }],
          ],
        },
      },
    },
    // Tờ ghi chú ghim trên bảng: cách giải mã giấy ghi chú và ý nghĩa của nó (**…** = chữ đậm)
    note: {
      label: 'Ghi chú điều tra',
      lines: [
        'Giải mã theo quy tắc **[Ngày báo . Số dòng . Vị trí từ . Vị trí chữ cái]**, đối chiếu với các bài báo ngày **03/10, 04/10 và 06/10**.',
        'Kết quả cho thấy tờ giấy thực chất là một thông báo hẹn giao hàng:',
        '- Thời gian, địa điểm: **21g00 ngày 09/10, phòng 404 Khách sạn Mai Hoa**',
        '- Người nhận: "Nhẫn đỏ", tức **Phạm Thùy Chi**',
        '- Người gửi: "Hình xăm trên tay", tức **người đàn ông lạ mặt**',
        '- Hàng hóa: **1 kiện hàng có thuốc lá điện tử lậu**',
        '→ Kết luận bước đầu: **Phạm Thùy Chi thuộc đường dây buôn lậu thuốc lá điện tử.**',
      ],
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
    conclusion: 'Ba bằng chứng trên đã chứng minh Trần Chi Linh là hung thủ đã sát hại Phạm Thùy Chi',
    // Theo Canva "Web" trang 25 (ảnh thang máy: Drive › Ảnh › "CCTV22g"): lời khai Lê Văn Út → cầu thang đang sửa (thùng sơn) → vết sơn trên giày trong camera thang máy 22g00
    wall: {
      description:
        'Bức tường bằng chứng: trích đoạn Biên bản Lời khai Lê Văn Út, Ảnh hiện trường phụ 2 - Cầu thang đang sửa chữa và Ảnh trích xuất camera Thang máy lúc 22g00 ghim trên bảng. Đoạn khai "chỉ còn khoảng cầu thang giữa tầng 4 và 5 đang được sửa và sơn" được gạch dưới màu đỏ và nối tới thùng sơn trên cầu thang; thùng sơn nối tới vết sơn trên giày người phụ nữ trong thang máy, được phóng to bằng kính lúp.',
      items: [
        {
          id: 'loi-khai-ut',
          src: loiKhaiUtImage,
          ratio: 1334 / 226,
          frame: 'photo',
          caption: 'Lời khai - Lê Văn Út',
          captionAlign: 'start',
          // Đoạn gạch chân "chỉ còn khoảng cầu thang giữa tầng 4 và 5 đang được sửa và sơn": tô lại bằng gạch dưới đỏ
          marks: [{ id: 'cau-thang-dang-sua', u: 0.377, v: 0.695, r: 0.32, underline: true, anchorV: 0.765 }],
        },
        {
          id: 'cau-thang',
          src: cauThangImage,
          ratio: 600 / 800,
          frame: 'photo',
          caption: 'Cầu thang đang sửa chữa',
          marks: [{ id: 'thung-son', u: 0.49, v: 0.47, r: 0.17 }],
        },
        {
          id: 'thang-may',
          src: cctvThangMayImage,
          ratio: 2370 / 1666,
          frame: 'photo',
          caption: 'Thang máy 22g00',
          captionAlign: 'end',
          marks: [{ id: 'vet-son', u: 0.316, v: 0.946, r: 0.05, ring: 0.025, lensV: 0.925, lensAngle: 0 }],
        },
      ],
      strings: [
        ['cau-thang-dang-sua', 'thung-son'],
        ['thung-son', 'vet-son'],
      ],
      layouts: {
        wide: {
          width: 1000,
          height: 730,
          captionSize: 14,
          strokeWidth: 2.4,
          minMarkRadius: 14,
          lensRadius: 46,
          lensGap: 30,
          place: {
            'loi-khai-ut': { x: 50, y: 50, w: 600, rotate: -1 },
            'cau-thang': { x: 680, y: 170, w: 270, rotate: 2 },
            'thang-may': { x: 80, y: 290, w: 480, rotate: -1.5, marks: { 'vet-son': { lensAngle: 0, handleAngle: -45 } } },
          },
        },
        tall: {
          width: 600,
          height: 1300,
          captionSize: 17,
          strokeWidth: 3,
          minMarkRadius: 16,
          lensRadius: 56,
          lensGap: 34,
          place: {
            'loi-khai-ut': { x: 20, y: 50, w: 560, rotate: -1 },
            'cau-thang': { x: 250, y: 250, w: 320, rotate: 2 },
            'thang-may': { x: 30, y: 790, w: 540, rotate: -1.5, marks: { 'vet-son': { lensAngle: 0, handleAngle: -45 } } },
          },
        },
      },
    },
    // Tờ ghi chú ghim trên bảng: kết luận điều tra (**…** = chữ đậm)
    note: {
      label: 'Kết luận điều tra',
      lines: [
        'Sau khi đối chiếu lời khai và vật chứng:',
        '- Lê Văn Út khai **chỉ có đoạn thang bộ giữa tầng 4 và 5 còn đang sửa chữa**. Vậy đoạn thang sơn dở trong ảnh chính là **khoảng giữa tầng 4 và 5**.',
        '- Sau khi vào thang máy xuống tầng G, có thể thấy ống quần gần bắp chân của Trần Chi Linh dính sơn, cùng màu với sơn đang dùng ở đoạn thang này.',
        '→ Kết luận: Sau khi lên tầng 5 lúc **21 giờ 55, Trần Chi Linh đã dùng chìa khóa của mình để đi thang bộ từ tầng 5 xuống tầng 4**. Đồng thời, nhằm đánh lạc hướng điều tra, cô đã **mở phòng 404 bằng chìa khóa của chị Cúc**.',
        '**ĐỀ NGHỊ: BẮT GIỮ VÀ HỎI CUNG TRẦN CHI LINH ĐỂ LÀM RÕ VỤ VIỆC.**',
      ],
    },
    // Bằng chứng nhỏ dưới tờ kết luận, theo Canva "Web" trang 26 (__…__ = đoạn gạch chân trong biên bản)
    extra: {
      excerpt: {
        label: 'Lời khai - Bành Thu Cúc',
        question: 'Sau khi đưa bia cho phòng 404, chị đã làm gì?',
        answer:
          'Vì khách sạn cũng vắng nên tôi có ngồi nói chuyện với bác Út vài câu rồi __để thẻ của mình trong hộc bàn quầy như mọi ngày__, xong tôi về phòng nghỉ. Tôi ở trong phòng cho đến khi nghe bác Út la thì tôi chạy ra và thấy Chi nằm dưới đất.',
      },
      statement: 'Bất kỳ ai biết rõ thông tin này đều có thể dùng thẻ từ của Bành Thu Cúc',
      log: {
        label: 'Nhật ký truy cập thẻ từ',
        cells: ['048', '21:57:02', 'NV-01', 'Buồng phòng', 'Cửa phòng 404', 'Hợp lệ'],
        // Ô in đậm như bản gốc
        strong: [2, 5],
      },
    },
    // Trang cuối của vụ án: nút về Trang chủ và nút sang trang Tóm tắt
    backTo: '/',
    backLabel: 'Về trang chủ',
    next: {
      text: 'Hãy mở phong bì "Sự thật" để hoàn tất vụ án.',
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
