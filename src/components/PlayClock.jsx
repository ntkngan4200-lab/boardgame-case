import { useEffect, useRef, useState } from 'react'
import { pausePlay, playedTime, resumePlay } from '../lib/progress'
import { usePlayTiming } from '../lib/usePlayTiming'

// "05:09" · "1:05:09"
function formatClock(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
}

// Vẽ lại mỗi giây khi đồng hồ đang chạy
function useNow(running) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!running) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [running])
  return now
}

// Đồng hồ nhỏ ở góc trên bên phải các trang chơi + nút Tạm dừng ngay bên dưới.
// Đang tạm dừng: màn hình "Đang tạm dừng" che trang, phải bấm Tiếp tục thì mới chơi tiếp (kể cả khi tải lại trang
// hoặc nhập lại mã trên thiết bị khác).
export function PlayClock({ productId }) {
  const timing = usePlayTiming(productId)
  const running = Boolean(timing && !timing.pausedAt && !timing.stoppedAt)
  const now = useNow(running)

  if (!timing) return null
  const time = formatClock(playedTime(timing, now))

  return (
    // Khung cao 0 dính đầu màn hình: bắt đầu ngay dưới header, cuộn trang thì đồng hồ vẫn ở góc
    <div className="sticky top-0 z-40 h-0">
      <div className="play-clock absolute right-3 top-3 sm:right-5">
        <p className="play-clock__time" role="timer" aria-label={`Thời gian chơi ${time}`}>
          <ClockIcon />
          <span aria-hidden="true">{time}</span>
        </p>
        {timing.stoppedAt ? null : (
          <button type="button" className="play-clock__pause" onClick={() => pausePlay(productId)}>
            <PauseIcon />
            {/* Điện thoại: chỉ hiện biểu tượng để không đè lên nhãn giai đoạn */}
            <span className="max-sm:sr-only">Tạm dừng</span>
          </button>
        )}
      </div>
      {timing.pausedAt ? <PausedDialog productId={productId} time={time} /> : null}
    </div>
  )
}

function PausedDialog({ productId, time }) {
  const dialogRef = useRef(null)

  // showModal: khoá phần trang phía sau và đưa focus vào hộp thoại
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="paused-dialog answer-sheet"
      aria-labelledby="tam-dung-tieu-de"
      // Esc không thoát tạm dừng: phải bấm Tiếp tục
      onCancel={(event) => event.preventDefault()}
    >
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-maroon/70">Thời gian chơi {time}</p>
      <h2 id="tam-dung-tieu-de" className="mt-3 font-display text-4xl text-maroon sm:text-5xl">
        Đang tạm dừng
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-balance text-base leading-relaxed">
        Thời gian tạm dừng không được tính vào thời gian chơi. Bấm Tiếp tục khi cả nhóm đã sẵn sàng phá giải vụ án này.
      </p>
      <button type="button" className="confirm-button mt-7" autoFocus onClick={() => resumePlay(productId)}>
        Tiếp tục
      </button>
    </dialog>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9.5 2.5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}
