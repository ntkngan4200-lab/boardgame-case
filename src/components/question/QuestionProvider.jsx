import { createContext, use, useId, useState } from 'react'
import { countCorrect, verifyAnswer } from '../../lib/verifyAnswer'

const QuestionContext = createContext(null)

export function QuestionProvider({ question, onAnswer, children }) {
  const titleId = useId()
  const pick = question.pick ?? 1
  const [selectedIds, setSelectedIds] = useState([])
  const [status, setStatus] = useState('idle') // 'idle' | 'missing' | 'limit' | 'checking'

  // Chọn chỉ đánh dấu X; chuyển trang chỉ xảy ra khi bấm Xác nhận
  function toggle(optionId) {
    setStatus('idle')
    if (pick === 1) {
      setSelectedIds([optionId])
    } else if (selectedIds.includes(optionId)) {
      setSelectedIds(selectedIds.filter((id) => id !== optionId))
    } else if (selectedIds.length < pick) {
      setSelectedIds([...selectedIds, optionId])
    } else {
      setStatus('limit')
    }
  }

  async function submit() {
    if (status === 'checking') return
    if (selectedIds.length !== pick) {
      setStatus('missing')
      return
    }

    setStatus('checking')
    try {
      const [isCorrect, correctCount] = await Promise.all([
        verifyAnswer(question, selectedIds),
        countCorrect(question, selectedIds),
      ])
      onAnswer({ optionIds: selectedIds, isCorrect, correctCount })
    } catch (error) {
      console.error('[Kính Lúp] Không kiểm tra được đáp án', error)
      setStatus('idle')
    }
  }

  const value = {
    state: { selectedIds, status },
    actions: { toggle, submit },
    meta: { question, pick, titleId },
  }

  return <QuestionContext value={value}>{children}</QuestionContext>
}

export function useQuestion() {
  const context = use(QuestionContext)
  if (!context) throw new Error('useQuestion phải nằm trong <Question.Root>')
  return context
}
