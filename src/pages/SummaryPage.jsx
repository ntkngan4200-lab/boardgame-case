import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CaseBand } from '../components/CaseBand'
import { getAccessPage } from '../data/access'
import { fetchPlayResult, getProgressPath } from '../lib/progress'
import { usePlayTiming } from '../lib/usePlayTiming'
import { ComingSoonPage } from './ComingSoonPage'

// "1 giờ 5 phút" · "42 phút" · "dưới 1 phút"
function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return totalMinutes > 0 ? `${minutes} phút` : 'dưới 1 phút'
  return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`
}

// So sánh thời gian của lượt chơi với các nhóm khác (máy chủ tính); status: 'loading' | 'done' | 'error'
function usePlayResult(productId, runId) {
  const [result, setResult] = useState({ runId: null, status: 'loading' })

  useEffect(() => {
    if (!runId) return undefined
    let active = true
    fetchPlayResult(productId).then(
      (data) => active && setResult({ runId, status: 'done', ...data }),
      () => active && setResult({ runId, status: 'error' }),
    )
    return () => {
      active = false
    }
  }, [productId, runId])

  return result.runId === runId ? result : { status: 'loading' }
}

// Trang Tóm tắt sau lời giải Giai đoạn 2: thời gian chơi + nhanh hơn bao nhiêu % số nhóm đã phá vụ án
export function SummaryPage() {
  const { productId } = useParams()
  const access = getAccessPage(productId)
  const timing = usePlayTiming(productId)
  const result = usePlayResult(productId, timing?.stoppedAt ? timing.startedAt : null)

  if (!access) return <ComingSoonPage />

  return (
    <>
      <title>{`Tóm tắt · ${access.title} · Kính Lúp`}</title>
      <CaseBand stage="Tóm tắt" heading={`Vụ án ${access.title}`} />

      <section className="px-4 py-12 sm:px-8 sm:py-16">
        <div className="answer-sheet mx-auto max-w-2xl px-5 py-10 text-center sm:px-12 sm:py-12">
          {timing?.stoppedAt ? (
            <>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-maroon/70 sm:text-sm">
                Thời gian phá án
              </p>
              <p className="summary-time mt-3 font-display text-maroon">{formatDuration(timing.elapsed)}</p>
              <Ranking result={result} />
              <div className="hint-note mx-auto mt-8 max-w-md text-left">
                <p className="font-display text-2xl tracking-wide text-maroon">Chia sẻ ngay!</p>
                <p className="text-base leading-relaxed">
                  15 thám tử đầu tiên khoe chiến tích với bạn bè và tag Kính Lúp trên bất kỳ nền tảng nào sẽ nhận được
                  voucher 5% cho sản phẩm tiếp theo của Kính Lúp đấy.
                </p>
              </div>
              <p className="mx-auto mt-8 max-w-md text-balance border-t border-maroon/20 pt-5 text-sm leading-relaxed text-maroon/80">
                Thời gian tính từ lúc nhập mã tới khi giải xong Giai đoạn 2, không tính các khoảng bấm Tạm dừng.
              </p>
            </>
          ) : (
            <p className="text-balance text-xl font-bold leading-snug sm:text-2xl">
              Bạn chưa phá xong vụ án. Hoàn thành Giai đoạn 2 để xem thời gian chơi của nhóm.
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {timing?.stoppedAt ? (
              <Link to={access.finalPath} className="pill-button">
                Xem lại lời giải
              </Link>
            ) : (
              <Link to={getProgressPath(productId) ?? access.next} className="pill-button">
                Tiếp tục chơi
              </Link>
            )}
            <Link to="/" className="pill-button">
              Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Ranking({ result }) {
  if (result.status === 'loading') {
    return (
      <p className="mt-6 text-base font-semibold text-maroon/80" aria-live="polite">
        Đang so sánh với các nhóm khác…
      </p>
    )
  }
  if (result.status === 'error') {
    return (
      <p className="mt-6 text-balance text-base font-semibold text-maroon/80" aria-live="polite">
        Chưa kết nối được máy chủ để so sánh với các nhóm khác. Bạn thử tải lại trang sau ít phút nhé.
      </p>
    )
  }
  if (result.fasterThan == null) {
    return (
      <p className="mt-6 text-balance text-base font-semibold text-maroon/80" aria-live="polite">
        Chưa đủ số nhóm phá xong vụ án này để so sánh. Quay lại trang này sau để xem nhóm bạn đứng ở đâu nhé.
      </p>
    )
  }

  return (
    <div className="mx-auto mt-7 max-w-md" aria-live="polite">
      <p className="text-balance text-xl font-bold leading-snug sm:text-2xl">
        Nhanh hơn <span className="font-display text-3xl tracking-wide sm:text-4xl">{result.fasterThan}%</span> số
        nhóm đã phá vụ án này
      </p>
      {/* Thanh vị trí của nhóm: trái là chậm nhất, phải là nhanh nhất */}
      <div className="summary-rank mt-5" aria-hidden="true">
        <span className="summary-rank__fill" style={{ width: `${result.fasterThan}%` }} />
        <span className="summary-rank__mark" style={{ left: `${result.fasterThan}%` }} />
      </div>
      <p className="mt-2 flex justify-between font-mono text-xs font-bold uppercase tracking-[0.16em] text-maroon/60">
        <span>Chậm nhất</span>
        <span>Nhanh nhất</span>
      </p>
      <p className="mt-3 text-sm text-maroon/70">So với {result.compared} nhóm đã phá xong vụ án.</p>
    </div>
  )
}
