import { Link } from 'react-router-dom'
import { caseLinks, contact, socialLinks, supportLinks } from '../data/site'

function FootnoteColumn({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-tieu-de`} className="scroll-mt-6">
      <h2 id={`${id}-tieu-de`} className="footnote-heading">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-1.5">{children}</ul>
    </section>
  )
}

function SocialIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}

// Footnote: Vụ án · Hỗ trợ · Liên hệ, bên dưới là các mạng xã hội
export function SiteFootnote() {
  return (
    <footer className="site-footnote">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-12 sm:px-8 sm:pt-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          <FootnoteColumn id="vu-an-footnote" title="Vụ án">
            {caseLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="footnote-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </FootnoteColumn>
          <FootnoteColumn id="ho-tro" title="Hỗ trợ">
            {supportLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="footnote-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </FootnoteColumn>
          <FootnoteColumn id="lien-he" title="Liên hệ">
            <li className="footnote-text">
              Hotline:{' '}
              {contact.phone ? (
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="footnote-link">
                  {contact.phone}
                </a>
              ) : null}
            </li>
            <li className="footnote-text">
              Email:{' '}
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="footnote-link">
                  {contact.email}
                </a>
              ) : null}
            </li>
          </FootnoteColumn>
        </div>

        <div className="mt-12 border-t border-tan/20 pt-8">
          <ul className="flex flex-wrap items-center justify-center gap-3" aria-label="Mạng xã hội">
            {socialLinks.map((item) => (
              <li key={item.id}>
                {/* Chưa có link: hiện biểu tượng, chưa bấm được */}
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="social-link" aria-label={item.label}>
                    <SocialIcon icon={item.icon} />
                  </a>
                ) : (
                  <span className="social-link social-link--pending" role="img" aria-label={item.label} title={item.label}>
                    <SocialIcon icon={item.icon} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
