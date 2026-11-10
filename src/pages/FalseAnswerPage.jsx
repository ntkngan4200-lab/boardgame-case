import { Link, useLocation, useParams } from 'react-router-dom'
import { CaseBand } from '../components/CaseBand'
import { Hints } from '../components/hints/Hints'
import { getFalseAnswer } from '../data/product1'
import { ComingSoonPage } from './ComingSoonPage'

export function FalseAnswerPage() {
  const { productId, objectiveId, questionId } = useParams()
  const { state } = useLocation()
  const page = getFalseAnswer(productId, objectiveId, questionId)

  if (!page) return <ComingSoonPage />

  const { question, hints, backTo } = page
  const claim = page.claims ? (page.claims[state?.correctCount] ?? page.claims.default) : page.claim

  return (
    // key: reset số gợi ý đã mở khi sang False Answer Page của câu khác
    <Hints.Root key={question.id} hints={hints}>
      <title>{`${question.stage}: Chưa chính xác · Kính Lúp`}</title>
      <CaseBand stage={question.stage} heading={question.heading} />

      <section className="px-4 py-12 sm:px-8 sm:py-16">
        <div className="answer-sheet mx-auto max-w-3xl px-5 py-8 sm:px-12 sm:py-12">
          <p className="mx-auto max-w-2xl text-balance text-center text-xl font-bold leading-snug sm:text-2xl">
            {claim}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to={backTo} className="pill-button">
              Trở lại
            </Link>
            {hints.length > 0 ? <Hints.Trigger /> : null}
          </div>

          <div className="mx-auto max-w-2xl">
            <Hints.List />
          </div>
        </div>
      </section>
    </Hints.Root>
  )
}
