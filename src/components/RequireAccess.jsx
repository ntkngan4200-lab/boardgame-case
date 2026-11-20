import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { getAccessPage } from '../data/access'
import { hasAccess } from '../lib/access'
import { recordVisit } from '../lib/progress'
import { PlayClock } from './PlayClock'

// Chặn các trang câu hỏi / trả lời sai / lời giải khi chưa nhập mã truy cập của sản phẩm
export function RequireAccess() {
  const { productId } = useParams()
  const location = useLocation()
  const access = getAccessPage(productId)
  const allowed = access ? hasAccess(productId) : false

  // Lưu trang đang chơi của mã truy cập để lần nhập mã sau mở lại đúng trang này
  useEffect(() => {
    if (allowed) recordVisit(access, location.pathname)
  }, [access, allowed, location.pathname])

  // Sản phẩm chưa có Access Page thì để trang con tự xử lý (Sắp ra mắt)
  if (!access) return <Outlet />
  if (allowed) {
    return (
      <>
        {/* Trang Tóm tắt đã hiện thời gian chơi, không cần đồng hồ ở góc */}
        {location.pathname === access.summaryPath ? null : <PlayClock productId={productId} />}
        <Outlet />
      </>
    )
  }

  // Bấm link trong web tới trang chơi khi chưa nhập mã: sang trang Nhập mã, nhập đúng thì quay lại trang này.
  // Mở thẳng link / quét QR thì redirectBlockedDeepLink (main.jsx) đã đổi URL trước khi React vẽ.
  return <Navigate to={`/${productId}/truy-cap`} replace state={{ from: location.pathname }} />
}
