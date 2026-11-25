import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Question } from '../components/question/Question'
import { TextQuestion } from '../components/question/TextQuestion'
import { getQuestion } from '../data/product1'
import { getAccessSession } from '../lib/access'
import { getSavedSelection, saveSelection } from '../lib/progress'
import { findCorrectAnswer } from '../lib/verifyAnswer'
import { ComingSoonPage } from './ComingSoonPage'

// Mã admin: tìm đáp án đúng để điền sẵn (null khi đang tìm)
function useAdminAnswer(question) {
  const [answer, setAnswer] = useState({ questionId: null, optionIds: [] })

  useEffect(() => {
    if (!question) return undefined
    let active = true
    findCorrectAnswer(question).then((optionIds) => {
      if (active) setAnswer({ questionId: question.id, optionIds })
    })
    return () => {
      active = false
    }
  }, [question])

  return answer.questionId === question?.id ? answer.optionIds : null
}

export function QuestionPage() {
  const { productId, objectiveId, questionId } = useParams()
  const navigate = useNavigate()
  const question = getQuestion(productId, objectiveId, questionId)
  const admin = Boolean(getAccessSession(productId)?.admin)
  // Câu tự điền không có danh sách lựa chọn để mã admin điền sẵn
  const adminAnswer = useAdminAnswer(admin && question?.options ? question : null)

  if (!question) return <ComingSoonPage />
  if (question.type === 'text') return <TextQuestion key={question.id} productId={productId} question={question} />

  // Lựa chọn đã lưu của mã truy cập (bỏ id không còn trong danh sách lựa chọn)
  const optionIds = new Set(question.options.map((option) => option.id))
  const initialSelectedIds = admin
    ? (adminAnswer ?? [])
    : getSavedSelection(productId, question.id).filter((id) => optionIds.has(id))

  return (
    // key: reset lựa chọn khi chuyển sang câu hỏi khác dùng cùng component; mã admin dựng lại khi tìm xong đáp án
    <Question.Root
      key={`${question.id}${adminAnswer ? ':dap-an' : ''}`}
      question={question}
      initialSelectedIds={initialSelectedIds}
      onSelectionChange={(ids) => saveSelection(productId, question.id, ids)}
      onAnswer={({ isCorrect, correctCount }) =>
        navigate(isCorrect ? question.next.correct : question.next.wrong, { state: { correctCount } })
      }
    >
      <title>{`${question.stage}: ${question.heading} · Kính Lúp`}</title>
      <Question.Title />
      <Question.Form>
        <Question.Prompt />
        <Question.Options density={question.options.length > 8 ? 'compact' : 'comfortable'}>
          {question.options.map((option) => (
            <Question.Option key={option.id} option={option} />
          ))}
        </Question.Options>
        <Question.Confirm />
      </Question.Form>
    </Question.Root>
  )
}
