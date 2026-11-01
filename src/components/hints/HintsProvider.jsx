import { createContext, use, useId, useState } from 'react'

const HintsContext = createContext(null)

export function HintsProvider({ hints, children }) {
  const listId = useId()
  const [revealedCount, setRevealedCount] = useState(0)

  // Mỗi lần bấm mở thêm đúng 1 gợi ý
  function revealNext() {
    setRevealedCount((count) => Math.min(count + 1, hints.length))
  }

  const value = {
    state: { revealedCount, remaining: hints.length - revealedCount },
    actions: { revealNext },
    meta: { hints, listId },
  }

  return <HintsContext value={value}>{children}</HintsContext>
}

export function useHints() {
  const context = use(HintsContext)
  if (!context) throw new Error('useHints phải nằm trong <Hints.Root>')
  return context
}
