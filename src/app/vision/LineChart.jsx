'use client'

import { useRef, useState } from 'react'

// Minimal responsive SVG line chart. `data` is an array of points with an `x`
// field plus one field per series key. Hover or drag to read values.

const W = 640
const H = 300
const PAD = { top: 16, right: 16, bottom: 36, left: 64 }

function niceTicks(min, max, count = 5) {
  const span = max - min || 1
  const step0 = span / count
  const mag = Math.pow(10, Math.floor(Math.log10(step0)))
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= count) ?? 10 * mag
  const start = Math.floor(min / step) * step
  const end = Math.ceil(max / step) * step
  const ticks = []
  for (let v = start; v <= end + step * 0.001; v += step) ticks.push(+v.toFixed(10))
  return ticks
}

export default function LineChart({ data, series, xFormat, yFormat, markers = [], ariaLabel, xLabel }) {
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const xs = data.map(d => d.x)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const ys = data.flatMap(d => series.map(s => d[s.key]))
  const yTicks = niceTicks(Math.min(0, ...ys), Math.max(...ys))
  const yMin = yTicks[0]
  const yMax = yTicks.at(-1)
  const iw = W - PAD.left - PAD.right
  const ih = H - PAD.top - PAD.bottom
  const sx = x => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * iw
  const sy = y => PAD.top + ih - ((y - yMin) / (yMax - yMin || 1)) * ih
  const xTicks = niceTicks(xMin, xMax, 6).filter(t => t >= xMin && t <= xMax)

  function onMove(e) {
    const rect = svgRef.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const x = xMin + ((px - PAD.left) / iw) * (xMax - xMin)
    let best = 0
    data.forEach((d, i) => { if (Math.abs(d.x - x) < Math.abs(data[best].x - x)) best = i })
    setHover(best)
  }

  const hp = hover != null ? data[hover] : null

  return (
    <figure className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {yTicks.map(t => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} stroke={t === 0 ? '#8a7b69' : '#e2d8ca'} strokeWidth={t === 0 ? 1.2 : 1} />
            <text x={PAD.left - 8} y={sy(t) + 4} textAnchor="end" fontSize="11" fill="#8a7b69">{yFormat(t)}</text>
          </g>
        ))}
        {xTicks.map(t => (
          <text key={t} x={sx(t)} y={H - PAD.bottom + 18} textAnchor="middle" fontSize="11" fill="#8a7b69">{xFormat(t)}</text>
        ))}
        {xLabel && <text x={PAD.left + iw / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="#6d5f50">{xLabel}</text>}

        {markers.map(m => (
          <g key={m.label}>
            <line x1={sx(m.x)} x2={sx(m.x)} y1={PAD.top} y2={PAD.top + ih} stroke={m.color ?? '#3F3228'} strokeWidth="1.2" strokeDasharray={m.dash ?? '4 4'} />
            <text x={sx(m.x) + (sx(m.x) > W - 140 ? -6 : 6)} y={PAD.top + 12 + (m.row ?? 0) * 14} textAnchor={sx(m.x) > W - 140 ? 'end' : 'start'} fontSize="11" fontWeight="600" fill={m.color ?? '#3F3228'} paintOrder="stroke" stroke="#fffdf8" strokeWidth="3">{m.label}</text>
          </g>
        ))}

        {series.map(s => (
          <path
            key={s.key}
            d={data.map((d, i) => `${i ? 'L' : 'M'}${sx(d.x).toFixed(1)},${sy(d[s.key]).toFixed(1)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width ?? 2.5}
            strokeDasharray={s.dash}
            strokeLinejoin="round"
          />
        ))}

        {hp && (
          <g pointerEvents="none">
            <line x1={sx(hp.x)} x2={sx(hp.x)} y1={PAD.top} y2={PAD.top + ih} stroke="#3F3228" strokeOpacity="0.3" />
            {series.map(s => <circle key={s.key} cx={sx(hp.x)} cy={sy(hp[s.key])} r="4" fill="#fffdf8" stroke={s.color} strokeWidth="2" />)}
          </g>
        )}
      </svg>

      {hp && (
        <div className="pointer-events-none absolute top-2 rounded-lg border border-[#e2d8ca] bg-[#fffdf8]/95 px-3 py-2 text-xs shadow-md" style={sx(hp.x) / W > 0.55 ? { left: '14%' } : { right: '4%' }}>
          <p className="mb-1 font-semibold text-[#3F3228]">{xFormat(hp.x)}</p>
          {series.map(s => (
            <p key={s.key} className="flex items-center gap-2 tabular-nums text-[#5f5244]">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}: <strong className="text-[#3F3228]">{yFormat(hp[s.key], true)}</strong>
            </p>
          ))}
        </div>
      )}

      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5f5244]">
        {series.map(s => (
          <span key={s.key} className="flex items-center gap-1.5">
            <svg width="18" height="6" aria-hidden="true"><line x1="0" x2="18" y1="3" y2="3" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash} /></svg>
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
