// Màu lấy từ biến CSS trong src/styles/index.css (:root) — đổi tone chỉ cần sửa ở đó
const tone = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Web Tone Option 2: maroon > graphite > blush > cream (mức dùng giảm dần)
      colors: {
        maroon: tone('maroon'),
        graphite: tone('graphite'),
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
