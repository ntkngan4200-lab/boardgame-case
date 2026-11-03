import { useId, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/brand/logo-kinh-lup.webp'
import { navLinks } from '../data/site'
import { CaseSearch } from './CaseSearch'

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

// Mục có menu con (Hỗ trợ): mở khi rê chuột, khi bấm (màn hình cảm ứng) hoặc khi dùng phím Tab
function NavDropdown({ item, onNavigate }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  return (
    <li
      className="nav-dropdown"
      data-open={open ? 'true' : undefined}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        type="button"
        className="nav-link"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {item.label}
        <ChevronIcon />
      </button>
      <ul id={menuId} className="nav-dropdown__menu">
        {item.children.map((child) => (
          <li key={child.to}>
            <Link
              to={child.to}
              className="nav-dropdown__link"
              onClick={() => {
                setOpen(false)
                onNavigate()
              }}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

function NavItems({ onNavigate }) {
  return navLinks.map((item) => {
    if (item.children) return <NavDropdown key={item.label} item={item} onNavigate={onNavigate} />
    return (
      <li key={item.label}>
        {item.to ? (
          <NavLink to={item.to} end className="nav-link" onClick={onNavigate}>
            {item.label}
          </NavLink>
        ) : (
          <a href={item.href} className="nav-link" onClick={onNavigate}>
            {item.label}
          </a>
        )}
      </li>
    )
  })
}

// Header: Logo bên trái; dồn sang phải: Thanh tìm kiếm · Trang chủ, Về chúng tôi, Hỗ trợ (menu con), Liên hệ
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const panelId = useId()
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 sm:gap-6 sm:px-8">
        {/* Bấm logo khi đang ở Trang chủ (đã cuộn xuống) cũng đưa về đầu trang */}
        <Link
          to="/"
          className="shrink-0"
          aria-label="Kính Lúp – Trang chủ"
          onClick={() => {
            closeMenu()
            window.scrollTo(0, 0)
          }}
        >
          <img src={logo} alt="" width="289" height="200" className="h-12 w-auto sm:h-14" />
        </Link>
        <CaseSearch />
        <nav aria-label="Thanh công cụ" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <NavItems onNavigate={closeMenu} />
          </ul>
        </nav>
        <button
          type="button"
          className="menu-toggle lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={panelId}
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
      {/* Menu trên điện thoại / máy tính bảng */}
      <nav id={panelId} aria-label="Thanh công cụ" className="mobile-nav lg:hidden" hidden={!menuOpen}>
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-8">
          <NavItems onNavigate={closeMenu} />
        </ul>
      </nav>
    </header>
  )
}
