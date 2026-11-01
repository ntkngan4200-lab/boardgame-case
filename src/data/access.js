import cover960 from '../assets/access/access-cover-960.webp'
import cover1680 from '../assets/access/access-cover-1680.webp'

// Access Page của từng sản phẩm: ảnh bìa + ô nhập mã truy cập.
// codeHashes = SHA-256 của "<productId>:<mã viết hoa>", tạo bằng:
//   printf 'p1:0000' | shasum -a 256
// Tạm thời chỉ có mã 0000 cho tới khi có danh sách mã truy cập hợp lệ.
const accessPages = {
  p1: {
    productId: 'p1',
    title: 'Phạm Thùy Chi',
    cover: {
      srcSet: `${cover960} 960w, ${cover1680} 1680w`,
      src: cover1680,
      width: 1680,
      height: 944,
      alt: 'Poster vụ án Phạm Thùy Chi: cô gái mặc váy đi trên con phố đêm ướt mưa, cạnh Khách sạn Mai Hoa',
    },
    codeHashes: ['d3fb6dd3196d0370066f5ba31a1b312d8cb06edbbe70445d3b4be413b2935599'],
    next: '/p1/o1/q1',
    backTo: '/',
  },
}

export function getAccessPage(productId) {
  return accessPages[productId] ?? null
}
