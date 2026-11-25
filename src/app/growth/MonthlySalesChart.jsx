'use client'

import { useState } from 'react'
import { YEAR_COLOR } from './colors'

// Monthly sales from opening (May 2025) to the snapshot cutoff, one bar per
// month, coloured by year. Hover or focus a bar for the month's figures.

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const W = 760
const H = 300
const PAD = { top: 28, right: 8, bottom: 52, left: 8 }

export default function MonthlySalesChart({ bars, cutoffLabel, partialNote }) {
  const [active, setActive] = useState(null)

  const max = Math.max(...bars.map(b => b.sales))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const slot = innerW / bars.length
  const barW = slot - 6
  const y = v => PAD.top + innerH - (v / max) * innerH

  // Label only each year's peak and the latest month, never every bar.
  const labelled = new Set()
  for (const year of new Set(bars.map(b => b.year))) {
    const ofYear = bars.filter(b => b.year === year)
    labelled.add(ofYear.reduce((a, b) => (b.sales > a.sales ? b : a)).key)
  }
  labelled.add(bars.at(-1).key)

  const shown = active != null ? bars[active] : null

  return (
    <figure className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Monthly sales from May 2025 to November 2026"
        onMouseLeave={() => setActive(null)}
      >
        <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} stroke="#1f3a2b" strokeOpacity="0.35" />

        {bars.map((b, i) => {
          const x = PAD.left + i * slot + 3
          const top = y(b.sales)
          const h = PAD.top + innerH - top
          const r = Math.min(4, barW / 2, h)
          const dim = active != null && active !== i
          const partial = b.partial
          return (
            <g key={b.key}>
              <path
                d={`M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`}
                fill={partial ? `url(#hatch-${b.year})` : YEAR_COLOR[b.year]}
                opacity={dim ? 0.45 : 1}
              />
              {labelled.has(b.key) && (
                <text x={x + barW / 2} y={top - 8} textAnchor="middle" className="fill-[#1f3a2b] text-[13px] font-semibold tabular-nums">
                  ${(b.sales / 1000).toFixed(1)}k
                </text>
              )}
              <text x={x + barW / 2} y={PAD.top + innerH + 18} textAnchor="middle" className="fill-[#4b5a4f] text-[12px]">
                {MONTHS[b.month - 1]}
              </text>
              {/* Hit target spans the full slot height, wider than the mark. */}
              <rect
                x={PAD.left + i * slot}
                y={PAD.top}
                width={slot}
                height={innerH + 24}
                fill="transparent"
                tabIndex={0}
                aria-label={`${MONTH_NAMES[b.month - 1]} ${b.year}: $${b.sales.toLocaleString('en-CA')} in sales, ${b.orders} orders`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              />
            </g>
          )
        })}

        {/* Year labels under each run of months */}
        {[...new Set(bars.map(b => b.year))].map(year => {
          const idx = bars.map((b, i) => (b.year === year ? i : -1)).filter(i => i >= 0)
          const x1 = PAD.left + idx[0] * slot + 3
          const x2 = PAD.left + (idx.at(-1) + 1) * slot - 3
          return (
            <g key={year}>
              <line x1={x1} x2={x2} y1={H - 22} y2={H - 22} stroke={YEAR_COLOR[year]} strokeWidth="2" />
              <text x={x1} y={H - 6} className="fill-[#1f3a2b] text-[13px] font-semibold">{year}</text>
            </g>
          )
        })}

        <defs>
          {Object.entries(YEAR_COLOR).map(([year, color]) => (
            <pattern key={year} id={`hatch-${year}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill={color} opacity="0.35" />
              <rect width="3" height="6" fill={color} />
            </pattern>
          ))}
        </defs>
      </svg>

      {shown && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md border border-[#1f3a2b]/15 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${((PAD.left + active * slot + slot / 2) / W) * 100}%` }}
        >
          <p className="font-semibold text-[#1f3a2b]">{MONTH_NAMES[shown.month - 1]} {shown.year}{shown.partial ? `, to ${cutoffLabel}` : ''}</p>
          <p className="mt-0.5 tabular-nums text-[#4b5a4f]">${shown.sales.toLocaleString('en-CA')} · {shown.orders} orders</p>
        </div>
      )}

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#4b5a4f]">
        {Object.entries(YEAR_COLOR).map(([year, color]) => (
          <span key={year} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
            {year}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <svg width="10" height="10" aria-hidden="true"><rect width="10" height="10" rx="2" fill="url(#hatch-2026)" /></svg>
          {partialNote}
        </span>
      </figcaption>

      <table className="sr-only">
        <caption>Sales by month</caption>
        <thead><tr><th>Month</th><th>Sales</th><th>Orders</th></tr></thead>
        <tbody>
          {bars.map(b => (
            <tr key={b.key}><td>{MONTH_NAMES[b.month - 1]} {b.year}</td><td>${b.sales}</td><td>{b.orders}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
