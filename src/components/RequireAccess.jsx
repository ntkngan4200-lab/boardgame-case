import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { getAccessPage } from '../data/access'
import { hasAccess } from '../lib/access'

// Chặn các trang câu hỏi / trả lời sai / lời giải khi chưa nhập mã truy cập của sản phẩm
export function RequireAccess() {
  const { productId } = useParams()
  const location = useLocation()
  const access = getAccessPage(productId)

  // Sản phẩm chưa có Access Page thì để trang con tự xử lý (Sắp ra mắt)
  if (!access || hasAccess(productId)) return <Outlet />

  return (
    <section className="px-4 py-20 sm:px-8">
      <title>Hãy nhập mã truy cập · Kính Lúp</title>
      <div className="mx-auto max-w-xl rotate-[-0.6deg] rounded-sm bg-blush px-8 py-12 text-center shadow-[0_18px_30px_-16px_rgb(0_0_0/0.75)]">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-graphite">Hồ sơ đang niêm phong</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-maroon sm:text-4xl">Hãy nhập mã truy cập</h1>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="pill-button min-w-[9rem] px-6">
            Về trang chủ
          </Link>
          <Link
            to={`/${productId}/truy-cap`}
            state={{ from: location.pathname }}
            className="confirm-button inline-flex min-w-[9rem] items-center justify-center px-6"
          >
            Nhập mã
          </Link>
        </div>
      </div>
    </section>
  )
}
