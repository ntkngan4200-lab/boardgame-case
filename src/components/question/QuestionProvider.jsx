import { createContext, use, useId, useState } from 'react'
import { countCorrect, verifyAnswer } from '../../lib/verifyAnswer'

const QuestionContext = createContext(null)

// initialSelectedIds: lựa chọn đã lưu của mã truy cập (hoặc đáp án điền sẵn cho mã admin); onSelectionChange: lưu tiến trình
export function QuestionProvider({ question, initialSelectedIds = [], onSelectionChange, onAnswer, children }) {
  const titleId = useId()
  const pick = question.pick ?? 1
  // minPick < pick: chọn từ minPick tới pick lựa chọn (vd. 1–2 hồ sơ); mặc định phải chọn đủ pick
  const minPick = question.minPick ?? pick
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds)
  const [status, setStatus] = useState('idle') // 'idle' | 'missing' | 'limit' | 'checking'

  function select(optionIds) {
    setSelectedIds(optionIds)
    onSelectionChange?.(optionIds)
  }

  // Chọn chỉ đánh dấu X; chuyển trang chỉ xảy ra khi bấm Xác nhận
  function toggle(optionId) {
    setStatus('idle')
    if (pick === 1) {
      select([optionId])
    } else if (selectedIds.includes(optionId)) {
      select(selectedIds.filter((id) => id !== optionId))
    } else if (selectedIds.length < pick) {
      select([...selectedIds, optionId])
    } else {
      setStatus('limit')
    }
  }

  async function submit() {
    if (status === 'checking') return
    if (selectedIds.length < minPick) {
      setStatus('missing')
      return
    }

    setStatus('checking')
    try {
      // Câu hỏi không có đáp án đúng (vd. phiếu yêu cầu hồ sơ) thì chỉ trả về lựa chọn
      const [isCorrect, correctCount] = question.answerHash || question.answerHashes
        ? await Promise.all([verifyAnswer(question, selectedIds), countCorrect(question, selectedIds)])
        : [null, null]
      await onAnswer({ optionIds: selectedIds, isCorrect, correctCount })
    } catch (error) {
      console.error('[Kính Lúp] Không xử lý được lựa chọn', error)
      setStatus('idle')
    }
  }

  const value = {
    state: { selectedIds, status },
    actions: { toggle, submit },
    meta: { question, pick, minPick, titleId },
  }

  return <QuestionContext value={value}>{children}</QuestionContext>
}

export function useQuestion() {
  const context = use(QuestionContext)
  if (!context) throw new Error('useQuestion phải nằm trong <Question.Root>')
  return context
}
