'use client'

import { useState } from 'react'
import { SegmentedControl, usePrefersReducedMotion } from './ui'

// A conceptual comparison of three network shapes. Deliberately unquantified:
// it shows how food moves, not how far or with what emissions.

const MODES = [
  {
    value: 'central', label: 'Centralized',
    caption: 'Food from distant industrial production and from local farms alike travels to a central distribution centre, then back out to grocery stores in each community.',
    steps: ['Producer', 'Central distribution centre', 'Grocery store', 'Household'],
  },
  {
    value: 'independent', label: 'Independent terminals',
    caption: 'Each region has one small terminal. Its producers deliver to it, and it serves the households of that region directly.',
    steps: ['Regional producer', 'Regional food terminal', 'Household'],
  },
  {
    value: 'connected', label: 'Interconnected terminals',
    caption: 'Each terminal still serves its own region first, but exchange products with neighbours where climate, seasonality or specialization make sense, and draw on global supply only when necessary.',
    steps: ['Regional producer', 'Regional food terminal', 'Household', '+ exchange between terminals'],
  },
]

const COMMUNITIES = [
  { x: 480, y: 120 },
  { x: 760, y: 105 },
  { x: 520, y: 345 },
  { x: 790, y: 330 },
]
const HOUSES = [[-38, -4], [-24, 26], [4, 36], [32, 18], [36, -16], [10, -34], [-20, -30]]
const FARMS = [
  { x: 395, y: 55, c: 0 }, { x: 590, y: 195, c: 0 },
  { x: 680, y: 30, c: 1 }, { x: 870, y: 190, c: 1 },
  { x: 410, y: 420, c: 2 }, { x: 625, y: 435, c: 2 },
  { x: 700, y: 430, c: 3 }, { x: 885, y: 420, c: 3 },
]
const DC = { x: 215, y: 235 }
const INDUSTRIAL = [{ x: 60, y: 85 }, { x: 60, y: 390 }]
const NEIGHBOURS = [[0, 1], [0, 2], [1, 3], [2, 3]]

const curve = (a, b, bend = 0.12) => {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`
}
const len = (a, b) => Math.hypot(b.x - a.x, b.y - a.y)

function edgesFor(mode) {
  const e = []
  if (mode === 'central') {
    INDUSTRIAL.forEach((f, i) => e.push({ id: `ind${i}`, from: f, to: DC, kind: 'long' }))
    FARMS.forEach((f, i) => e.push({ id: `farm-dc${i}`, from: f, to: DC, kind: 'long', bend: 0.06 }))
    COMMUNITIES.forEach((c, i) => e.push({ id: `dc-c${i}`, from: DC, to: c, kind: 'long', bend: -0.06 }))
  } else {
    FARMS.forEach((f, i) => e.push({ id: `farm-t${i}`, from: f, to: COMMUNITIES[f.c], kind: 'local' }))
  }
  if (mode === 'connected') {
    NEIGHBOURS.forEach(([a, b]) => {
      e.push({ id: `t${a}-t${b}`, from: COMMUNITIES[a], to: COMMUNITIES[b], kind: 'exchange' })
      e.push({ id: `t${b}-t${a}`, from: COMMUNITIES[b], to: COMMUNITIES[a], kind: 'exchange', bend: -0.12 })
    })
    e.push({ id: 'global', from: INDUSTRIAL[0], to: COMMUNITIES[0], kind: 'global' })
  }
  // Last mile: hub to each household
  COMMUNITIES.forEach((c, ci) => HOUSES.forEach(([dx, dy], hi) => {
    e.push({ id: `c${ci}h${hi}`, from: c, to: { x: c.x + dx, y: c.y + dy }, kind: 'last', bend: 0 })
  }))
  return e
}

const STYLE = {
  long: { stroke: '#c8513b', width: 1.6, dash: null, dot: '#c8513b' },
  local: { stroke: '#2F5D50', width: 1.6, dash: null, dot: '#2F5D50' },
  exchange: { stroke: '#e8b04a', width: 1.8, dash: '6 5', dot: '#c48a1f' },
  global: { stroke: '#8a7b69', width: 1, dash: '2 5', dot: '#8a7b69' },
  last: { stroke: '#8a7b69', width: 0.7, dash: null, dot: null },
}

function House({ x, y }) {
  return <path d={`M${x - 5},${y + 4} V${y - 1} L${x},${y - 6} L${x + 5},${y - 1} V${y + 4} Z`} fill="#fffdf8" stroke="#3F3228" strokeWidth="1.1" />
}

function Farm({ x, y }) {
  return (
    <g>
      <path d={`M${x - 10},${y + 8} V${y - 2} L${x},${y - 10} L${x + 10},${y - 2} V${y + 8} Z`} fill="#c8513b" stroke="#3F3228" strokeWidth="1.1" />
      <rect x={x - 3} y={y + 1} width="6" height="7" fill="#fffdf8" />
      <path d={`M${x - 26},${y + 12} q8,-6 16,0 M${x + 12},${y + 12} q8,-6 16,0`} stroke="#a4b787" strokeWidth="2" fill="none" />
    </g>
  )
}

function Hub({ x, y, kind }) {
  if (kind === 'store') {
    return (
      <g>
        <rect x={x - 11} y={y - 8} width="22" height="16" rx="2" fill="#d9c29a" stroke="#3F3228" strokeWidth="1.2" />
        <rect x={x - 11} y={y - 10} width="22" height="4" fill="#8a7b69" />
      </g>
    )
  }
  return (
    <g>
      <rect x={x - 14} y={y - 9} width="28" height="8" fill="#90b4d0" stroke="#3F3228" strokeWidth="1.1" />
      <rect x={x - 14} y={y - 1} width="14" height="8" fill="#c8513b" stroke="#3F3228" strokeWidth="1.1" />
      <rect x={x} y={y - 1} width="14" height="8" fill="#2F5D50" stroke="#3F3228" strokeWidth="1.1" />
    </g>
  )
}

export default function NetworkComparison() {
  const [mode, setMode] = useState('central')
  const reduced = usePrefersReducedMotion()
  const current = MODES.find(m => m.value === mode)
  const edges = edgesFor(mode)
  const central = mode === 'central'

  return (
    <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-4 shadow-[0_8px_24px_rgba(63,50,40,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl label="Network model" options={MODES} value={mode} onChange={setMode} />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7b69]">Conceptual · not to scale</p>
      </div>

      <div className="vision-blueprint mt-4 overflow-hidden rounded-2xl border border-[#ece3d4]">
        <svg viewBox="0 0 940 500" className="h-auto w-full" role="img" aria-label={`${current.label} food network: ${current.caption}`}>
          {/* Edges */}
          {edges.map(e => {
            const st = STYLE[e.kind]
            const d = curve(e.from, e.to, e.bend ?? 0.12)
            return <path key={`line-${e.id}`} d={d} fill="none" stroke={st.stroke} strokeWidth={st.width} strokeDasharray={st.dash ?? undefined} opacity={e.kind === 'last' ? 0.45 : 0.55} />
          })}
          {/* Moving food */}
          {!reduced && edges.filter(e => STYLE[e.kind].dot).map((e, i) => {
            const d = curve(e.from, e.to, e.bend ?? 0.12)
            const dur = Math.max(1.6, len(e.from, e.to) / 70)
            return (
              <circle key={`dot-${mode}-${e.id}`} r={e.kind === 'global' ? 2.5 : 3.5} fill={STYLE[e.kind].dot}>
                <animateMotion dur={`${dur.toFixed(2)}s`} repeatCount="indefinite" path={d} begin={`${-((i * 0.37) % dur).toFixed(2)}s`} />
              </circle>
            )
          })}

          {/* Industrial production + central DC */}
          <g opacity={central ? 1 : 0.28} className="transition-opacity duration-500">
            {INDUSTRIAL.map((f, i) => (
              <g key={i}>
                <path d={`M${f.x - 30},${f.y + 18} V${f.y - 6} l12,-8 v8 l12,-8 v8 l12,-8 v8 l12,-8 V${f.y + 18} Z`} fill="#d9cdbb" stroke="#3F3228" strokeWidth="1.1" />
                <rect x={f.x + 14} y={f.y - 30} width="6" height="18" fill="#a89a86" stroke="#3F3228" strokeWidth="1" />
              </g>
            ))}
            <text x={24} y={130} fontSize="12" fill="#6d5f50">{central ? 'Distant industrial production' : 'Global supply, when necessary'}</text>
            {central && (
              <g>
                <rect x={DC.x - 38} y={DC.y - 22} width="76" height="44" fill="#e9dfcd" stroke="#3F3228" strokeWidth="1.4" />
                {[-26, -10, 6, 22].map(dx => <rect key={dx} x={DC.x + dx - 5} y={DC.y + 6} width="10" height="16" fill="#8a7b69" />)}
                <text x={DC.x} y={DC.y + 42} textAnchor="middle" fontSize="12" fontWeight="600" fill="#3F3228">Central distribution centre</text>
              </g>
            )}
          </g>

          {FARMS.map((f, i) => <Farm key={i} {...f} />)}
          {COMMUNITIES.map((c, ci) => (
            <g key={ci}>
              {HOUSES.map(([dx, dy], hi) => <House key={hi} x={c.x + dx} y={c.y + dy} />)}
              <Hub x={c.x} y={c.y} kind={central ? 'store' : 'terminal'} />
            </g>
          ))}

          {/* Legend */}
          <g fontSize="11.5" fill="#5f5244" transform="translate(28 482)">
            <Farm x={8} y={-2} />
            <text x={42} y={4}>Regional farm</text>
            <House x={140} y={0} />
            <text x={152} y={4}>Household</text>
            <Hub x={250} y={0} kind={central ? 'store' : 'terminal'} />
            <text x={272} y={4}>{central ? 'Grocery store' : 'Regional food terminal'}</text>
            {mode === 'connected' && (<><line x1={430} x2={460} y1={0} y2={0} stroke="#e8b04a" strokeWidth="2" strokeDasharray="6 5" /><text x={468} y={4}>Interregional exchange</text></>)}
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <p className="text-sm leading-6 text-[#5f5244]" aria-live="polite">{current.caption}</p>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#3F3228]" aria-label="Steps from producer to household">
          {current.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-1.5">
              {i > 0 && !s.startsWith('+') && <span aria-hidden="true" className="text-[#8a7b69]">→</span>}
              <span className={`rounded-full px-2.5 py-1 ${s.startsWith('+') ? 'bg-[#fdf3dc] text-[#7a5a17]' : 'bg-[#f3ecdf]'}`}>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
