import { HintsProvider, useHints } from './HintsProvider'

function HintsTrigger() {
  const {
    state: { remaining },
    actions: { revealNext },
    meta: { listId },
  } = useHints()

  return (
    <button
      type="button"
      className="pill-button"
      onClick={revealNext}
      disabled={remaining === 0}
      aria-controls={listId}
    >
      Gợi ý ({remaining})
    </button>
  )
}

function HintsList() {
  const {
    state: { revealedCount },
    meta: { hints, listId },
  } = useHints()

  return (
    <ol id={listId} aria-live="polite" className="mt-8 flex flex-col gap-3 empty:hidden">
      {hints.slice(0, revealedCount).map((text, index) => (
        <li key={index} className="hint-note">
          <span className="hint-note__label">Gợi ý {index + 1}</span>
          {text ? (
            <p className="hint-note__text">{text}</p>
          ) : (
            // Chỗ trống chờ nội dung gợi ý
            <span className="hint-note__blank">
              <span className="sr-only">Chưa có nội dung</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

export const Hints = {
  Root: HintsProvider,
  Trigger: HintsTrigger,
  List: HintsList,
}
