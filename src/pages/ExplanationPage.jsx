import { Link, useParams } from 'react-router-dom'
import { CaseBand } from '../components/CaseBand'
import { EvidenceWall } from '../components/EvidenceWall'
import { getExplanation } from '../data/product1'
import { ComingSoonPage } from './ComingSoonPage'

export function ExplanationPage() {
  const { productId, objectiveId } = useParams()
  const page = getExplanation(productId, objectiveId)

  if (!page) return <ComingSoonPage />

  return (
    <>
      <title>{`${page.stage}: Lời giải · Kính Lúp`}</title>
      <CaseBand stage={page.stage} heading={page.heading} />

      <section className="px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="answer-sheet mx-auto max-w-3xl px-5 py-6 sm:px-12 sm:py-8">
            <p className="text-balance text-center text-xl font-bold leading-snug sm:text-2xl">{page.conclusion}</p>
          </div>

          {page.wall ? <EvidenceWall wall={page.wall} note={page.note} className="mt-10 sm:mt-12" /> : null}

          <div className="answer-sheet mx-auto mt-10 max-w-3xl px-5 py-8 sm:mt-12 sm:px-12 sm:py-10">
            <p className="text-balance text-center text-xl font-bold leading-snug sm:text-2xl">{page.next.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to={page.backTo} className="pill-button">
                {page.backLabel ?? 'Trở lại'}
              </Link>
              {page.next.to ? (
                <Link to={page.next.to} className="pill-button">
                  {page.next.label}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
