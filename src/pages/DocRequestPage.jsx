import { useId, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import mascot from '../assets/brand/mascot-doi.png'
import { CaseBand } from '../components/CaseBand'
import { Question } from '../components/question/Question'
import { useQuestion } from '../components/question/QuestionProvider'
import { getDocRequestCase } from '../data/support'
import { callBackend } from '../lib/backend'
import { ComingSoonPage } from './ComingSoonPage'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function DocRequestPage() {
  const { productId } = useParams()
  const request = getDocRequestCase(productId)

  if (!request) return <ComingSoonPage />

  // key: xoá email + lựa chọn khi chuyển sang vụ án khác
  return <DocRequestContent key={request.productId} request={request} />
}

function DocRequestContent({ request }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')
  const { question } = request

  async function handleAnswer({ optionIds }) {
    const documents = question.options.filter((option) => optionIds.includes(option.id))
    setSendError('')
    try {
      await callBackend('doc-request', {
        productId: request.productId,
        caseTitle: request.title,
        email: email.trim(),
        documents: documents.map(({ id, label }) => ({ id, label })),
      })
    } catch (error) {
      setSendError('Chưa gửi được yêu cầu. Bạn thử lại sau ít phút hoặc nhắn trực tiếp cho Kính Lúp nhé.')
      throw error
    }
    setSent(true)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <title>{`Bổ sung hồ sơ · ${request.title} · Kính Lúp`}</title>
      <CaseBand stage={request.title} heading="HỖ TRỢ CUNG CẤP HỒ SƠ BỊ THIẾU/HƯ HỎNG" />
      {sent ? (
        <RequestSent />
      ) : (
        <Question.Root question={question} onAnswer={handleAnswer}>
          <DocRequestForm email={email} onEmailChange={setEmail} sendError={sendError}>
            <Question.Options density="compact">
              {question.options.map((option) => (
                <Question.Option key={option.id} option={option} />
              ))}
            </Question.Options>
            <Question.Confirm>
              <Question.SelectedCount />
            </Question.Confirm>
          </DocRequestForm>
        </Question.Root>
      )}
    </>
  )
}

// Phiếu yêu cầu: ô Email (cùng kiểu ô Mã truy cập) ở đầu, rồi danh mục hồ sơ như trang câu hỏi
function DocRequestForm({ email, onEmailChange, sendError, children }) {
  const {
    state: { selectedIds },
    actions: { submit },
    meta: { minPick, titleId },
  } = useQuestion()
  const emailId = useId()
  const emailMessageId = useId()
  const emailRef = useRef(null)
  const [emailError, setEmailError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const value = email.trim()
    if (!value || !EMAIL_PATTERN.test(value)) {
      setEmailError(value ? 'Email chưa đúng định dạng, ví dụ: ten@gmail.com' : 'Hãy nhập email để Kính Lúp gửi hồ sơ cho bạn.')
      emailRef.current.focus()
      return
    }
    if (selectedIds.length < minPick) event.currentTarget.querySelector('.option-input')?.focus()
    submit()
  }

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <form noValidate onSubmit={handleSubmit} className="answer-sheet mx-auto max-w-3xl px-2 py-6 sm:px-10 sm:py-10">
        <div className="border-b border-maroon/20 px-2 pb-8">
          <h2 className="text-center font-display text-3xl tracking-wide text-maroon sm:text-4xl">
            <label htmlFor={emailId}>Email</label>
          </h2>
          <input
            ref={emailRef}
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="ten@gmail.com"
            className="code-input code-input--email mt-6"
            value={email}
            onChange={(event) => {
              onEmailChange(event.target.value)
              if (emailError) setEmailError('')
            }}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailMessageId}
          />
          <p id={emailMessageId} aria-live="polite" className="mt-3 min-h-5 text-center text-sm font-semibold text-maroon">
            {emailError}
          </p>
        </div>

        <p id={titleId} className="mx-auto mb-8 mt-8 max-w-2xl text-balance text-center text-xl font-bold leading-snug sm:text-2xl">
          Bạn cần Kính Lúp bổ sung hồ sơ nào?
        </p>
        {children}
        {sendError ? (
          <p role="alert" className="mt-4 text-center text-sm font-semibold text-maroon">
            {sendError}
          </p>
        ) : null}
      </form>
    </section>
  )
}

// Trang thông báo sau khi gửi yêu cầu
function RequestSent() {
  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16">
      <div className="answer-sheet mx-auto max-w-2xl px-6 py-10 text-center sm:px-12 sm:py-14">
        {/* Mascot hàng 3, cột 5 trong "Bảng 25 tư thế mascot đáng yêu" */}
        <img src={mascot} alt="" width="161" height="204" className="mx-auto h-28 w-auto sm:h-32" />
        <h2 className="mt-6 text-balance font-display text-3xl leading-tight tracking-wide text-maroon sm:text-4xl">
          Hãy đợi Kính Lúp một chút nha.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-lg leading-relaxed sm:text-xl">
          Kính Lúp sẽ phản hồi sớm nhất có thể.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/ho-tro/ho-so" className="pill-button min-w-[9rem] px-6">
            Trở lại
          </Link>
          <Link to="/" className="confirm-button inline-flex min-w-[9rem] items-center justify-center px-6">
            Về trang chủ
          </Link>
        </div>
      </div>
    </section>
  )
}
