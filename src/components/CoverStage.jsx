import { coverImages, pinSrc } from '../data/cover'

const MARKER = '#a8201a'

// Khung ảnh: tỉ lệ viền theo chiều rộng của phần tử
const FRAMES = {
  polaroid: { side: 0.055, top: 0.055, bottom: 0.2 },
  print: { side: 0.03, top: 0.03, bottom: 0.03 },
}

// PRNG có seed để nét vẽ tay không đổi giữa các lần render
function seeded(text) {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

function itemSize(item, stageWidth) {
  const image = coverImages[item.img]
  const ar = item.ar ?? image.ar
  const width = (item.w * stageWidth) / 100
  const frame = FRAMES[image.frame]
  if (!frame) return { width, height: width * ar }
  const inner = width * (1 - 2 * frame.side)
  return { width, height: width * (frame.top + frame.bottom) + inner * ar }
}

const fmt = (n) => Math.round(n * 10) / 10
const toPath = (points) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`).join(' ')

// Điểm thoát khỏi hình chữ nhật của ảnh, đi từ tâm theo hướng (ux, uy)
function exitDistance(size, ux, uy) {
  const tx = ux ? size.width / 2 / Math.abs(ux) : Infinity
  const ty = uy ? size.height / 2 / Math.abs(uy) : Infinity
  return Math.min(tx, ty)
}

function wobblyCurve(a, b, bend, rand, wobble) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(dx, dy)
  const nx = -dy / length
  const ny = dx / length
  const bendJitter = bend * (0.85 + rand() * 0.3)
  const c1 = [a[0] + dx * 0.33 + nx * bendJitter, a[1] + dy * 0.33 + ny * bendJitter]
  const c2 = [a[0] + dx * 0.68 + nx * bendJitter * 0.8, a[1] + dy * 0.68 + ny * bendJitter * 0.8]
  const steps = Math.max(18, Math.round(length / 14))
  const points = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const m = 1 - t
    const x = m ** 3 * a[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t ** 3 * b[0]
    const y = m ** 3 * a[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t ** 3 * b[1]
    // Run tay ít ở hai đầu, nhiều ở giữa nét
    const shake = Math.sin(t * Math.PI) * wobble
    points.push([x + nx * (rand() - 0.5) * shake, y + ny * (rand() - 0.5) * shake])
  }
  return { points, tail: c2 }
}

// Vòng tròn khoanh tay: hơn một vòng, bán kính lệch dần nên hai đầu không khép kín
function scribbleLoop(cx, cy, rx, ry, rand, turns = 1.14) {
  const start = rand() * Math.PI * 2
  const steps = 56
  const points = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = start + t * turns * Math.PI * 2
    const grow = 1 + (t - 0.5) * 0.14 + (rand() - 0.5) * 0.03
    points.push([cx + Math.cos(angle) * rx * grow, cy + Math.sin(angle) * ry * grow])
  }
  return toPath(points)
}

function Doodle({ doodle, items, sizes, ink }) {
  const rand = seeded(`${doodle.type}${doodle.x ?? doodle.around}${doodle.y ?? ''}`)
  if (doodle.type === 'circle') {
    const item = items.find((it) => it.id === doodle.around)
    const size = sizes[item.id]
    const d = scribbleLoop(
      (item.x * 1),
      item.y - size.height * 0.1,
      size.width / 2 + doodle.pad,
      size.height / 2 + doodle.pad,
      rand,
    )
    return <path d={d} strokeWidth={ink * 0.83} />
  }
  if (doodle.type === 'question') {
    const s = doodle.s * (ink / 4) * 1.6
    return (
      <g transform={`translate(${doodle.x} ${doodle.y}) rotate(${doodle.rot}) scale(${s})`} strokeWidth={(ink * 0.83) / s}>
        <path d="M-16 -22 C-18 -44 18 -46 17 -22 C16 -6 0 -6 0 10" />
        <path d="M0 26 L0.8 27" strokeWidth={((ink * 0.83) / s) * 2.2} />
      </g>
    )
  }
  if (doodle.type === 'sparkle') {
    const s = doodle.s * (ink / 4) * 1.6
    return (
      <g transform={`translate(${doodle.x} ${doodle.y}) scale(${s})`} strokeWidth={(ink * 0.83) / s}>
        <path d="M0 -20 L1 20" />
        <path d="M-17 1 L17 -1" />
        <path d="M-10 -11 L9 10" />
        <path d="M9 -10 L-9 11" />
      </g>
    )
  }
  // underline: một nét gạch tay lệch nhẹ, quét hai lần
  const half = doodle.len / 2
  const first = wobblyCurve([doodle.x - half, doodle.y], [doodle.x + half, doodle.y - 5], 5, rand, 2.5)
  const second = wobblyCurve([doodle.x - half * 0.7, doodle.y + 8], [doodle.x + half * 0.9, doodle.y + 4], -4, rand, 2.5)
  return (
    <g strokeWidth={ink * 0.83}>
      <path d={toPath(first.points)} />
      <path d={toPath(second.points)} strokeWidth={ink * 0.57} opacity="0.75" />
    </g>
  )
}

function Line({ line, byId, sizes, ink }) {
  const rand = seeded(`${line.from}>${line.to}`)
  const A = byId[line.from]
  const B = byId[line.to]
  const dx = B.x - A.x
  const dy = B.y - A.y
  const length = Math.hypot(dx, dy)
  const ux = dx / length
  const uy = dy / length
  // Nét bắt đầu và kết thúc ngay trong mép ảnh, như bút lướt từ tấm này sang tấm kia
  const startPad = exitDistance(sizes[A.id], ux, uy) * 0.82
  const endPad = exitDistance(sizes[B.id], ux, uy) * 0.82
  const start = [A.x + ux * startPad, A.y + uy * startPad]
  const end = [B.x - ux * endPad, B.y - uy * endPad]
  const sw = ink

  const main = wobblyCurve(start, end, line.bend, rand, sw * 1.1)
  const echo = wobblyCurve(
    [start[0] + (rand() - 0.5) * 5, start[1] + (rand() - 0.5) * 5],
    [end[0] + (rand() - 0.5) * 5, end[1] + (rand() - 0.5) * 5],
    line.bend * 1.08,
    rand,
    sw * 1.4,
  )

  // Đầu mũi tên: hai nét ngắn xoè về phía sau theo hướng đi cuối đường cong
  const tip = main.points.at(-1)
  const prev = main.points.at(-4)
  const heading = Math.atan2(tip[1] - prev[1], tip[0] - prev[0])
  const arm = ink * 5.7
  const arrow = [0.5, -0.5].map((spread) => {
    const angle = heading + Math.PI + spread
    return `M${fmt(tip[0])} ${fmt(tip[1])} L${fmt(tip[0] + Math.cos(angle) * arm)} ${fmt(tip[1] + Math.sin(angle) * arm)}`
  })

  return (
    <g>
      <path d={toPath(main.points)} strokeWidth={sw} />
      <path d={toPath(echo.points)} strokeWidth={sw * 0.5} opacity="0.65" />
      <path d={scribbleLoop(start[0], start[1], ink * 2.67, ink * 2.67, rand, 1.3)} strokeWidth={sw * 0.8} />
      {line.arrow ? arrow.map((d) => <path key={d} d={d} strokeWidth={sw} />) : null}
    </g>
  )
}

function Item({ item, stage }) {
  const image = coverImages[item.img]
  const frame = FRAMES[image.frame]
  const style = {
    left: `${(item.x / stage.w) * 100}%`,
    top: `${(item.y / stage.h) * 100}%`,
    width: `${item.w}%`,
    rotate: `${item.rot}deg`,
  }
  const padding = frame
    ? `${item.w * frame.top}cqw ${item.w * frame.side}cqw ${item.w * frame.bottom}cqw`
    : undefined
  return (
    <div
      className={`cover-item${frame ? ' cover-item--framed' : ''}`}
      style={{ ...style, padding }}
    >
      <img
        src={image.src}
        alt=""
        draggable="false"
        className="block w-full"
        style={item.ar ? { aspectRatio: `1 / ${item.ar}`, objectFit: 'cover', objectPosition: item.pos } : undefined}
      />
      {item.pin ? <img src={pinSrc} alt="" draggable="false" className="cover-pin" /> : null}
    </div>
  )
}

export function CoverStage({ layout, className = '' }) {
  const sizes = {}
  const byId = {}
  for (const item of layout.items) {
    sizes[item.id] = itemSize(item, layout.w)
    byId[item.id] = item
  }
  const pct = (value, total) => `${(value / total) * 100}%`
  const tall = layout.w < layout.h

  return (
    <div
      className={`cover-stage ${className}`}
      style={{ aspectRatio: `${layout.w} / ${layout.h}` }}
    >
      {layout.items.map((item) => (
        <Item key={item.id} item={item} stage={layout} />
      ))}

      <svg
        viewBox={`0 0 ${layout.w} ${layout.h}`}
        className="cover-marker"
        fill="none"
        stroke={MARKER}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {layout.lines.map((line) => (
          <Line key={`${line.from}${line.to}`} line={line} byId={byId} sizes={sizes} ink={layout.ink} />
        ))}
        {layout.doodles.map((doodle) => (
          <Doodle
            key={`${doodle.type}${doodle.x ?? doodle.around}${doodle.y ?? ''}`}
            doodle={doodle}
            items={layout.items}
            sizes={sizes}
            ink={layout.ink}
          />
        ))}
      </svg>

      <h1
        className="cover-logo font-display"
        style={{
          left: pct(layout.logo.x, layout.w),
          top: pct(layout.logo.y, layout.h),
          fontSize: tall ? '17cqw' : '8.6cqw',
        }}
      >
        <span className="cover-logo__line">Kính</span>
        <span className="cover-logo__line cover-logo__line--second">Lúp</span>
      </h1>

      <p
        className="cover-tagline font-mono"
        style={{
          left: pct(layout.logo.tagline.x, layout.w),
          top: pct(layout.logo.tagline.y, layout.h),
          fontSize: tall ? '3.1cqw' : '1.5cqw',
        }}
      >
        Insight starts in sight
      </p>
    </div>
  )
}
