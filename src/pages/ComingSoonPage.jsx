import { Link } from 'react-router-dom'

// Trang chờ cho các đường dẫn chưa xây (Về chúng tôi, FAQ's, Tìm kiếm, …)
export function ComingSoonPage() {
  return (
    <section className="px-4 py-20 sm:px-8">
      <title>Đang xây dựng · Kính Lúp</title>
      <div className="mx-auto max-w-xl rotate-[-0.6deg] rounded-sm bg-blush px-8 py-12 text-center shadow-[0_18px_30px_-16px_rgb(0_0_0/0.75)]">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-graphite">Hồ sơ đang niêm phong</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-maroon sm:text-4xl">Trang này đang được xây dựng</h1>
        <Link
          to="/"
          className="mt-8 inline-block rounded-sm bg-maroon px-5 py-3 text-sm font-semibold text-cream hover:bg-graphite"
        >
          Về trang chủ
        </Link>
      </div>
    </section>
  )
}
