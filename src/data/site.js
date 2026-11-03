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
  { label: 'Về chúng tôi', to: '/ve-chung-toi' },
  { label: 'Hỗ trợ', children: supportLinks },
  { label: 'Liên hệ', href: '#lien-he' },
]

// Cột "Vụ án" ở Footnote: các vụ án đã ra mắt, bấm vào tên để tới Access Page
export const caseLinks = products.filter((product) => !product.comingSoon).map(({ title, to }) => ({ label: title, to }))

// Để trống, điền sau
export const contact = {
  phone: '0942 655 204',
  email: '',
}

// Để trống, điền sau: link trang mạng xã hội / gian hàng
export const socialLinks = [
  { id: 'facebook', label: 'Facebook', href: '', icon: siFacebook },
  { id: 'tiktok', label: 'TikTok', href: '', icon: siTiktok },
  { id: 'threads', label: 'Threads', href: '', icon: siThreads },
  { id: 'instagram', label: 'Instagram', href: '', icon: siInstagram },
  { id: 'shopee', label: 'Shopee', href: '', icon: siShopee },
]
