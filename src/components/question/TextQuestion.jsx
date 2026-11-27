import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSavedSelection, saveSelection } from '../../lib/progress'
import { checkTextAnswer } from '../../lib/textAnswer'
import { CaseBand } from '../CaseBand'

// Đáp án đúng của ô được lưu theo mã truy cập, key "<questionId>:<fieldId>"
const savedKey = (question, field) => `${question.id}:${field.id}`

// Câu hỏi tự điền (type 'text'): các ô hiện lần lượt, ô sau chỉ hiện khi ô trước đã đúng.
// Sai thì báo ngay dưới ô (không sang trang Trả lời sai); đúng ô cuối thì sang câu tiếp theo.
// Quay lại câu này: các ô đã đúng hiện lại đáp án cũ và vẫn sửa được; bấm Xác nhận thì kiểm tra lại từ ô đầu.
export function TextQuestion({ productId, question }) {
  const navigate = useNavigate()
  const titleId = useId()
  const [values, setValues] = useState(() =>
    question.fields.map((field) => getSavedSelection(productId, savedKey(question, field))[0] ?? ''),
  )
  // Trạng thái từng ô: 'idle' | 'correct' | 'wrong' | 'missing'
  const [results, setResults] = useState(() => values.map((value) => (value ? 'correct' : 'idle')))
  const [checking, setChecking] = useState(false)
  const [focusIndex, setFocusIndex] = useState(null)
  const inputRefs = useRef([])
  // Hiện tới ô đầu tiên chưa đúng (các ô đã đúng phía trên vẫn hiện)
  const firstUnsolved = results.findIndex((result) => result !== 'correct')
  const [shownCount, setShownCount] = useState(firstUnsolved === -1 ? question.fields.length : firstUnsolved + 1)

  // Đưa focus vào ô vừa hiện ra hoặc ô sai (không tự focus khi mới mở trang để tránh bật bàn phím điện thoại)
  useEffect(() => {
    if (focusIndex != null) inputRefs.current[focusIndex]?.focus()
  }, [focusIndex, shownCount])

  async function handleSubmit(event) {
    event.preventDefault()
    if (checking) return
    setChecking(true)
    try {
      const next = [...results]
      // Kiểm tra lần lượt các ô đang hiện, dừng ở ô đầu tiên chưa đúng
      for (let index = 0; index < shownCount; index++) {
        const field = question.fields[index]
        const text = values[index].trim()
        const correct = text ? await checkTextAnswer(question, field, text) : false
        next[index] = correct ? 'correct' : text ? 'wrong' : 'missing'
        saveSelection(productId, savedKey(question, field), correct ? [text] : [])
        if (!correct) {
          setResults(next)
          setFocusIndex(index)
          return
        }
      }
      setResults(next)
      if (shownCount === question.fields.length) {
        navigate(question.next.correct)
        return
      }
      setShownCount(shownCount + 1)
      setFocusIndex(shownCount)
    } catch (error) {
      console.error('[Kính Lúp] Không kiểm tra được đáp án', error)
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <title>{`${question.stage}: ${question.heading} · Kính Lúp`}</title>
      <CaseBand titleId={titleId} stage={question.stage} heading={question.heading} />

      <section className="px-4 py-12 sm:px-8 sm:py-16">
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-labelledby={titleId}
          className="answer-sheet mx-auto max-w-3xl px-4 py-8 sm:px-10 sm:py-10"
        >
          {question.fields.slice(0, shownCount).map((field, index) => (
            <TextField
              key={field.id}
              field={field}
              index={index}
              inputRef={(element) => {
                inputRefs.current[index] = element
              }}
              value={values[index]}
              onChange={(value) => {
                setValues((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
                setResults((current) => current.map((item, itemIndex) => (itemIndex === index ? 'idle' : item)))
              }}
              result={results[index]}
              checking={checking}
            />
          ))}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-maroon/20 pt-6">
            <Link to={question.backTo} className="pill-button min-w-[7.5rem] px-5 sm:min-w-44 sm:px-8">
              Trở lại
            </Link>
            <button
              type="submit"
              className="confirm-button ml-auto min-w-[7.5rem] px-5 sm:min-w-40 sm:px-8"
              disabled={checking}
            >
              Xác nhận
            </button>
          </div>
        </form>

        {question.hint ? (
          <QuestionHint productId={productId} question={question} />
        ) : null}
      </section>
    </>
  )
}

// Ô "Gợi ý (1)" luôn hiện dưới câu hỏi: bấm vào hiện câu hỏi phụ, trả lời đúng mới mở nội dung gợi ý (lưu theo mã truy cập)
function QuestionHint({ productId, question }) {
  const { hint } = question
  const key = savedKey(question, hint)
  const panelId = useId()
  const inputId = useId()
  const messageId = useId()
  const [unlocked, setUnlocked] = useState(() => getSavedSelection(productId, key).length > 0)
  const [open, setOpen] = useState(unlocked)
  const [value, setValue] = useState('')
  const [result, setResult] = useState('idle')
  const [checking, setChecking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && !unlocked) inputRef.current?.focus()
  }, [open, unlocked])

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
      const correct = await checkTextAnswer(question, hint, text)
      setResult(correct ? 'correct' : 'wrong')
      if (correct) {
        saveSelection(productId, key, [text])
        setUnlocked(true)
      }
    } catch (error) {
      console.error('[Kính Lúp] Không kiểm tra được đáp án', error)
    } finally {
      setChecking(false)
    }
  }

  const message = { missing: 'Hãy điền đáp án trước khi xác nhận.', wrong: hint.wrong }[result]

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="flex justify-center">
        <button
          type="button"
          className="pill-button pill-button--light min-w-40 px-8"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          Gợi ý ({unlocked ? 0 : 1})
        </button>
      </div>

      {open ? (
        <div id={panelId} className="hint-note mt-6" aria-live="polite">
          {unlocked ? (
            <>
              <span className="hint-note__label">Gợi ý</span>
              <p className="hint-note__text">{hint.text}</p>
            </>
          ) : (
            <form noValidate onSubmit={handleSubmit}>
              <span className="hint-note__label">Câu hỏi phụ để mở gợi ý</span>
              <label htmlFor={inputId} className="hint-note__text mt-2 block">
                {hint.label}
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
          )}
        </div>
      ) : null}
    </div>
  )
}

function TextField({ field, index, inputRef, value, onChange, result, checking }) {
  const inputId = useId()
  const messageId = useId()
  const message = {
    correct: 'Chính xác!',
    missing: 'Hãy điền đáp án trước khi xác nhận.',
    wrong: field.wrong,
  }[result]

  return (
    <div className={index > 0 ? 'mt-6 border-t border-maroon/20 pt-8' : ''}>
      <h2 className="text-center font-display text-3xl tracking-wide text-maroon sm:text-4xl">
        <label htmlFor={inputId}>{field.label}</label>
      </h2>
      <input
        ref={inputRef}
        id={inputId}
        name={field.id}
        className="code-input code-input--answer mt-6"
        placeholder="Nhập đáp án"
        autoComplete="off"
        spellCheck={false}
        maxLength={120}
        value={value}
        readOnly={checking}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={result === 'wrong'}
        aria-describedby={messageId}
      />
      <p
        id={messageId}
        aria-live="polite"
        className="mx-auto mt-3 min-h-5 max-w-md text-balance text-center text-sm font-semibold leading-relaxed text-maroon"
      >
        {message ?? ''}
      </p>
    </div>
  )
}
