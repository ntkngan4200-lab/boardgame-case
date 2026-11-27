import { useId } from 'react'

// Bức tường bằng chứng: ảnh/tài liệu ghim trên bảng, khoanh đỏ chi tiết, phóng to bằng kính lúp và nối bằng dây chỉ đỏ.
// Toạ độ chi tiết (mark) tính theo tỉ lệ ảnh (u = x / rộng, v = y / cao) nên đổi bố cục không phải đo lại.
const RED = '#a8201a'
// Màu nền giấy của ảnh bản tin, để lề giấy xé liền với ảnh
const NEWSPRINT = '#f6f4f0'
const FRAMES = {
  polaroid: { side: 12, top: 12, bottom: 46, captionAlign: 'middle', pin: true },
  // Mẩu báo xé tay khỏi trang báo lớn: mép trên/dưới rách, lề giấy cùng màu nền bài báo để vết xé không cắt vào chữ,
  // dán băng keo hai góc trên. Nhãn tên canh trái để dây đỏ đi xuống không cắt qua chữ
  torn: { side: 0, top: 16, bottom: 16, captionAlign: 'start', torn: true, tape: true, label: true },
  // Ảnh in ghim thẳng lên bảng, không viền; tên ghi trên nhãn giấy bên dưới
  photo: { side: 0, top: 0, bottom: 0, captionAlign: 'middle', pin: true, label: true },
  // Trang tài liệu: ảnh chính là tờ giấy, không viền kem, không chú thích, ghim ở mép trên
  paper: { side: 0, top: 0, bottom: 0, captionAlign: 'middle', pin: true },
  // Thẻ ghi chú viết tay: vài dòng chữ trên giấy kem, mỗi dòng có thể làm đầu dây (item.lines)
  card: { side: 0, top: 0, bottom: 0, captionAlign: 'start', pin: true },
}

export function EvidenceWall({ wall, note, extra, className = '' }) {
  return (
    <figure className={`evidence-wall ${className}`}>
      {/* Ngang cho màn hình rộng, dọc cho điện thoại */}
      <WallBoard wall={wall} layout={wall.layouts.wide} className="hidden md:block" />
      <WallBoard wall={wall} layout={wall.layouts.tall} className="md:hidden" />
      <figcaption className="sr-only">{wall.description}</figcaption>
      {note ? <WallNote note={note} /> : null}
      {extra ? <WallExtra extra={extra} /> : null}
    </figure>
  )
}

// Bằng chứng nhỏ ghim dưới tờ kết luận: trích lời khai (đoạn gạch chân) → dây đỏ có mũi tên → thẻ nhận định,
// kèm dòng nhật ký ghim ngay dưới thẻ. Dựng lại bằng chữ thật để đọc rõ trên điện thoại.
function WallExtra({ extra }) {
  const { excerpt, statement, log } = extra
  return (
    <div className="px-4 pb-10 sm:px-8 sm:pb-12">
      <div className="mx-auto max-w-3xl">
        <div className="wall-clip max-w-2xl">
          <span aria-hidden="true" className="wall-note__pin" />
          <p className="wall-clip__transcript">
            <strong>HỎI:</strong> {excerpt.question}
          </p>
          <p className="wall-clip__transcript mt-2">
            <strong>TRẢ LỜI:</strong> <Underline text={excerpt.answer} />
          </p>
        </div>
        {/* Nhãn giấy tên bằng chứng dưới góc trái, cùng kiểu nhãn "Lời khai - Lê Văn Út" trên bảng */}
        <p className="wall-caption">{excerpt.label}</p>

        <div className="ml-auto mt-16 max-w-xl sm:mt-20">
          <div className="wall-note px-6 py-5 sm:px-8 sm:py-6">
            {/* Mũi tên bám theo thẻ: đuôi chạm mép dưới nhãn lời khai, đầu mũi tên chạm sát mép trái ghim đỏ của thẻ.
                Đường cong co giãn theo khung (nét giữ nguyên độ dày), đầu mũi tên vẽ riêng để không bị méo */}
            <span aria-hidden="true" className="wall-arrow">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="wall-arrow__line">
                <path d="M2 0 C 4 70, 30 100, 97 100" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg viewBox="0 0 20 20" className="wall-arrow__head">
                <path d="M4 3 L 18 10 L 4 17" />
              </svg>
            </span>
            <span aria-hidden="true" className="wall-note__pin" />
            <p className="text-pretty text-lg font-semibold leading-snug sm:text-xl">{statement}</p>
          </div>
          <div className="wall-log mt-4">
            <span aria-hidden="true" className="wall-log__tape" />
            <p className="wall-log__label">{log.label}</p>
            <ul className="wall-log__row">
              {log.cells.map((cell, index) => (
                <li key={index} className={log.strong.includes(index) ? 'font-bold text-black' : undefined}>
                  {cell}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// __…__ = đoạn được gạch chân trong biên bản gốc
function Underline({ text }) {
  return text.split('__').map((part, index) => (index % 2 ? <u key={index} className="wall-clip__mark">{part}</u> : part))
}

// Tờ ghi chú giải thích ghim ngay trên bảng, dưới các bằng chứng
function WallNote({ note }) {
  return (
    <div className="px-4 pb-8 pt-2 sm:px-8 sm:pb-10">
      <div className="wall-note mx-auto max-w-3xl px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-9">
        <span aria-hidden="true" className="wall-note__pin" />
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-graphite">{note.label}</p>
        {note.lines ? (
          <NoteLines lines={note.lines} />
        ) : (
          <p className="mt-2 text-pretty text-base font-semibold leading-relaxed sm:text-lg">{note.text}</p>
        )}
      </div>
    </div>
  )
}

// note.lines: mỗi phần tử là một đoạn; bắt đầu bằng "- " là gạch đầu dòng, "→ " là dòng kết luận.
// Chữ nằm giữa **…** được tô đậm, còn lại viết thường.
function NoteLines({ lines }) {
  const blocks = []
  for (const line of lines) {
    if (line.startsWith('- ')) {
      const last = blocks.at(-1)
      if (last?.type === 'list') last.items.push(line.slice(2))
      else blocks.push({ type: 'list', items: [line.slice(2)] })
    } else blocks.push({ type: line.startsWith('→ ') ? 'conclusion' : 'text', text: line })
  }
  return (
    <div className="mt-3 space-y-2 text-pretty text-base leading-relaxed sm:text-lg">
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className="list-disc space-y-1 pl-6 marker:text-maroon/60">
            {block.items.map((item) => (
              <li key={item}>
                <Emphasis text={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={index} className={block.type === 'conclusion' ? 'pt-1' : undefined}>
            <Emphasis text={block.text} />
          </p>
        ),
      )}
    </div>
  )
}

function Emphasis({ text }) {
  return text.split('**').map((part, index) => (index % 2 ? <strong key={index}>{part}</strong> : part))
}

function WallBoard({ wall, layout, className }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const items = wall.items.map((item) => placeItem(item, layout))
  const lenses = new Map(items.flatMap((item) => item.marks.map((mark) => [mark.id, mark.globalLens])))
  // Bố cục có thể nối dây khác (vd. điện thoại nối vào mép phải thẻ ghi chú thay vì mép trái)
  const strings = layoutStrings(layout.strings ?? wall.strings, lenses)

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
          {/* Xơ giấy ở mép xé: nhiễu mịn làm nhoè nhẹ viền trắng, không thành răng cưa */}
          <filter id={`${uid}-fiber`} filterUnits="userSpaceOnUse" x="0" y="0" width={layout.width} height={layout.height}>
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9" />
            <feDisplacementMap in="SourceGraphic" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
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
            {item.frame.torn ? (
              <TornPaper uid={uid} item={item} />
            ) : (
              <rect
                x={item.frameX}
                y={item.frameY}
                width={item.frameW}
                height={item.frameH}
                rx="2"
                style={{ fill: 'rgb(var(--cream))' }}
                filter={`url(#${uid}-lift)`}
              />
            )}
            {item.src ? (
              <image
                href={item.src}
                x={item.x}
                y={item.y}
                width={item.w}
                height={item.h}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : null}
            {item.lines ? <CardLines item={item} /> : null}
            {item.frame.torn || item.lines ? null : (
              <rect x={item.x} y={item.y} width={item.w} height={item.h} fill="none" stroke="#000" strokeOpacity=".15" />
            )}
            {item.caption && !item.frame.label ? (
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
            ) : null}
            {item.frame.tape ? <ClippingTape item={item} /> : null}
            {item.caption && item.frame.label ? <CaptionLabel item={item} size={layout.captionSize} /> : null}
          </g>
        ))}

        {/* Khoanh đỏ + kính lúp, vẽ sau cùng để không bị ảnh khác đè */}
        {items.map((item) => (
          <g key={item.id} transform={item.transform}>
            {item.marks.map((mark) => (
              <g key={mark.id}>
                {/* circle: false — không khoanh, chỉ giữ điểm ghim dây cạnh chi tiết */}
                {mark.circle === false ? null : mark.underline ? (
                  // underline: gạch dưới đỏ dài 2r ngay dưới dòng chữ (thay cho vòng khoanh), như đoạn gạch chân trong lời khai
                  <path
                    d={`M${mark.x - mark.r} ${mark.y + 0.6}Q${mark.x} ${mark.y - 1.2} ${mark.x + mark.r} ${mark.y + 0.4}`}
                    fill="none"
                    stroke={RED}
                    strokeWidth={layout.strokeWidth * 0.75}
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={scribbleCircle(mark.x, mark.y, mark.r, mark.seed, mark.aspect)}
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
        {strings.map((string) => (
          <g key={string.key}>
            <path d={string.d} fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="2.6" transform="translate(0 4)" />
            <g filter={`url(#${uid}-thread)`} fill="none" strokeLinecap="round">
              <path d={string.d} stroke={RED} strokeWidth="2.4" />
              {/* Vân xoắn của sợi chỉ: nét sáng và nét tối ngắt quãng, lệch pha nhau */}
              <path d={string.d} stroke="#e48b80" strokeWidth="1" strokeOpacity=".7" strokeDasharray="2 3.5" />
              <path d={string.d} stroke="#4a0b08" strokeWidth="1" strokeOpacity=".55" strokeDasharray="1.5 4" strokeDashoffset="2.5" />
            </g>
          </g>
        ))}
        {/* Ghim ở hai đầu dây; điểm rẽ nhánh dùng chung một ghim */}
        {stringPins(strings).map(([x, y]) => (
          <Pin key={`${x}-${y}`} x={x} y={y} r={5} />
        ))}

        {/* Ghim giữ ảnh */}
        {items
          .filter((item) => item.frame.pin)
          .map((item) => {
            const [x, y] = rotatePoint(item.cx, item.frameY + 10, item)
            return <Pin key={item.id} x={x} y={y} r={6} />
          })}
      </svg>
    </div>
  )
}

// Chữ trên thẻ ghi chú, mỗi dòng một hàng kẻ mờ
function CardLines({ item }) {
  return item.lines.map((line, index) => {
    const y = item.y + item.pad + item.lineTops[index] + item.lineH
    return (
      <g key={line.text}>
        <line
          x1={item.x + item.pad * 0.6}
          x2={item.x + item.w - item.pad * 0.6}
          y1={y - item.lineH * 0.18}
          y2={y - item.lineH * 0.18}
          stroke="#000"
          strokeOpacity=".1"
        />
        <text
          x={item.x + item.pad}
          y={y - item.lineH * 0.38}
          fontFamily="'Be Vietnam Pro', sans-serif"
          fontWeight="600"
          fontSize={item.fontSize}
          style={{ fill: 'rgb(var(--maroon))' }}
        >
          {line.text}
        </text>
      </g>
    )
  })
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
        x={lens.x - (mark.lensU ?? mark.u) * item.w * lens.zoom}
        y={lens.y - (mark.lensV ?? mark.v) * item.h * lens.zoom}
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

// Mẩu báo xé: mép trên và dưới rách không đều, lộ viền xơ giấy trắng mảnh, mép trái phải thẳng theo cột báo
function TornPaper({ uid, item }) {
  const left = item.frameX
  const right = item.frameX + item.frameW
  const depth = item.frame.top * 0.6
  const seed = item.w
  const top = tearEdge(left, right, depth, seed)
  const bottom = tearEdge(left, right, depth, seed + 17)
  // Viền xơ: lớp trắng hơn nhô ra ngoài vết xé, dày mỏng thất thường, có đoạn không có
  const rim = (index, offset) => Math.max(0, 2.6 * smoothNoise(index / 9, seed + offset) - 0.5)
  const outline = (grow) =>
    [
      ...top.map(([x, dy], index) => [x, item.frameY + dy - grow(index, 3)]),
      ...bottom.map(([x, dy], index) => [x, item.frameY + item.frameH - dy + grow(index, 8)]).reverse(),
    ]
      .map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join('') + 'Z'
  return (
    <g filter={`url(#${uid}-lift)`}>
      <path d={outline(rim)} fill="#fdfcf9" filter={`url(#${uid}-fiber)`} />
      <path d={outline(() => 0)} fill={NEWSPRINT} />
    </g>
  )
}

// Độ sâu vết xé dọc theo mép: nhiễu mượt hai tầng (đường lượn lớn + gợn nhỏ) và hơi xiên, không thành răng cưa
function tearEdge(from, to, depth, seed) {
  const step = 2.5
  const count = Math.ceil((to - from) / step)
  const slant = smoothNoise(seed, seed) - 0.5
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = Math.min(from + index * step, to)
    const wave = 0.78 * smoothNoise(x / 26, seed) + 0.22 * smoothNoise(x / 8, seed + 5)
    const tilt = slant * 0.5 * ((x - from) / (to - from) - 0.5)
    return [x, depth * Math.min(1, Math.max(0.05, wave + tilt))]
  })
}

function smoothNoise(x, seed) {
  const i = Math.floor(x)
  const f = x - i
  const t = f * f * (3 - 2 * f)
  return lattice(i, seed) * (1 - t) + lattice(i + 1, seed) * t
}

function lattice(i, seed) {
  const n = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return n - Math.floor(n)
}

// Nhãn giấy ghi tên bằng chứng dán ngay dưới ảnh (bề rộng ước theo số ký tự của font Be Vietnam Pro đậm)
function CaptionLabel({ item, size }) {
  const width = item.caption.length * size * 0.6 + size * 1.6
  const height = size * 2.1
  const align = item.frame.captionAlign
  // 'end': nhãn dán góc phải dưới ảnh (chừa chỗ cho kính lúp ở mép dưới bên trái)
  const x =
    align === 'start'
      ? item.frameX + size * 0.6
      : align === 'end'
        ? item.frameX + item.frameW - width - size * 0.6
        : item.cx - width / 2
  const y = item.frameY + item.frameH + size * 0.7
  return (
    <g transform={`rotate(${item.frame.captionAlign === 'start' ? 1.2 : -1} ${x + width / 2} ${y + height / 2})`}>
      <rect x={x + 1.5} y={y + 3} width={width} height={height} fill="#000" opacity=".3" />
      <rect x={x} y={y} width={width} height={height} rx="1.5" style={{ fill: 'rgb(var(--cream))' }} />
      <text
        x={x + width / 2}
        y={y + height / 2 + size * 0.36}
        textAnchor="middle"
        fontFamily="'Be Vietnam Pro', sans-serif"
        fontWeight="700"
        fontSize={size}
        style={{ fill: 'rgb(var(--maroon))' }}
      >
        {item.caption}
      </text>
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
  // item.captionAlign: dời nhãn tên sang trái ('start') hoặc phải ('end') khi dây đỏ / kính lúp nằm ngay giữa mép dưới ảnh
  const frame = { ...FRAMES[item.frame], ...(item.captionAlign ? { captionAlign: item.captionAlign } : {}) }
  const w = place.w
  // Thẻ ghi chú: cao theo số dòng chữ; mỗi dòng sinh điểm nối dây ở mép trái/phải (line.anchors)
  const card = item.lines ? cardMetrics(item, layout) : null
  const h = card ? card.h : w / item.ratio
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
    ...card,
  }
  placed.cx = placed.frameX + placed.frameW / 2
  placed.cy = placed.frameY + placed.frameH / 2
  placed.transform = `rotate(${place.rotate} ${placed.cx} ${placed.cy})`
  // place.marks[id] cho phép bố cục đổi hướng kính lúp riêng (vd. lensAngle khác giữa wide và tall)
  const lineMarks = card
    ? item.lines.flatMap((line, index) =>
        // span: điểm nối nằm giữa `span` dòng liền nhau (vd. hai dòng cùng một ý)
        (line.anchors ?? []).map(({ id, side, span = 1 }) => ({
          id,
          u: side === 'right' ? 1 : 0,
          v: (card.pad + card.lineTops[index] + (span * card.lineH) / 2) / h,
          circle: false,
          pinR: 3,
        })),
      )
    : []
  placed.marks = [...(item.marks ?? []), ...lineMarks].map((baseMark, index) => {
    const mark = { ...baseMark, ...place.marks?.[baseMark.id] }
    const x = place.x + mark.u * w
    const y = place.y + mark.v * h
    // pinR: điểm nối nằm sát mép thẻ ghi chú, dây chạm ngay mép giấy
    const r = mark.pinR ?? Math.max(mark.r * w, layout.minMarkRadius)
    // Không có lensAngle: chi tiết đủ rõ, dây nối thẳng vào vòng khoanh
    if (mark.lensAngle === undefined) {
      // anchorV: dời điểm nối dây (đinh ghim) xuống sát dưới đoạn gạch chân để không che chữ được gạch
      const [gx, gy] = rotatePoint(x, mark.anchorV != null ? place.y + mark.anchorV * h : y, placed)
      const anchorR = mark.underline ? 0 : r
      return { id: mark.id, x, y, r, aspect: mark.aspect, circle: mark.circle, underline: mark.underline, lens: null, seed: index + w, globalLens: { x: gx, y: gy, r: anchorR, aspect: mark.aspect } }
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
    // lensU/lensV: tâm vùng phóng to (mặc định = chi tiết), dời vào trong khi chi tiết sát mép ảnh để thấu kính không lộ nền đen
    return { id: mark.id, u: mark.u, v: mark.v, lensU: mark.lensU, lensV: mark.lensV, x, y, r, aspect: mark.aspect, lens, seed: index + w, globalLens: { x: gx, y: gy, r: lensR } }
  })
  return placed
}

// line.gap: chừa thêm nửa dòng trống phía trên để tách nhóm ý (như dòng trống trong ghi chú gốc)
function cardMetrics(item, layout) {
  const fontSize = layout.cardFont
  const lineH = fontSize * 1.55
  const pad = fontSize * 0.9
  let top = 0
  const lineTops = item.lines.map((line) => {
    top += line.gap ? lineH * 0.6 : 0
    const lineTop = top
    top += lineH
    return lineTop
  })
  return { fontSize, lineH, pad, lineTops, h: pad * 2 + top }
}

function rotatePoint(x, y, { cx, cy, rotate }) {
  const angle = (rotate * Math.PI) / 180
  const dx = x - cx
  const dy = y - cy
  return [cx + dx * Math.cos(angle) - dy * Math.sin(angle), cy + dx * Math.sin(angle) + dy * Math.cos(angle)]
}

// Vòng khoanh tay: méo nhẹ, nét bút vòng quá điểm đầu một đoạn và lệch dần ra ngoài như vẽ thật.
// aspect > 1 kéo dài vòng theo chiều dọc để khoanh trọn vật dài (vd. cả sợi dây chuyền)
function scribbleCircle(cx, cy, r, seed = 0, aspect = 1) {
  const steps = 48
  const start = -2.2 + (seed % 7) * 0.35
  const sweep = Math.PI * 2 * 1.13
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const t = start + (sweep * index) / steps
    const wobble = 1 + 0.045 * Math.sin(t * 2 + seed) + 0.03 * Math.sin(t * 3 + 1.7 * seed)
    const radius = r * wobble * (1 + (0.16 * index) / steps)
    return `${(cx + radius * 1.08 * Math.cos(t)).toFixed(1)} ${(cy + radius * 0.94 * aspect * Math.sin(t)).toFixed(1)}`
  })
  return `M${points.join('L')}`
}

// Đầu dây là id chi tiết, hoặc { mid: [idA, idB] } = điểm giữa sợi dây nối A–B (dây rẽ nhánh từ đó).
// Dây được nối theo thứ tự khai báo nên dây A–B phải đứng trước các nhánh rẽ từ nó.
// Phần tử thứ ba { bend: [dx, dy] }: kéo điểm điều khiển của dây cong ra ngoài (vd. dây nối hai dòng cùng mép thẻ, dây vòng qua góc thẻ).
function layoutStrings(pairs, lenses) {
  const byKey = new Map()
  const anchor = (end) => (typeof end === 'string' ? lenses.get(end) : { ...byKey.get(end.mid.join('~')).mid, r: 0 })
  const name = (end) => (typeof end === 'string' ? end : `giua(${end.mid.join('~')})`)
  return pairs.map(([from, to, options]) => {
    const string = { ...stringPath(anchor(from), anchor(to), options?.bend), key: `${name(from)}~${name(to)}` }
    byKey.set(string.key, string)
    return string
  })
}

function stringPins(strings) {
  const pins = new Map()
  for (const { start, end } of strings) {
    for (const [x, y] of [start, end]) pins.set(`${x.toFixed(1)} ${y.toFixed(1)}`, [x, y])
  }
  return [...pins.values()]
}

// Khoảng cách từ tâm tới mép vòng khoanh theo hướng (ux, uy); vòng bầu dục (aspect) dùng đúng bán kính ngang/dọc
// như scribbleCircle để dây chạm ngay nét khoanh thay vì dừng ở ngoài
function edgeDistance(anchor, ux, uy) {
  if (!anchor.aspect || anchor.aspect === 1) return anchor.r
  const rx = anchor.r * 1.08
  const ry = anchor.r * 0.94 * anchor.aspect
  return 1 / Math.hypot(ux / rx, uy / ry)
}

// Dây căng giữa mép hai kính lúp (hoặc vòng khoanh nếu không dùng kính), võng nhẹ xuống dưới
function stringPath(from, to, bend = [0, 0]) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  const ux = dx / length
  const uy = dy / length
  const startR = edgeDistance(from, ux, uy)
  const endR = edgeDistance(to, ux, uy)
  const start = [from.x + ux * startR, from.y + uy * startR]
  const end = [to.x - ux * endR, to.y - uy * endR]
  const sag = Math.min(length * 0.06, 40)
  const control = [(start[0] + end[0]) / 2 + bend[0], (start[1] + end[1]) / 2 + sag + bend[1]]
  const d = `M${start.map((n) => n.toFixed(1)).join(' ')}Q${control.map((n) => n.toFixed(1)).join(' ')} ${end
    .map((n) => n.toFixed(1))
    .join(' ')}`
  // Điểm giữa đường cong (t = 0,5) để nhánh khác rẽ ra
  const mid = { x: (start[0] + 2 * control[0] + end[0]) / 4, y: (start[1] + 2 * control[1] + end[1]) / 4 }
  return { d, start, end, mid }
}
