import { useNavigate, useParams } from 'react-router-dom'
import { Question } from '../components/question/Question'
import { getQuestion } from '../data/product1'
import { ComingSoonPage } from './ComingSoonPage'

export function QuestionPage() {
  const { productId, objectiveId, questionId } = useParams()
  const navigate = useNavigate()
  const question = getQuestion(productId, objectiveId, questionId)

  if (!question) return <ComingSoonPage />

  return (
    // key: reset lựa chọn khi chuyển sang câu hỏi khác dùng cùng component
    <Question.Root
      key={question.id}
      question={question}
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
