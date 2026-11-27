import { createContext, use, useId, useState } from 'react'
import { getSavedSelection } from '../../lib/progress'
import { hintGateKey } from './HintGate'

const HintsContext = createContext(null)

// hints: chuỗi, hoặc { text, gate } khi gợi ý phải trả lời đúng câu hỏi phụ mới xem được nội dung (xem HintGate).
// productId/question: dùng để kiểm tra và lưu đáp án câu hỏi phụ.
export function HintsProvider({ hints, productId, question, children }) {
  const listId = useId()
  const [revealedCount, setRevealedCount] = useState(0)
  // Chỉ số các gợi ý có câu hỏi phụ đã trả lời đúng (kể cả đã mở ở lượt xem trước)
  const [unlocked, setUnlocked] = useState(
    () =>
      new Set(
        hints.flatMap((hint, index) =>
          hint?.gate && getSavedSelection(productId, hintGateKey(question, hint.gate)).length > 0 ? [index] : [],
        ),
      ),
  )
  const isLocked = (index) => Boolean(hints[index]?.gate) && !unlocked.has(index)
  // Gợi ý vừa mở còn đang chờ câu hỏi phụ thì chưa cho mở gợi ý tiếp theo
  const waiting = revealedCount > 0 && isLocked(revealedCount - 1)

  // Mỗi lần bấm mở thêm đúng 1 gợi ý
  function revealNext() {
    if (waiting) return
    setRevealedCount((count) => Math.min(count + 1, hints.length))
  }

  function unlock(index) {
    setUnlocked((current) => new Set(current).add(index))
  }

  const value = {
    state: { revealedCount, remaining: hints.length - revealedCount, waiting, isLocked },
    actions: { revealNext, unlock },
    meta: { hints, listId, productId, question },
  }

  return <HintsContext value={value}>{children}</HintsContext>
}

export function useHints() {
  const context = use(HintsContext)
  if (!context) throw new Error('useHints phải nằm trong <Hints.Root>')
  return context
}
