// Isometric architectural model of a conceptual Small Regional Food Terminal.
// Used twice: as the static hero illustration, and as the clickable module
// explorer (Section D) when `onSelect` is provided. Coordinates are in feet on
// the ground plane (x east, y south, z up) and projected isometrically.

const S = 3.35 // px per foot
const COS = Math.cos(Math.PI / 6)
const OX = 470
const OY = 150

const P = (x, y, z = 0) => [OX + (x - y) * COS * S, OY + (x + y) * 0.5 * S - z * S]
const pts = list => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const at = (x, y, z) => P(x, y, z).map(v => v.toFixed(1))

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round((t - v) * p + v))
  return `rgb(${c.join(',')})`
}

const EDGE = 'rgba(63,50,40,0.45)'

function Box({ x, y, z = 0, w, d, h, color, ribs = false, opacity = 1 }) {
  const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
  const right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
  const left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
  const lines = []
  if (ribs) {
    for (let u = 1.2; u < d; u += 1.2) lines.push([P(x + w, y + u, z + 0.3), P(x + w, y + u, z + h - 0.3)])
    for (let u = 1.2; u < w; u += 1.2) lines.push([P(x + u, y + d, z + 0.3), P(x + u, y + d, z + h - 0.3)])
  }
  return (
    <g opacity={opacity}>
      <polygon points={pts(right)} fill={shade(color, -0.12)} stroke={EDGE} strokeWidth="0.6" />
      <polygon points={pts(left)} fill={shade(color, -0.26)} stroke={EDGE} strokeWidth="0.6" />
      <polygon points={pts(top)} fill={shade(color, 0.18)} stroke={EDGE} strokeWidth="0.6" />
      {lines.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(40,30,20,0.18)" strokeWidth="0.6" />
      ))}
    </g>
  )
}

// A rectangle drawn on the visible south face (y = y + d) of a box.
function SouthPanel({ x, y, z = 0, d, u0, u1, v0, v1, fill, stroke = EDGE }) {
  const yy = y + d
  return <polygon points={pts([P(x + u0, yy, z + v0), P(x + u1, yy, z + v0), P(x + u1, yy, z + v1), P(x + u0, yy, z + v1)])} fill={fill} stroke={stroke} strokeWidth="0.5" />
}
// A rectangle drawn on the visible east face (x = x + w) of a box.
function EastPanel({ x, y, z = 0, w, u0, u1, v0, v1, fill, stroke = EDGE }) {
  const xx = x + w
  return <polygon points={pts([P(xx, y + u0, z + v0), P(xx, y + u1, z + v0), P(xx, y + u1, z + v1), P(xx, y + u0, z + v1)])} fill={fill} stroke={stroke} strokeWidth="0.5" />
}

function Solar({ x0, x1, y0, y1, z }) {
  const panels = []
  for (let px = x0; px + 5 <= x1 + 0.01; px += 5.5) {
    const q = [P(px, y1, z + 0.6), P(px + 5, y1, z + 0.6), P(px + 5, y0, z + 2.6), P(px, y0, z + 2.6)]
    panels.push(
      <g key={px}>
        <polygon points={pts(q)} fill="#33506b" stroke="#22374a" strokeWidth="0.5" />
        <line x1={P(px + 2.5, y1, z + 0.6)[0]} y1={P(px + 2.5, y1, z + 0.6)[1]} x2={P(px + 2.5, y0, z + 2.6)[0]} y2={P(px + 2.5, y0, z + 2.6)[1]} stroke="#6f90ad" strokeWidth="0.4" />
        <line x1={P(px, (y0 + y1) / 2, z + 1.6)[0]} y1={P(px, (y0 + y1) / 2, z + 1.6)[1]} x2={P(px + 5, (y0 + y1) / 2, z + 1.6)[0]} y2={P(px + 5, (y0 + y1) / 2, z + 1.6)[1]} stroke="#6f90ad" strokeWidth="0.4" />
      </g>,
    )
  }
  return <g>{panels}</g>
}

function Tree({ x, y, r = 4, color = '#7d9a5b' }) {
  const [bx, by] = P(x, y, 0)
  const [cx, cy] = P(x, y, 6 + r * 0.6)
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={r * S * 0.9} ry={r * S * 0.45} fill="rgba(63,50,40,0.12)" />
      <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#6b5440" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * S} fill={color} />
      <circle cx={cx - r * S * 0.3} cy={cy - r * S * 0.3} r={r * S * 0.55} fill={shade(color, 0.18)} />
    </g>
  )
}

function Car({ x, y, color }) {
  return (
    <g>
      <Box x={x} y={y} w={5} d={9} h={2.4} color={color} />
      <Box x={x + 0.6} y={y + 2.2} z={2.4} w={3.8} d={4.4} h={1.6} color="#dfe8ee" />
    </g>
  )
}

function Greenhouse({ x, y, w, d }) {
  const wall = 8
  const ridge = 15
  const xm = x + w / 2
  const glass = 'rgba(240,247,236,0.55)'
  const frame = '#7d9a5b'
  const rows = []
  for (let gx = x + 3; gx < x + w - 2; gx += 4.5) {
    rows.push(<Box key={gx} x={gx} y={y + 3} w={2.4} d={d - 6} h={1.6} color="#7d9a5b" />)
  }
  const ribs = []
  for (let gy = y; gy <= y + d + 0.01; gy += 4) {
    ribs.push(<polyline key={gy} points={pts([P(x, gy, wall), P(xm, gy, ridge), P(x + w, gy, wall), P(x + w, gy, 0)])} fill="none" stroke={frame} strokeWidth="0.6" />)
  }
  return (
    <g>
      <polygon points={pts([P(x, y), P(x + w, y), P(x + w, y + d), P(x, y + d)])} fill="#cdbf9f" />
      {rows}
      <polygon points={pts([P(x, y, wall), P(xm, y, ridge), P(xm, y + d, ridge), P(x, y + d, wall)])} fill={glass} stroke={frame} strokeWidth="0.7" />
      <polygon points={pts([P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, wall), P(x + w, y, wall)])} fill={glass} stroke={frame} strokeWidth="0.7" />
      <polygon points={pts([P(xm, y, ridge), P(x + w, y, wall), P(x + w, y + d, wall), P(xm, y + d, ridge)])} fill="rgba(250,252,246,0.6)" stroke={frame} strokeWidth="0.7" />
      <polygon points={pts([P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, wall), P(xm, y + d, ridge), P(x, y + d, wall)])} fill={glass} stroke={frame} strokeWidth="0.8" />
      {ribs}
      <SouthPanel x={x} y={y} d={d} u0={w / 2 - 3} u1={w / 2 + 3} v0={0} v1={7} fill="rgba(125,154,91,0.35)" stroke={frame} />
    </g>
  )
}

function Container({ x, y, z = 0, w, d, color, doors = true }) {
  return (
    <g>
      <Box x={x} y={y} z={z} w={w} d={d} h={9.5} color={color} ribs />
      {doors && w < d && <SouthPanel x={x} y={y} z={z} d={d} u0={0.6} u1={w - 0.6} v0={0.4} v1={8.8} fill={shade(color, -0.35)} />}
      {doors && w >= d && <EastPanel x={x} y={y} z={z} w={w} u0={0.6} u1={d - 0.6} v0={0.4} v1={8.8} fill={shade(color, -0.22)} />}
    </g>
  )
}

// ── Scene ───────────────────────────────────────────────────────────────────

// Same order as FUNCTIONS in model/config.js, so badge numbers match.
const ZONES = {
  aggregate: { label: 'Producer receiving', anchor: [4, 32, 10] },
  store: { label: 'Cold, frozen & dry storage', anchor: [124, 4, 13] },
  distribute: { label: 'Order fulfillment', anchor: [34, 23, 10] },
  sell: { label: 'Retail market', anchor: [46, 80, 11] },
  grow: { label: 'Greenhouse & hydroponics', anchor: [124, 38, 15] },
  process: { label: 'Processing kitchen', anchor: [72, 18, 19] },
}

function Ground() {
  const plate = [P(-22, -6), P(152, -6), P(152, 114), P(-22, 114)]
  return (
      <g>
        {/* Model base: a slab with visible thickness, like an architect's model */}
        <polygon points={pts([P(152, -6, 0), P(152, 114, 0), P(152, 114, -3), P(152, -6, -3)])} fill="#cbbd9f" />
        <polygon points={pts([P(-22, 114, 0), P(152, 114, 0), P(152, 114, -3), P(-22, 114, -3)])} fill="#b7a787" />
        <polygon points={pts(plate)} fill="#ece4d2" stroke="#cbbd9f" strokeWidth="1" />
        {/* Grass verges */}
        <polygon points={pts([P(104, 78), P(150, 78), P(150, 112), P(104, 112)])} fill="#dbe3c6" />
        <polygon points={pts([P(-4, 56), P(20, 56), P(20, 92), P(-4, 92)])} fill="#dbe3c6" />
        {/* Producer & freight lane (west) */}
        <polygon points={pts([P(-20, -4), P(-6, -4), P(-6, 112), P(-20, 112)])} fill="#d5c9b1" />
        {[0, 18, 36, 54, 72, 90].map(yy => (
          <line key={yy} x1={P(-13, yy + 4)[0]} y1={P(-13, yy + 4)[1]} x2={P(-13, yy + 12)[0]} y2={P(-13, yy + 12)[1]} stroke="#f4eee2" strokeWidth="1.4" />
        ))}
        {/* Customer parking (south) */}
        <polygon points={pts([P(22, 96), P(100, 96), P(100, 112), P(22, 112)])} fill="#d5c9b1" />
        {[22, 34, 46, 58, 70, 82, 94].map(xx => (
          <line key={xx} x1={P(xx, 97)[0]} y1={P(xx, 97)[1]} x2={P(xx, 111)[0]} y2={P(xx, 111)[1]} stroke="#f4eee2" strokeWidth="1" />
        ))}
        {/* Community courtyard */}
        <polygon points={pts([P(22, 38), P(98, 38), P(98, 66), P(22, 66)])} fill="#f3ead8" stroke="#dccfb6" strokeWidth="0.8" />
        <polygon points={pts([P(52, 46), P(68, 46), P(68, 58), P(52, 58)])} fill="#e6d8bb" />
      </g>
  )
}

const SCENE_ZONE_ORDER = ['store', 'aggregate', 'distribute', 'process', 'grow', 'courtyard', 'sell', 'parking']

function zoneContent(id) {
  switch (id) {
    case 'store':
      return (
        <g>
          <Container x={14} y={0} w={40} d={8} color="#90b4d0" doors={false} />
          <Container x={56} y={0} w={40} d={8} color="#5f8fb4" doors={false} />
          <Container x={98} y={0} w={40} d={8} color="#d9c29a" />
          <Solar x0={15} x1={137} y0={0.8} y1={7.2} z={9.5} />
        </g>
      )
    case 'aggregate':
      return (
        <g>
          {/* Producer truck on the freight lane */}
          <Box x={-18} y={22} w={8} d={18} h={9} color="#f1ece2" />
          <Box x={-17.5} y={40} w={7} d={6} h={6.5} color="#e8b04a" />
          <SouthPanel x={-17.5} y={40} d={6} u0={1} u1={6} v0={3.6} v1={6} fill="#b9d0e0" />
          {/* Dock canopy and receiving container */}
          <Container x={0} y={12} w={8} d={40} color="#e8b04a" />
          <Box x={-5.5} y={12} z={9.6} w={5.5} d={40} h={0.5} color="#d4cbb8" />
        </g>
      )
    case 'distribute':
      return (
        <g>
          <Container x={14} y={14} w={40} d={8} color="#c8513b" />
          <Container x={14} y={24} w={40} d={8} color="#d46a52" />
          <SouthPanel x={14} y={24} d={8} u0={14} u1={26} v0={0.3} v1={8} fill="#7a2f22" />
        </g>
      )
    case 'process':
      return (
        <g>
          <Container x={60} y={14} w={40} d={8} color="#802048" />
          <SouthPanel x={60} y={14} d={8} u0={6} u1={18} v0={4} v1={7.5} fill="#e7eef2" />
          {/* Staff & office container stacked above, with a roof deck rail */}
          <Container x={60} y={14} z={9.6} w={40} d={8} color="#a89a86" />
          <SouthPanel x={60} y={14} z={9.6} d={8} u0={4} u1={36} v0={3} v1={7.5} fill="#e7eef2" />
        </g>
      )
    case 'grow':
      return (
        <g>
          <Greenhouse x={108} y={14} w={32} d={46} />
          <Container x={104} y={66} w={40} d={8} color="#a4b787" />
          <SouthPanel x={104} y={66} d={8} u0={4} u1={36} v0={6} v1={8} fill="#e0e8cf" />
        </g>
      )
    case 'courtyard':
      return (
        <g>
          {[[28, 42, 3.6], [92, 42, 4], [40, 62, 3.4], [80, 62, 4.2], [60, 40, 3]].sort((a, b) => a[0] + a[1] - b[0] - b[1]).map(([x, y, r]) => (
            <Tree key={`${x}-${y}`} x={x} y={y} r={r} color={x > 70 ? '#8aa66a' : '#7d9a5b'} />
          ))}
          <Box x={54} y={49} w={5} d={3} h={1.4} color="#a07a52" />
          <Box x={61} y={53} w={5} d={3} h={1.4} color="#a07a52" />
        </g>
      )
    case 'sell':
      return (
        <g>
          <Box x={26} y={70} w={44} d={18} h={10.5} color="#2F5D50" ribs />
          <SouthPanel x={26} y={70} d={18} u0={3} u1={41} v0={0.3} v1={7.4} fill="#cfe0e8" />
          {[10, 17, 24, 31].map(u => (
            <SouthPanel key={u} x={26} y={70} d={18} u0={u} u1={u + 0.4} v0={0.3} v1={7.4} fill="#2F5D50" />
          ))}
          <Box x={26} y={88} z={8.2} w={44} d={5} h={0.5} color="#c8513b" />
          <Solar x0={28} x1={68} y0={71} y1={86} z={10.5} />
        </g>
      )
    case 'parking':
      return (
        <g>
          <Car x={25} y={100} color="#c8513b" />
          <Car x={49} y={100} color="#90b4d0" />
          <Car x={73} y={100} color="#e8b04a" />
        </g>
      )
    default:
      return null
  }
}

const CALLOUTS = [
  { text: 'Rooftop solar over shared storage', anchor: [118, 2, 12.5], to: [700, 62], side: 'start' },
  { text: 'Producer receiving & freight lane', anchor: [-12, 20, 9], to: [250, 92], side: 'end' },
  { text: 'Order fulfillment', anchor: [20, 18, 9.5], to: [190, 250], side: 'end' },
  { text: 'Processing kitchen, staff above', anchor: [78, 14, 19.1], to: [560, 46], side: 'end' },
  { text: 'Greenhouse & container farm', anchor: [140, 36, 9], to: [925, 250], side: 'end' },
  { text: 'Community courtyard', anchor: [58, 46, 0], to: [200, 340], side: 'end' },
  { text: 'Retail market hall', anchor: [30, 92, 6], to: [175, 470], side: 'end' },
  { text: 'Customer parking & pickup', anchor: [64, 110, 0], to: [610, 575], side: 'start' },
]

export default function TerminalIllustration({ active = null, onSelect, labels = false, title = 'Conceptual illustration of a modular regional food terminal' }) {
  const interactive = typeof onSelect === 'function'

  return (
    <svg viewBox={interactive ? '60 20 880 590' : '0 0 960 600'} className="h-auto w-full" role={interactive ? 'group' : 'img'} aria-label={title}>
      <defs>
        <radialGradient id="ti-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f6d88f" />
          <stop offset="1" stopColor="#f6d88f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="860" cy="70" r="70" fill="url(#ti-sun)" className="vision-sun" />
      <circle cx="860" cy="70" r="20" fill="#f2c867" />
      <Ground />
      {SCENE_ZONE_ORDER.map(id => {
        const zone = ZONES[id]
        const selectable = interactive && zone
        const dim = interactive && active && active !== id
        const content = zoneContent(id)
        if (!selectable) {
          return <g key={id} opacity={dim ? 0.45 : 1} className="transition-opacity duration-300">{content}</g>
        }
        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            aria-label={`${zone.label}: show details`}
            aria-pressed={active === id}
            onClick={() => onSelect(id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(id)
              }
            }}
            className="vision-zone cursor-pointer transition-opacity duration-300"
            opacity={dim ? 0.4 : 1}
          >
            {content}
          </g>
        )
      })}

      {interactive && Object.entries(ZONES).map(([id, z], i) => {
        const [cx, cy] = P(...z.anchor)
        const on = active === id
        return (
          <g key={id} pointerEvents="none" aria-hidden="true">
            <circle cx={cx} cy={cy - 14} r="13" fill={on ? '#3F3228' : '#fffdf8'} stroke="#3F3228" strokeWidth="1.5" />
            <text x={cx} y={cy - 9.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? '#fffdf8' : '#3F3228'}>{i + 1}</text>
          </g>
        )
      })}

      {labels && (
        <g className="hidden sm:inline" aria-hidden="true" fontSize="11.5" fill="#3F3228">
          {CALLOUTS.map(c => {
            const [ax, ay] = at(...c.anchor)
            const [tx, ty] = c.to
            const right = c.side === 'start'
            return (
              <g key={c.text}>
                <circle cx={ax} cy={ay} r="3" fill="#3F3228" />
                <polyline points={`${ax},${ay} ${tx},${ty}`} fill="none" stroke="#3F3228" strokeWidth="0.8" />
                <text x={tx + (right ? 6 : -6)} y={ty + 4} textAnchor={right ? 'start' : 'end'} fontWeight="600" paintOrder="stroke" stroke="#fbf7ef" strokeWidth="4" strokeLinejoin="round">
                  {c.text}
                </text>
              </g>
            )
          })}
        </g>
      )}
    </svg>
  )
}

export const ILLUSTRATION_ZONES = ZONES
