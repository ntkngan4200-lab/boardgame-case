import { useEffect, useId, useRef, useState } from 'react'
import { saveSelection } from '../../lib/progress'
import { checkTextAnswer } from '../../lib/textAnswer'

// Khoá gợi ý bằng câu hỏi phụ: trả lời đúng mới mở nội dung gợi ý.
// gate = { id, label, phraseHashes, wrong }; đáp án hash như phraseHashes của ô điền, với fieldId = gate.id.
// Mở khoá được lưu theo mã truy cập ở khoá "<questionId>:<gate.id>".
export function hintGateKey(question, gate) {
  return `${question.id}:${gate.id}`
}

export function HintGate({ productId, question, gate, onUnlock }) {
  const inputId = useId()
  const messageId = useId()
  const [value, setValue] = useState('')
  const [result, setResult] = useState('idle')
  const [checking, setChecking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (checking) return
    const text = value.trim()
    if (!text) {
      setResult('missing')
      return
    }
    setChecking(true)
    try {
      const correct = await checkTextAnswer(question, gate, text)
      setResult(correct ? 'correct' : 'wrong')
      if (correct) {
        saveSelection(productId, hintGateKey(question, gate), [text])
        onUnlock()
      }
    } catch (error) {
      console.error('[Kính Lúp] Không kiểm tra được đáp án', error)
    } finally {
      setChecking(false)
    }
  }

  const message = { missing: 'Hãy điền đáp án trước khi xác nhận.', wrong: gate.wrong }[result]

  return (
    <form noValidate onSubmit={handleSubmit}>
      <span className="hint-note__label">Câu hỏi phụ để mở gợi ý</span>
      <label htmlFor={inputId} className="hint-note__text mt-2 block">
        {gate.label}
      </label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          id={inputId}
          className="code-input code-input--answer sm:!mx-0 sm:max-w-none sm:flex-1"
          placeholder="Nhập đáp án"
          autoComplete="off"
          spellCheck={false}
          maxLength={60}
          value={value}
          readOnly={checking}
          onChange={(event) => {
            setValue(event.target.value)
            setResult('idle')
          }}
          aria-invalid={result === 'wrong'}
          aria-describedby={messageId}
        />
        <button type="submit" className="confirm-button min-w-36 px-6" disabled={checking}>
          Mở gợi ý
        </button>
      </div>
      <p id={messageId} className="mt-3 min-h-5 text-sm font-semibold leading-relaxed text-maroon">
        {message ?? ''}
      </p>
    </form>
  )
}
