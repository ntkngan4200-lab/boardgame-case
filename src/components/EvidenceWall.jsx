import { useId } from 'react'

// Bức tường bằng chứng: ảnh/tài liệu ghim trên bảng, khoanh đỏ chi tiết, phóng to bằng kính lúp và nối bằng dây chỉ đỏ.
// Toạ độ chi tiết (mark) tính theo tỉ lệ ảnh (u = x / rộng, v = y / cao) nên đổi bố cục không phải đo lại.
const RED = '#a8201a'
const FRAMES = {
  polaroid: { side: 12, top: 12, bottom: 46, captionAlign: 'middle' },
  // Chú thích bản tin canh trái để dây đỏ đi xuống không cắt qua chữ
  clipping: { side: 10, top: 10, bottom: 42, captionAlign: 'start' },
}

export function EvidenceWall({ wall, note, className = '' }) {
  return (
    <figure className={`evidence-wall ${className}`}>
      {/* Ngang cho màn hình rộng, dọc cho điện thoại */}
      <WallBoard wall={wall} layout={wall.layouts.wide} className="hidden md:block" />
      <WallBoard wall={wall} layout={wall.layouts.tall} className="md:hidden" />
      <figcaption className="sr-only">{wall.description}</figcaption>
      {note ? <WallNote note={note} /> : null}
    </figure>
  )
}

// Tờ ghi chú giải thích ghim ngay trên bảng, dưới các bằng chứng
function WallNote({ note }) {
  return (
    <div className="px-4 pb-8 pt-2 sm:px-8 sm:pb-10">
      <div className="wall-note mx-auto max-w-3xl px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-9">
        <span aria-hidden="true" className="wall-note__pin" />
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-graphite">{note.label}</p>
        <p className="mt-2 text-pretty text-base font-semibold leading-relaxed sm:text-lg">{note.text}</p>
      </div>
    </div>
  )
}

function WallBoard({ wall, layout, className }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const items = wall.items.map((item) => placeItem(item, layout))
  const lenses = new Map(items.flatMap((item) => item.marks.map((mark) => [mark.id, mark.globalLens])))

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" className="block h-auto w-full">
        <defs>
          <filter id={`${uid}-felt`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={`${uid}-lift`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000" floodOpacity=".5" />
          </filter>
          {/* Sợi chỉ xù nhẹ: nhiễu làm lệch mép nét vẽ. userSpaceOnUse vì đường thẳng ngang có bounding box cao 0 */}
          <filter id={`${uid}-thread`} filterUnits="userSpaceOnUse" x="0" y="0" width={layout.width} height={layout.height}>
            <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id={`${uid}-light`} cx="50%" cy="38%" r="70%">
            <stop offset="0" stopColor="#fff" stopOpacity=".1" />
            <stop offset="1" stopColor="#000" stopOpacity=".35" />
          </radialGradient>
        </defs>

        {/* Mặt bảng nỉ xám rêu */}
        <rect width={layout.width} height={layout.height} style={{ fill: 'rgb(var(--sage))' }} />
        <rect width={layout.width} height={layout.height} fill="#000" opacity=".35" filter={`url(#${uid}-felt)`} />
        <rect width={layout.width} height={layout.height} fill={`url(#${uid}-light)`} />

        {items.map((item) => (
          <g key={item.id} transform={item.transform}>
            <rect
              x={item.frameX}
              y={item.frameY}
              width={item.frameW}
              height={item.frameH}
              rx="2"
              style={{ fill: 'rgb(var(--cream))' }}
              filter={`url(#${uid}-lift)`}
            />
            <image
              href={item.src}
              x={item.x}
              y={item.y}
              width={item.w}
              height={item.h}
              preserveAspectRatio="xMidYMid slice"
            />
            <rect x={item.x} y={item.y} width={item.w} height={item.h} fill="none" stroke="#000" strokeOpacity=".15" />
            <text
              x={item.frame.captionAlign === 'start' ? item.x + 4 : item.cx}
              y={item.y + item.h + item.frame.bottom / 2 + layout.captionSize * 0.36}
              textAnchor={item.frame.captionAlign}
              fontFamily="'Be Vietnam Pro', sans-serif"
              fontWeight="700"
              fontSize={layout.captionSize}
              style={{ fill: 'rgb(var(--maroon))' }}
            >
              {item.caption}
            </text>
            {item.frameType === 'clipping' ? <ClippingTape item={item} /> : null}
          </g>
        ))}

        {/* Khoanh đỏ + kính lúp, vẽ sau cùng để không bị ảnh khác đè */}
        {items.map((item) => (
          <g key={item.id} transform={item.transform}>
            {item.marks.map((mark) => (
              <g key={mark.id}>
                {/* circle: false — không khoanh, chỉ giữ điểm ghim dây cạnh chi tiết */}
                {mark.circle === false ? null : (
                  <path
                    d={scribbleCircle(mark.x, mark.y, mark.r, mark.seed)}
                    fill="none"
                    stroke={RED}
                    strokeWidth={layout.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {mark.lens ? <Magnifier uid={uid} item={item} mark={mark} /> : null}
              </g>
            ))}
          </g>
        ))}

        {/* Chỉ đỏ nối các chi tiết đã phóng to */}
        {wall.strings.map(([fromId, toId]) => {
          const string = stringPath(lenses.get(fromId), lenses.get(toId))
          return (
            <g key={`${fromId}-${toId}`}>
              <path d={string.d} fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="2.6" transform="translate(0 4)" />
              <g filter={`url(#${uid}-thread)`} fill="none" strokeLinecap="round">
                <path d={string.d} stroke={RED} strokeWidth="2.4" />
                {/* Vân xoắn của sợi chỉ: nét sáng và nét tối ngắt quãng, lệch pha nhau */}
                <path d={string.d} stroke="#e48b80" strokeWidth="1" strokeOpacity=".7" strokeDasharray="2 3.5" />
                <path d={string.d} stroke="#4a0b08" strokeWidth="1" strokeOpacity=".55" strokeDasharray="1.5 4" strokeDashoffset="2.5" />
              </g>
              <Pin x={string.start[0]} y={string.start[1]} r={5} />
              <Pin x={string.end[0]} y={string.end[1]} r={5} />
            </g>
          )
        })}

        {/* Ghim giữ ảnh */}
        {items
          .filter((item) => item.frameType === 'polaroid')
          .map((item) => {
            const [x, y] = rotatePoint(item.cx, item.frameY + 14, item)
            return <Pin key={item.id} x={x} y={y} r={10} />
          })}
      </svg>
    </div>
  )
}

// Kính lúp đặt cạnh chi tiết: thấu kính hiển thị ảnh phóng to quanh chiếc nhẫn, cán hướng ra xa chi tiết
function Magnifier({ uid, item, mark }) {
  const { lens } = mark
  const clipId = `${uid}-lens-${mark.id}`
  // Cán hướng ra xa chi tiết, hoặc theo handleAngle khi cần tránh sợi dây / chú thích
  const rad = (lens.handleAngle * Math.PI) / 180
  const dir = [Math.cos(rad), Math.sin(rad)]
  const handleStart = [lens.x + dir[0] * (lens.r - 2), lens.y + dir[1] * (lens.r - 2)]
  const handleEnd = [lens.x + dir[0] * (lens.r * 1.95), lens.y + dir[1] * (lens.r * 1.95)]

  return (
    <g>
      <clipPath id={clipId}>
        <circle cx={lens.x} cy={lens.y} r={lens.r} />
      </clipPath>
      {/* Viền sáng quanh cán để vẫn nhìn rõ khi nằm trên ảnh tối */}
      <line
        x1={handleStart[0]}
        y1={handleStart[1]}
        x2={handleEnd[0]}
        y2={handleEnd[1]}
        strokeWidth={lens.r * 0.3}
        strokeLinecap="round"
        style={{ stroke: 'rgb(var(--blush))' }}
      />
      <line
        x1={handleStart[0]}
        y1={handleStart[1]}
        x2={handleEnd[0]}
        y2={handleEnd[1]}
        stroke="#2a1617"
        strokeWidth={lens.r * 0.2}
        strokeLinecap="round"
      />
      <circle cx={lens.x + 2} cy={lens.y + 6} r={lens.r + 3} fill="#000" opacity=".4" />
      <circle cx={lens.x} cy={lens.y} r={lens.r} fill="#000" />
      <image
        href={item.src}
        x={lens.x - mark.u * item.w * lens.zoom}
        y={lens.y - mark.v * item.h * lens.zoom}
        width={item.w * lens.zoom}
        height={item.h * lens.zoom}
        preserveAspectRatio="none"
        clipPath={`url(#${clipId})`}
      />
      <circle cx={lens.x} cy={lens.y} r={lens.r} fill="#fff" opacity=".07" />
      <circle
        cx={lens.x}
        cy={lens.y}
        r={lens.r}
        fill="none"
        strokeWidth={lens.r * 0.12}
        style={{ stroke: 'rgb(var(--blush))' }}
      />
      <circle cx={lens.x} cy={lens.y} r={lens.r * 0.93} fill="none" stroke="#000" strokeOpacity=".3" strokeWidth="1" />
    </g>
  )
}

function ClippingTape({ item }) {
  const tape = { width: 78, height: 26 }
  return [
    [item.frameX + 8, item.frameY - 2, -32],
    [item.frameX + item.frameW - 8, item.frameY - 2, 32],
  ].map(([x, y, angle]) => (
    <rect
      key={angle}
      x={x - tape.width / 2}
      y={y - tape.height / 2}
      width={tape.width}
      height={tape.height}
      style={{ fill: 'rgb(var(--blush))' }}
      opacity=".82"
      transform={`rotate(${angle} ${x} ${y})`}
    />
  ))
}

function Pin({ x, y, r }) {
  return (
    <g>
      <circle cx={x + r * 0.25} cy={y + r * 0.45} r={r} fill="#000" opacity=".35" />
      <circle cx={x} cy={y} r={r} fill={RED} />
      <circle cx={x - r * 0.32} cy={y - r * 0.32} r={r * 0.34} fill="#fff" opacity=".45" />
    </g>
  )
}

// Tính khung, tâm xoay, vị trí khoanh đỏ và kính lúp của một tài liệu trong bố cục (toạ độ cục bộ theo tài liệu)
function placeItem(item, layout) {
  const place = layout.place[item.id]
  const frame = FRAMES[item.frame]
  const w = place.w
  const h = w / item.ratio
  const placed = {
    ...item,
    frameType: item.frame,
    frame,
    rotate: place.rotate,
    x: place.x,
    y: place.y,
    w,
    h,
    frameX: place.x - frame.side,
    frameY: place.y - frame.top,
    frameW: w + frame.side * 2,
    frameH: h + frame.top + frame.bottom,
  }
  placed.cx = placed.frameX + placed.frameW / 2
  placed.cy = placed.frameY + placed.frameH / 2
  placed.transform = `rotate(${place.rotate} ${placed.cx} ${placed.cy})`
  // place.marks[id] cho phép bố cục đổi hướng kính lúp riêng (vd. lensAngle khác giữa wide và tall)
  placed.marks = item.marks.map((baseMark, index) => {
    const mark = { ...baseMark, ...place.marks?.[baseMark.id] }
    const x = place.x + mark.u * w
    const y = place.y + mark.v * h
    const r = Math.max(mark.r * w, layout.minMarkRadius)
    // Không có lensAngle: chi tiết đủ rõ, dây nối thẳng vào vòng khoanh
    if (mark.lensAngle === undefined) {
      const [gx, gy] = rotatePoint(x, y, placed)
      return { id: mark.id, x, y, r, circle: mark.circle, lens: null, seed: index + w, globalLens: { x: gx, y: gy, r } }
    }
    const lensR = layout.lensRadius
    const angle = (mark.lensAngle * Math.PI) / 180
    const distance = r + lensR + layout.lensGap
    const lens = {
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      r: lensR,
      angle: mark.lensAngle,
      handleAngle: mark.handleAngle ?? mark.lensAngle,
      // Phóng sao cho chiếc nhẫn (bán kính ring theo bề rộng ảnh) chiếm khoảng nửa thấu kính
      zoom: (lensR * 0.5) / (mark.ring * w),
    }
    const [gx, gy] = rotatePoint(lens.x, lens.y, placed)
    return { id: mark.id, u: mark.u, v: mark.v, x, y, r, lens, seed: index + w, globalLens: { x: gx, y: gy, r: lensR } }
  })
  return placed
}

function rotatePoint(x, y, { cx, cy, rotate }) {
  const angle = (rotate * Math.PI) / 180
  const dx = x - cx
  const dy = y - cy
  return [cx + dx * Math.cos(angle) - dy * Math.sin(angle), cy + dx * Math.sin(angle) + dy * Math.cos(angle)]
}

// Vòng khoanh tay: méo nhẹ, nét bút vòng quá điểm đầu một đoạn và lệch dần ra ngoài như vẽ thật
function scribbleCircle(cx, cy, r, seed = 0) {
  const steps = 48
  const start = -2.2 + (seed % 7) * 0.35
  const sweep = Math.PI * 2 * 1.13
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const t = start + (sweep * index) / steps
    const wobble = 1 + 0.045 * Math.sin(t * 2 + seed) + 0.03 * Math.sin(t * 3 + 1.7 * seed)
    const radius = r * wobble * (1 + (0.16 * index) / steps)
    return `${(cx + radius * 1.08 * Math.cos(t)).toFixed(1)} ${(cy + radius * 0.94 * Math.sin(t)).toFixed(1)}`
  })
  return `M${points.join('L')}`
}

// Dây căng giữa mép hai kính lúp (hoặc vòng khoanh nếu không dùng kính), võng nhẹ xuống dưới
function stringPath(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  const ux = dx / length
  const uy = dy / length
  const start = [from.x + ux * from.r, from.y + uy * from.r]
  const end = [to.x - ux * to.r, to.y - uy * to.r]
  const sag = Math.min(length * 0.06, 40)
  const control = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + sag]
  const d = `M${start.map((n) => n.toFixed(1)).join(' ')}Q${control.map((n) => n.toFixed(1)).join(' ')} ${end
    .map((n) => n.toFixed(1))
    .join(' ')}`
  return { d, start, end }
}
