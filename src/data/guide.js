import danhMuc from '../assets/guide/guide-danh-muc.webp'
import giaiDoan from '../assets/guide/guide-giai-doan.webp'
import hs1 from '../assets/guide/guide-hs1.webp'
import hs2 from '../assets/guide/guide-hs2.webp'
import hs3 from '../assets/guide/guide-hs3.webp'
import hs4 from '../assets/guide/guide-hs4.webp'
import q1Mobile from '../assets/guide/guide-q1-mobile.webp'
import thu from '../assets/guide/guide-thu.webp'

// Ảnh minh hoạ trang Hướng dẫn chơi: nội dung hồ sơ đã được làm mờ sẵn trong file ảnh
export const guideImages = {
  danhMuc: {
    src: danhMuc,
    width: 794,
    height: 1124,
    alt: 'Danh mục Hồ sơ vụ án Phạm Thùy Chi, tên các hồ sơ được làm mờ',
  },
  thu: {
    src: thu,
    width: 790,
    height: 1024,
    alt: 'Thư gửi Đội điều tra, chỉ rõ câu hỏi: Ai là người đã giết Phạm Thùy Chi?',
  },
  giaiDoan: {
    src: giaiDoan,
    width: 1280,
    height: 668,
    alt: 'Tiêu đề Giai đoạn 1 trên trang điện tử: Mục đích Phạm Thùy Chi đến Khách sạn Mai Hoa',
  },
  q1Mobile: {
    src: q1Mobile,
    width: 750,
    height: 2914,
    alt: 'Trang câu hỏi trên điện thoại với các ô lựa chọn, nội dung được làm mờ',
  },
}

export const guideDocuments = [
  { id: 'hs1', src: hs1, width: 832, height: 1184, alt: 'Biên bản ghi lời khai, phần hỏi đáp được làm mờ' },
  { id: 'hs2', src: hs2, width: 714, height: 1024, alt: 'Lý lịch cá nhân, phần quan hệ được làm mờ' },
  { id: 'hs3', src: hs3, width: 786, height: 1124, alt: 'Kết luận giám định tử thi, phần nội dung được làm mờ' },
  { id: 'hs4', src: hs4, width: 810, height: 1228, alt: 'Lá thư viết tay gửi Chi, chỉ đọc được ba câu đầu' },
]
