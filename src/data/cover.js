import bangDinh from '../assets/cover/bang-dinh.webp'
import bao from '../assets/cover/bao.jpg'
import bienBan from '../assets/cover/bien-ban.webp'
import buaToi from '../assets/cover/bua-toi.jpg'
import chi from '../assets/cover/chi.jpg'
import ghim from '../assets/cover/ghim.webp'
import ghimGiay from '../assets/cover/ghim-giay.webp'
import keLon from '../assets/cover/ke-lon.webp'
import kep from '../assets/cover/kep.webp'
import ketLuan from '../assets/cover/ket-luan.webp'
import khachSan from '../assets/cover/khach-san.jpg'
import leTan from '../assets/cover/le-tan.jpg'
import linhVat from '../assets/cover/linh-vat.webp'
import matBang from '../assets/cover/mat-bang.webp'
import nanNhan from '../assets/cover/nan-nhan.jpg'
import nguoiDanOng from '../assets/cover/nguoi-dan-ong.jpg'
import nguoiDi from '../assets/cover/nguoi-di.jpg'
import nguoiMu from '../assets/cover/nguoi-mu.jpg'
import soTay from '../assets/cover/so-tay.webp'
import toaNha from '../assets/cover/toa-nha.webp'
import vatChung from '../assets/cover/vat-chung.jpg'

// ar = cao / rộng của ảnh gốc; frame: 'polaroid' | 'print' | undefined
export const coverImages = {
  bangDinh: { src: bangDinh, ar: 0.262 },
  bao: { src: bao, ar: 0.66, frame: 'print' },
  bienBan: { src: bienBan, ar: 1.445 },
  buaToi: { src: buaToi, ar: 1.097, frame: 'polaroid' },
  chi: { src: chi, ar: 1.463, frame: 'polaroid' },
  ghim: { src: ghim, ar: 1.78 },
  ghimGiay: { src: ghimGiay, ar: 0.737 },
  keLon: { src: keLon, ar: 0.976 },
  kep: { src: kep, ar: 0.82 },
  ketLuan: { src: ketLuan, ar: 1.457 },
  khachSan: { src: khachSan, ar: 1.036, frame: 'polaroid' },
  leTan: { src: leTan, ar: 1.249, frame: 'polaroid' },
  linhVat: { src: linhVat, ar: 1 },
  matBang: { src: matBang, ar: 0.723 },
  nanNhan: { src: nanNhan, ar: 0.563, frame: 'polaroid' },
  nguoiDanOng: { src: nguoiDanOng, ar: 1.3, frame: 'polaroid' },
  nguoiDi: { src: nguoiDi, ar: 1.333, frame: 'polaroid' },
  nguoiMu: { src: nguoiMu, ar: 1.107, frame: 'polaroid' },
  soTay: { src: soTay, ar: 0.75 },
  toaNha: { src: toaNha, ar: 0.558, frame: 'print' },
  vatChung: { src: vatChung, ar: 0.75, frame: 'print' },
}

// Toạ độ x, y là tâm (đơn vị của sân khấu); w là % chiều rộng sân khấu; rot đơn vị độ.
// ar (tuỳ chọn): cắt ảnh theo tỉ lệ cao/rộng khác, pos là vị trí giữ lại khi cắt.
// Thứ tự mảng = thứ tự xếp lớp (sau nằm trên). pin: ghim đỏ ở mép trên.
export const coverLayouts = {
  wide: {
    w: 1600,
    h: 920,
    ink: 4,
    logo: { x: 800, y: 128, tagline: { x: 800, y: 296 } },
    items: [
      // Cụm trái: tòa nhà cao + ảnh khách sạn
      { id: 'toa-nha', img: 'toaNha', x: 215, y: 440, w: 18, ar: 1.45, pos: '12% 50%', rot: -4 },
      { id: 'khach-san', img: 'khachSan', x: 265, y: 790, w: 12, rot: 5 },
      { id: 'bang-dinh', img: 'bangDinh', x: 265, y: 695, w: 8.5, rot: -8 },

      // Sổ tay ở giữa: trang trái là chân dung + giấy tờ, trang phải là hiện trường + báo
      { id: 'so-tay', img: 'soTay', x: 800, y: 610, w: 72, rot: 0 },
      { id: 'chi', img: 'chi', x: 520, y: 445, w: 7.2, rot: -5, pin: true },
      { id: 'nguoi-dan-ong', img: 'nguoiDanOng', x: 540, y: 570, w: 7.2, rot: 4 },
      { id: 'le-tan', img: 'leTan', x: 520, y: 690, w: 7.2, rot: -3 },
      { id: 'nguoi-mu', img: 'nguoiMu', x: 542, y: 800, w: 7.2, rot: 4 },
      { id: 'vat-chung', img: 'vatChung', x: 665, y: 520, w: 13, ar: 0.62, pos: '50% 8%', rot: -6 },
      { id: 'nguoi-di', img: 'nguoiDi', x: 690, y: 735, w: 9.4, rot: -5, pin: true },
      { id: 'nan-nhan', img: 'nanNhan', x: 925, y: 465, w: 14, rot: 2, pin: true },
      { id: 'bua-toi', img: 'buaToi', x: 1065, y: 580, w: 10, rot: 5, pin: true },
      { id: 'bao', img: 'bao', x: 985, y: 775, w: 16.5, rot: -2 },
      { id: 'ke-lon', img: 'keLon', x: 435, y: 780, w: 8, rot: 25 },

      // Cụm phải: tài liệu + mặt bằng
      { id: 'bien-ban', img: 'bienBan', x: 1340, y: 300, w: 14.5, rot: 5 },
      { id: 'ket-luan', img: 'ketLuan', x: 1450, y: 375, w: 14.5, rot: 10 },
      { id: 'kep', img: 'kep', x: 1495, y: 150, w: 8, rot: -10 },
      { id: 'mat-bang', img: 'matBang', x: 1385, y: 715, w: 23, rot: -4 },
      { id: 'ghim-giay', img: 'ghimGiay', x: 1265, y: 590, w: 8, rot: 35 },
      { id: 'linh-vat', img: 'linhVat', x: 1015, y: 100, w: 8.2, rot: 0 },
    ],
    // Dây đỏ vẽ tay: from/to là id; bend là độ cong (đơn vị sân khấu)
    lines: [
      { from: 'chi', to: 'vat-chung', bend: -35 },
      { from: 'vat-chung', to: 'nan-nhan', bend: -60 },
      { from: 'nguoi-dan-ong', to: 'nguoi-di', bend: 40, arrow: true },
      { from: 'nan-nhan', to: 'bua-toi', bend: 35 },
      { from: 'toa-nha', to: 'le-tan', bend: 90, arrow: true },
      { from: 'bua-toi', to: 'mat-bang', bend: 80, arrow: true },
      { from: 'nan-nhan', to: 'bien-ban', bend: -110 },
    ],
    doodles: [
      { type: 'circle', around: 'chi', pad: 12 },
      { type: 'question', x: 1215, y: 640, s: 1.4, rot: 10 },
      { type: 'question', x: 400, y: 560, s: 1, rot: -12 },
      { type: 'sparkle', x: 470, y: 345, s: 1 },
      { type: 'sparkle', x: 1190, y: 430, s: 0.8 },
      { type: 'underline', x: 800, y: 330, len: 340 },
    ],
  },
  tall: {
    w: 900,
    h: 1740,
    ink: 6.5,
    logo: { x: 450, y: 175, tagline: { x: 450, y: 372 } },
    items: [
      { id: 'so-tay', img: 'soTay', x: 450, y: 800, w: 100, rot: 0 },
      { id: 'vat-chung', img: 'vatChung', x: 300, y: 700, w: 20, ar: 0.62, pos: '50% 8%', rot: -6 },
      { id: 'chi', img: 'chi', x: 150, y: 610, w: 13, rot: -5, pin: true },
      { id: 'nguoi-dan-ong', img: 'nguoiDanOng', x: 165, y: 735, w: 13, rot: 4 },
      { id: 'le-tan', img: 'leTan', x: 150, y: 860, w: 13, rot: -3 },
      { id: 'nguoi-mu', img: 'nguoiMu', x: 168, y: 985, w: 13, rot: 4 },
      { id: 'nguoi-di', img: 'nguoiDi', x: 320, y: 960, w: 15, rot: -5, pin: true },
      { id: 'nan-nhan', img: 'nanNhan', x: 620, y: 620, w: 24, rot: 2, pin: true },
      { id: 'bua-toi', img: 'buaToi', x: 715, y: 775, w: 15, rot: 5, pin: true },
      { id: 'bao', img: 'bao', x: 620, y: 960, w: 27, rot: -2 },
      { id: 'ke-lon', img: 'keLon', x: 70, y: 1090, w: 12, rot: 25 },

      { id: 'toa-nha', img: 'toaNha', x: 250, y: 1295, w: 38, ar: 1.05, pos: '12% 50%', rot: -4 },
      { id: 'khach-san', img: 'khachSan', x: 680, y: 1280, w: 28, rot: 4 },
      { id: 'bang-dinh', img: 'bangDinh', x: 680, y: 1135, w: 16, rot: -8 },
      { id: 'bien-ban', img: 'bienBan', x: 150, y: 1565, w: 23, rot: -6 },
      { id: 'ket-luan', img: 'ketLuan', x: 300, y: 1595, w: 23, rot: 5 },
      { id: 'kep', img: 'kep', x: 215, y: 1470, w: 12, rot: -12 },
      { id: 'mat-bang', img: 'matBang', x: 700, y: 1590, w: 38, rot: -3 },
      { id: 'linh-vat', img: 'linhVat', x: 690, y: 100, w: 17, rot: 0 },
    ],
    lines: [
      { from: 'chi', to: 'vat-chung', bend: -30 },
      { from: 'vat-chung', to: 'nan-nhan', bend: -55 },
      { from: 'nguoi-dan-ong', to: 'nguoi-di', bend: 35, arrow: true },
      { from: 'nan-nhan', to: 'bua-toi', bend: 30 },
      { from: 'le-tan', to: 'bao', bend: 55, arrow: true },
      { from: 'bua-toi', to: 'khach-san', bend: 70 },
      { from: 'toa-nha', to: 'nguoi-mu', bend: 60, arrow: true },
    ],
    doodles: [
      { type: 'circle', around: 'chi', pad: 14 },
      { type: 'question', x: 830, y: 1010, s: 1.2, rot: 10 },
      { type: 'question', x: 60, y: 520, s: 1, rot: -12 },
      { type: 'sparkle', x: 80, y: 480, s: 1 },
      { type: 'underline', x: 450, y: 405, len: 460 },
    ],
  },
}

export { ghim as pinSrc }
