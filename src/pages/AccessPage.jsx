import { useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BuyButton } from '../components/BuyButton'
import { getAccessPage } from '../data/access'
import { grantAccess } from '../lib/access'
import { verifyAccessCode } from '../lib/verifyAnswer'
import { ComingSoonPage } from './ComingSoonPage'

export function AccessPage() {
  const { productId } = useParams()
  const access = getAccessPage(productId)

  if (!access) return <ComingSoonPage />

  // key: xoá mã đã nhập khi chuyển sang Access Page của sản phẩm khác
  return <AccessContent key={access.productId} access={access} />
}

function AccessContent({ access }) {
  const navigate = useNavigate()
  const location = useLocation()
  const inputId = useId()
  const messageId = useId()
  const [status, setStatus] = useState('idle')

  async function handleSubmit(event) {
    event.preventDefault()
    const code = String(new FormData(event.currentTarget).get('code') ?? '')
    if (!code.trim()) {
      setStatus('missing')
      return
    }
    setStatus('checking')
    if (await verifyAccessCode(access, code)) {
      grantAccess(access.productId)
      // Bị chặn ở trang nào thì quay lại đúng trang đó, nếu không thì vào Câu hỏi 1
      const from = location.state?.from
      navigate(from?.startsWith(`/${access.productId}/`) ? from : access.next, { replace: Boolean(from) })
    } else {
      setStatus('wrong')
    }
  }

  return (
    <>
      <title>{`Mã truy cập · ${access.title} · Kính Lúp`}</title>
      <h1 className="sr-only">{access.title}</h1>

      {/* Ảnh bìa tràn hết bề ngang; nút Mua ngay tách riêng bên dưới, không đè lên ảnh */}
      <figure className="full-bleed-image">
        <img
          srcSet={access.cover.srcSet}
          sizes="100vw"
          src={access.cover.src}
          width={access.cover.width}
          height={access.cover.height}
          alt={access.cover.alt}
          fetchPriority="high"
        />
      </figure>
      <div className="mt-8 flex justify-center px-3 sm:mt-10">
        <BuyButton />
      </div>

      <section className="px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
        <form noValidate onSubmit={handleSubmit} className="answer-sheet mx-auto max-w-2xl px-4 py-8 sm:px-10 sm:py-10">
          <h2 className="text-center font-display text-3xl tracking-wide text-maroon sm:text-4xl">
            <label htmlFor={inputId}>Mã truy cập</label>
          </h2>
          <input
            id={inputId}
            name="code"
            className="code-input mt-6"
            placeholder="••••"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-invalid={status === 'wrong'}
            aria-describedby={messageId}
            onChange={() => {
              if (status !== 'idle') setStatus('idle')
            }}
          />
          <p
            id={messageId}
            aria-live="polite"
            className="mt-3 min-h-5 text-center text-sm font-semibold text-maroon"
          >
            {status === 'missing' ? 'Hãy nhập mã truy cập trước khi xác nhận.' : ''}
            {status === 'wrong' ? 'Mã truy cập không đúng. Hãy thử lại.' : ''}
            {status === 'checking' ? 'Đang kiểm tra…' : ''}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-maroon/20 pt-6">
            <Link to={access.backTo} className="pill-button min-w-[7.5rem] px-5 sm:min-w-44 sm:px-8">
              Trở lại
            </Link>
            <button
              type="submit"
              className="confirm-button ml-auto min-w-[7.5rem] px-5 sm:min-w-40 sm:px-8"
              disabled={status === 'checking'}
            >
              Xác nhận
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
