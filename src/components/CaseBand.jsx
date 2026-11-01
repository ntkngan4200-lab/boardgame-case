// Dải title đỏ dùng chung cho mọi trang thuộc một giai đoạn
export function CaseBand({ titleId, stage, heading }) {
  return (
    <section className="case-band px-4 py-12 text-center sm:px-8 sm:py-16">
      <PaperClip />
      <MagnifierMark />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 id={titleId}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-sm bg-blush px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-maroon sm:text-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-maroon" />
            {stage}
          </span>
          <span className="sr-only">: </span>
          <span className="case-band__title block font-display text-cream">{heading}</span>
        </h1>
      </div>
    </section>
  )
}

function PaperClip() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 96"
      className="absolute -top-3 left-[6%] z-10 h-20 w-8 rotate-[-8deg] text-blush sm:left-[10%] sm:h-24 sm:w-10"
    >
      <path
        d="M27 18v52a9 9 0 0 1-18 0V14a6 6 0 0 1 12 0v52a3 3 0 0 1-6 0V22"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MagnifierMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className="absolute -right-10 top-1/2 h-56 w-56 -translate-y-1/2 text-blush opacity-[0.13] sm:right-[4%] sm:h-72 sm:w-72"
    >
      <circle cx="82" cy="82" r="56" fill="none" stroke="currentColor" strokeWidth="14" />
      <path d="M124 124l52 52" stroke="currentColor" strokeWidth="22" strokeLinecap="round" />
    </svg>
  )
}
