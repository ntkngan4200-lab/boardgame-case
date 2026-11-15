import hook1200 from '../assets/home/hook-bia-1200.webp'
import hook2400 from '../assets/home/hook-bia-2400.webp'
import posterP1 from '../assets/home/poster-p1.webp'
import sapRaMatA from '../assets/home/sap-ra-mat-a.webp'
import sapRaMatB from '../assets/home/sap-ra-mat-b.webp'
import sapRaMatC from '../assets/home/sap-ra-mat-c.webp'
import sapRaMatD from '../assets/home/sap-ra-mat-d.webp'
import sapRaMatE from '../assets/home/sap-ra-mat-e.webp'
import sapRaMatF from '../assets/home/sap-ra-mat-f.webp'

export const hook = {
  srcSet: `${hook1200} 1200w, ${hook2400} 2400w`,
  src: hook2400,
  width: 2880,
  height: 1619,
  alt: 'Sổ điều tra mở với ảnh các nhân vật, báo Phù Sa và hồ sơ vụ án, cùng slogan Insight starts in sight',
}

// Cùng thứ tự với lưới vụ án ở Hỗ trợ › Hồ sơ: vụ án đã ra mắt đứng đầu, sau đó là các vụ sắp ra mắt.
// Vụ án chưa ra mắt không có title.
export const products = [
  { id: 'p1', title: 'Phạm Thùy Chi', poster: posterP1, to: '/p1/truy-cap' },
  { id: 'p7', poster: sapRaMatE, comingSoon: true },
  { id: 'p5', poster: sapRaMatC, comingSoon: true },
  { id: 'p3', poster: sapRaMatB, comingSoon: true },
  { id: 'p2', poster: sapRaMatA, comingSoon: true },
  { id: 'p4', poster: sapRaMatD, comingSoon: true },
  { id: 'p6', poster: sapRaMatF, comingSoon: true },
]

// Để trống, điền sau: link mua hàng cho nút "Mua ngay"
export const buyUrl = ''
