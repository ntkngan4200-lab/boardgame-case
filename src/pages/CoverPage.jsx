import { CoverStage } from '../components/CoverStage'
import { coverLayouts } from '../data/cover'

export function CoverPage() {
  return (
    <main className="cover-page mx-auto w-full max-w-[1600px] px-2 py-4 sm:px-6 sm:py-8">
      <title>Kính Lúp</title>
      {/* Hai bố cục riêng: ngang cho màn hình rộng, dọc cho điện thoại */}
      <CoverStage layout={coverLayouts.wide} className="hidden md:block" />
      <CoverStage layout={coverLayouts.tall} className="md:hidden" />
    </main>
  )
}
