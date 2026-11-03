import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/home'

// Thanh tìm kiếm ở Header: chỉ tìm theo tên các vụ án đã ra mắt, chọn gợi ý → Access Page của vụ án
const cases = products.filter((product) => !product.comingSoon)

// Bỏ dấu để gõ "pham thuy chi" hay "Thuỳ" vẫn khớp "Phạm Thùy Chi"
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20 20" />
    </svg>
  )
}

export function CaseSearch() {
  const navigate = useNavigate()
  const id = useId()
  const listId = `${id}-list`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const keyword = normalize(query)
  const matches = keyword ? cases.filter((item) => normalize(item.title).includes(keyword)) : []
  const showList = open && keyword !== ''

  function choose(item) {
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    navigate(item.to)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    if ((event.key !== 'ArrowDown' && event.key !== 'ArrowUp') || matches.length === 0) return
    event.preventDefault()
    const step = event.key === 'ArrowDown' ? 1 : -1
    setOpen(true)
    setActiveIndex((index) => (index < 0 ? (step > 0 ? 0 : matches.length - 1) : (index + step + matches.length) % matches.length))
  }

  // Enter / nút kính lúp: mở vụ án đang chọn, hoặc vụ án khớp đầu tiên
  function handleSubmit(event) {
    event.preventDefault()
    const item = matches[activeIndex] ?? matches[0]
    if (item) choose(item)
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      className="site-search ml-auto"
    >
      <label htmlFor={`${id}-input`} className="sr-only">
        Tìm vụ án
      </label>
      <input
        id={`${id}-input`}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList && matches.length > 0}
        aria-controls={listId}
        aria-activedescendant={showList && activeIndex >= 0 ? `${id}-${activeIndex}` : undefined}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Bạn đang tìm vụ án nào?"
        autoComplete="off"
        className="site-search__input"
      />
      <button type="submit" className="site-search__button" aria-label="Tìm vụ án">
        <SearchIcon />
      </button>

      {/* Giữ focus ở ô nhập khi bấm gợi ý để danh sách không bị đóng trước khi chọn */}
      <ul
        id={listId}
        role="listbox"
        aria-label="Vụ án gợi ý"
        className="site-search__list"
        hidden={!showList || matches.length === 0}
        onMouseDown={(event) => event.preventDefault()}
      >
        {matches.map((item, index) => (
          <li
            key={item.id}
            id={`${id}-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            className="site-search__option"
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => choose(item)}
          >
            <img src={item.poster} alt="" width="40" height="40" />
            <span className="min-w-0">
              <span className="block font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-graphite">Vụ án</span>
              <span className="block truncate">{item.title}</span>
            </span>
          </li>
        ))}
      </ul>
      {showList && matches.length === 0 ? (
        <p className="site-search__list site-search__empty" role="status">
          Chưa có vụ án nào khớp với “{query.trim()}”.
        </p>
      ) : null}
    </form>
  )
}
