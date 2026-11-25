import { useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BuyButton } from '../components/BuyButton'
import { getAccessPage } from '../data/access'
import { grantAccess } from '../lib/access'
import { lookupLocation } from '../lib/location'
import { openSession } from '../lib/progress'
import { verifyAccessCode } from '../lib/verifyAnswer'
import { ComingSoonPage } from './ComingSoonPage'

// Hai lựa chọn dưới ô nhập mã: mở lại tiến trình đã lưu của mã, hoặc bắt đầu lượt chơi mới (vd. mã được chuyển cho nhóm khác)
const PLAY_MODES = [
  {
    value: 'continue',
    label: 'Tiếp tục',
    hint: 'Tiếp tục tại điểm đã tạm dừng. Nếu đã phá xong vụ án, bạn sẽ xem lại được thành tích của mình.',
  },
  {
    value: 'restart',
    label: 'Chơi mới',
    hint: 'Bắt đầu lại từ Câu hỏi 1 Giai đoạn 1 và đồng hồ chơi tính lại từ đầu.',
  },
]

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
  const [mode, setMode] = useState('continue')

  async function handleSubmit(event) {
    event.preventDefault()
    const code = String(new FormData(event.currentTarget).get('code') ?? '')
    if (!code.trim()) {
      setStatus('missing')
      return
    }
    setStatus('checking')
    const session = await verifyAccessCode(access, code)
    if (!session) {
      setStatus('wrong')
      return
    }
    // Tiếp tục: mở lại trang mã này đang chơi dở (chưa chơi thì về trang bị chặn, nếu có, không thì vào Câu hỏi 1).
    // Chơi mới: luôn bắt đầu từ Câu hỏi 1.
    const resumePath = await openSession(access, session.code, mode)
    grantAccess(access.productId, session)
    const from = location.state?.from
    const resumeBlocked = mode === 'continue' && resumePath === access.next && from?.startsWith(`/${access.productId}/`)
    const target = resumeBlocked ? from : resumePath
    navigate(target, { replace: Boolean(from) })
  }

  return (
    <>
      <title>{`Mã truy cập · ${access.title} · Kính Lúp`}</title>
      <h1 className="sr-only">{access.title}</h1>

      {/* Ảnh bìa tràn hết bề ngang, mặt đường ướt trong bìa kéo dài xuống tới Footnote; nội dung nằm trên nền */}
      <div
        className="access-scene"
        style={{
          '--cover-ratio': access.cover.height / access.cover.width,
          '--road-tile': `url(${access.cover.road})`,
          '--reflection-x': access.cover.reflection.x / access.cover.width,
          '--reflection-y': access.cover.reflection.y / access.cover.height,
          '--reflection-w': access.cover.reflection.width / access.cover.width,
          '--cover-text-x': access.cover.textX / access.cover.width,
        }}
      >
        <figure className="full-bleed-image access-cover">
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
        <img src={access.cover.reflection.src} alt="" className="access-scene__reflection" />
        <div className="access-road">
          <div className="flex justify-center px-3 pt-8 sm:pt-10">
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
                  // Đoán vị trí sẵn trong lúc người chơi gõ mã để ghi kèm lượt truy cập
                  lookupLocation()
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
              <fieldset className="mt-2">
                <legend className="sr-only">Cách mở vụ án</legend>
                <div className="mode-switch">
                  {PLAY_MODES.map((option) => (
                    <label key={option.value} className="mode-switch__option">
                      <input
                        type="radio"
                        name="mode"
                        value={option.value}
                        checked={mode === option.value}
                        onChange={() => setMode(option.value)}
                        className="sr-only"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 min-h-10 text-balance text-center text-sm leading-relaxed text-maroon/80">
                  {PLAY_MODES.find((option) => option.value === mode).hint}
                </p>
              </fieldset>
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
        </div>
      </div>
    </>
  )
}
