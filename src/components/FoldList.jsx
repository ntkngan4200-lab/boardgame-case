import { Fragment } from 'react'

// Nét cọ ngăn cách các mục (vẽ tay như reference)
function BrushDivider() {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 16" preserveAspectRatio="none" className="brush-divider">
      <path d="M3 10.6c58-3.3 132-4.7 214-5.2 96-.6 189-1.5 292-3.1 43-.7 85-1 128-.9l-.5 3.4c-52 1.4-109 2.7-171 3.7-101 1.6-196 2.6-286 3.9-61 .9-118 1.6-176 2.2z" />
      <path d="M48 13.6c96-1.4 214-2.6 352-4.1M470 7.4c52-.8 101-1.4 150-2" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9l7 7 7-7" />
    </svg>
  )
}

// Tờ giấy chứa các mục gập/mở (Hướng dẫn chơi, FAQ's): mỗi mục chỉ hiện nhãn + tiêu đề + mũi tên;
// bấm tiêu đề hoặc mũi tên để mở nội dung (không hiệu ứng)
export function FoldList({ items }) {
  return (
    <section className="px-4 pt-12 sm:px-8 sm:pt-16">
      <div className="answer-sheet mx-auto max-w-5xl px-5 py-4 sm:px-12 sm:py-8">
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index > 0 ? <BrushDivider /> : null}
            <details className="fold-item">
              <summary className="fold-item__summary">
                <h2 className="min-w-0">
                  <span className="fold-item__label">{item.label}</span>
                  <span className="sr-only">: </span>
                  <span className="fold-item__title">{item.title}</span>
                </h2>
                <span className="fold-item__chevron">
                  <ChevronIcon />
                </span>
              </summary>
              <div className="support-copy pb-8 pt-2 sm:pb-10">{item.body}</div>
            </details>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
