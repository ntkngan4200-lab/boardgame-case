import { Outlet } from 'react-router-dom'
import { SiteFootnote } from '../components/SiteFootnote'
import { SiteHeader } from '../components/SiteHeader'

export function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-maroon"
      >
        Bỏ qua tới nội dung chính
      </a>
      <SiteHeader />
      <main id="noi-dung" className="flex-1">
        <Outlet />
      </main>
      <SiteFootnote />
    </div>
  )
}
