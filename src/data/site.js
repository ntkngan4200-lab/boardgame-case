import { siFacebook, siInstagram, siShopee, siThreads, siTiktok } from 'simple-icons'
import { products } from './home'

// Mục "Hỗ trợ": dùng chung cho menu sổ xuống ở Header và cột Hỗ trợ ở Footnote
export const supportLinks = [
  { label: 'Hướng dẫn chơi', to: '/ho-tro/huong-dan-choi' },
  { label: 'Hồ sơ', to: '/ho-tro/ho-so' },
  { label: "FAQ's", to: '/ho-tro/faq' },
]

// Thanh công cụ Header. "Liên hệ" kéo xuống cột Liên hệ ở Footnote của trang đang xem.
export const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Về Kính Lúp', to: '/ve-kinh-lup' },
  { label: 'Hỗ trợ', children: supportLinks },
  { label: 'Liên hệ', href: '#lien-he' },
]

// Cột "Vụ án" ở Footnote: các vụ án đã ra mắt, bấm vào tên để tới Access Page
export const caseLinks = products.filter((product) => !product.comingSoon).map(({ title, to }) => ({ label: title, to }))

export const contact = {
  phone: '0942 655 204',
  email: 'kinhlupinfo@gmail.com',
}

// Link trang mạng xã hội / gian hàng (bỏ tham số theo dõi như fbclid). href trống: biểu tượng chưa bấm được
export const socialLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/people/K%C3%ADnh-L%C3%BAp-Board-game-ph%C3%A1-%C3%A1n-Vi%E1%BB%87t-Nam/61596411782473/',
    icon: siFacebook,
  },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@kinhlupboardgame', icon: siTiktok },
  { id: 'threads', label: 'Threads', href: 'https://www.threads.com/@_kinhlupbg', icon: siThreads },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/_kinhlupbg', icon: siInstagram },
  { id: 'shopee', label: 'Shopee', href: '', icon: siShopee },
]
