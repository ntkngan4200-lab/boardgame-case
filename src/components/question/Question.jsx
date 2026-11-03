import { useId } from 'react'
import { Link } from 'react-router-dom'
import { CaseBand } from '../CaseBand'
import { QuestionProvider, useQuestion } from './QuestionProvider'

function QuestionTitle() {
  const {
    meta: { question, titleId },
  } = useQuestion()

  return <CaseBand titleId={titleId} stage={question.stage} heading={question.heading} />
}

function QuestionForm({ children }) {
  const {
    state: { selectedIds },
    actions: { submit },
    meta: { pick },
  } = useQuestion()

  function handleSubmit(event) {
    event.preventDefault()
    // Chưa chọn đủ: đưa focus về ô chưa chọn đầu tiên để người chơi chọn tiếp
    if (selectedIds.length < pick) event.currentTarget.querySelector('.option-input:not(:checked)')?.focus()
    submit()
  }

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <form noValidate onSubmit={handleSubmit} className="answer-sheet mx-auto max-w-3xl px-2 py-6 sm:px-10 sm:py-10">
        {children}
      </form>
    </section>
  )
}

// Câu dẫn bên trên danh sách lựa chọn (chỉ hiện khi câu hỏi có prompt)
function QuestionPrompt() {
  const {
    meta: { question },
  } = useQuestion()

  if (!question.prompt) return null

  return (
    <p className="mx-auto mb-8 max-w-2xl text-balance text-center text-xl font-bold leading-snug sm:text-2xl">
      {question.prompt}
    </p>
  )
}

// density: 'comfortable' cho vài lựa chọn ngắn, 'compact' cho danh mục dài
function QuestionOptions({ density = 'comfortable', children }) {
  const {
    meta: { pick, titleId },
  } = useQuestion()

  return (
    <div
      role={pick === 1 ? 'radiogroup' : 'group'}
      aria-labelledby={titleId}
      className={`option-list option-list--${density} flex flex-col gap-1`}
    >
      {children}
    </div>
  )
}

function QuestionOption({ option }) {
  const {
    state: { selectedIds, status },
    actions: { toggle },
    meta: { question, pick },
  } = useQuestion()
  const isSelected = selectedIds.includes(option.id)

  return (
    <label className="option-row">
      <input
        type={pick === 1 ? 'radio' : 'checkbox'}
        name={question.id}
        value={option.id}
        checked={isSelected}
        disabled={status === 'checking'}
        onChange={() => toggle(option.id)}
        className="option-input sr-only"
      />
      <span className="option-box" aria-hidden="true">
        {isSelected ? <CrossMark /> : null}
      </span>
      <span className="option-label">{option.label}</span>
    </label>
  )
}

function QuestionConfirm() {
  const {
    state: { selectedIds, status },
    meta: { question, pick, minPick },
  } = useQuestion()
  const messageId = useId()
  const isChecking = status === 'checking'
  const unit = question.pickUnit ?? (pick === 1 ? 'một lựa chọn' : `đủ ${pick} hồ sơ`)

  return (
    <div className="mt-6 border-t border-maroon/20 pt-6">
      {/* Trạng thái nằm trên hàng nút để hai nút luôn cùng một hàng, kể cả màn hình hẹp */}
      <div className="flex flex-wrap items-baseline justify-center gap-x-4">
        {pick > 1 ? (
          <p className="mb-3 w-full text-center font-mono text-sm font-bold tabular-nums text-graphite">
            Đã chọn {selectedIds.length}/{pick}
          </p>
        ) : null}
        <p
          id={messageId}
          aria-live="polite"
          className="mb-3 w-full text-center text-sm font-semibold text-maroon empty:hidden"
        >
          {status === 'missing' ? `Hãy chọn ${unit} trước khi xác nhận.` : ''}
          {status === 'limit'
            ? `Chỉ được chọn ${minPick < pick ? 'tối đa ' : ''}${pick} hồ sơ. Bỏ dấu X ở một ô trước khi chọn ô khác.`
            : ''}
          {isChecking ? 'Đang kiểm tra…' : ''}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        {question.backTo ? (
          <Link to={question.backTo} className="pill-button min-w-[7.5rem] px-5 sm:min-w-44 sm:px-8">
            Trở lại
          </Link>
        ) : null}
        <button
          type="submit"
          className="confirm-button ml-auto min-w-[7.5rem] px-5 sm:min-w-40 sm:px-8"
          disabled={isChecking}
          aria-describedby={messageId}
        >
          Xác nhận
        </button>
      </div>
    </div>
  )
}

// Dấu X viết tay — nét chính + một nét mực mờ lệch nhẹ cho cảm giác bút thật
function CrossMark() {
  return (
    <svg className="option-mark" viewBox="0 0 40 40" fill="none" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6.5C14 13.5 23.5 22.5 34.5 34" stroke="currentColor" strokeWidth="4" />
      <path d="M33.5 5.5C25 14 15.5 23.5 5.5 35" stroke="currentColor" strokeWidth="4.4" />
      <path d="M7.5 6C15.5 13.5 24 22 33 32.5" stroke="#000" strokeWidth="1.4" opacity=".3" />
      <path d="M32 6.5C24 15 16 23.5 7 33.5" stroke="#000" strokeWidth="1.4" opacity=".3" />
    </svg>
  )
}

export const Question = {
  Root: QuestionProvider,
  Title: QuestionTitle,
  Form: QuestionForm,
  Prompt: QuestionPrompt,
  Options: QuestionOptions,
  Option: QuestionOption,
  Confirm: QuestionConfirm,
}
