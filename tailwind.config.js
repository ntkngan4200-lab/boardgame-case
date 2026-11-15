// Màu lấy từ biến CSS trong src/styles/index.css (:root) — đổi tone chỉ cần sửa ở đó
const tone = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Web Tone "Tone 11" (= Tone 3, màu 1 và 2 đổi chỗ): tan #2d0000 (nền trang) > maroon/graphite #6d0808 (nút, dải tiêu đề) > sage #757d6f (Footnote, bảng bằng chứng) > blush/cream #eeead7 (mức dùng giảm dần)
      colors: {
        maroon: tone('maroon'),
        graphite: tone('graphite'),
        sage: tone('sage'),
        tan: tone('tan'),
        blush: tone('blush'),
        cream: tone('cream'),
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
