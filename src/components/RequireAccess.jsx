import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { getAccessPage } from '../data/access'
import { hasAccess } from '../lib/access'
import { recordVisit } from '../lib/progress'

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
  if (!access || allowed) return <Outlet />

  // Mở thẳng link hoặc quét QR khi chưa nhập mã: sang trang Nhập mã, nhập đúng thì quay lại trang này
  return <Navigate to={`/${productId}/truy-cap`} replace state={{ from: location.pathname }} />
}
