'use client'

import { useMemo, useState } from 'react'
import { computeNetwork } from './model/calc.js'
import { ARCHETYPES, MAX_TERMINALS, SCENARIOS } from './model/config.js'
import { fmtCadCompact, fmtNum } from './model/format.js'
import { useVision } from './state'
import { Stat, usePrefersReducedMotion } from './ui'

// Abstract positions only: this is not a map and no position corresponds to
// a real community.
const SLOTS = [
  { x: 450, y: 245 },
  { x: 255, y: 135 }, { x: 650, y: 130 }, { x: 240, y: 370 }, { x: 670, y: 375 },
  { x: 455, y: 70 }, { x: 455, y: 430 }, { x: 85, y: 250 }, { x: 815, y: 250 },
]
const LINK_DISTANCE = 265
const letter = i => String.fromCharCode(65 + i)
const STAGE_OPTIONS = [
  ...SCENARIOS.map(s => ({ value: s.id, label: `${s.label} terminal` })),
  { value: 'current', label: 'Same as configured above' },
]
const SELECT = 'min-w-0 rounded-lg border border-[#d9cdbb] bg-white px-2 py-1.5 text-sm text-[#3F3228] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50'

function linksFor(n) {
  const links = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = SLOTS[i]
      const b = SLOTS[j]
      if (Math.hypot(a.x - b.x, a.y - b.y) <= LINK_DISTANCE) links.push([i, j])
    }
  }
  return links
}

export default function NetworkScale() {
  const { state, dispatch } = useVision()
  const reduced = usePrefersReducedMotion()
  const [archetype, setArchetype] = useState('ruralCounty')
  const [stage, setStage] = useState('starter')
  const net = useMemo(() => computeNetwork(state.a, state.modules, state.network), [state.a, state.modules, state.network])
  const links = linksFor(state.network.length)
  const maxPop = Math.max(...net.rows.map(r => r.population), 1)
  const full = state.network.length >= MAX_TERMINALS

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="vision-blueprint rounded-3xl border border-[#e2d8ca] p-2 sm:p-4">
          <svg viewBox="0 0 900 500" className="h-auto w-full" role="img" aria-label={`Conceptual network of ${state.network.length} region${state.network.length > 1 ? 's' : ''}, one terminal each, with ${links.length} interregional connection${links.length === 1 ? '' : 's'}. Hypothetical, not a map.`}>
            {links.map(([i, j]) => {
              const a = SLOTS[i]
              const b = SLOTS[j]
              const d = `M${a.x},${a.y} L${b.x},${b.y}`
              const back = `M${b.x},${b.y} L${a.x},${a.y}`
              return (
                <g key={`${i}-${j}`}>
                  <path d={d} stroke="#e8b04a" strokeWidth="2" strokeDasharray="7 6" fill="none" />
                  {!reduced && (
                    <>
                      <circle r="4" fill="#c48a1f"><animateMotion dur="4s" repeatCount="indefinite" path={d} begin={`${-(i + j) * 0.4}s`} /></circle>
                      <circle r="4" fill="#2F5D50"><animateMotion dur="4.6s" repeatCount="indefinite" path={back} begin={`${-(i * j) * 0.3}s`} /></circle>
                    </>
                  )}
                </g>
              )
            })}
            {net.rows.map((t, i) => {
              const { x, y } = SLOTS[i]
              const r = 16 + 22 * Math.sqrt(t.population / maxPop)
              const pec = t.archetype === 'pec'
              return (
                <g key={t.id} className="vision-pop">
                  <circle cx={x} cy={y} r={r * 2.4} fill={pec ? '#c8513b' : '#2F5D50'} opacity="0.08" />
                  <circle cx={x} cy={y} r={r} fill={pec ? '#c8513b' : '#fffdf8'} stroke={pec ? '#a83e2f' : '#2F5D50'} strokeWidth="2" />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={pec ? '#fffdf8' : '#2F5D50'}>{pec ? 'PEC' : letter(i)}</text>
                  <text x={x} y={y + r + 18} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#3F3228" paintOrder="stroke" stroke="#fbf7ef" strokeWidth="4">
                    {pec ? 'Prince Edward County' : `Hypothetical region ${letter(i)}`}
                  </text>
                  <text x={x} y={y + r + 33} textAnchor="middle" fontSize="11" fill="#6d5f50" paintOrder="stroke" stroke="#fbf7ef" strokeWidth="4">
                    {pec ? `Pilot terminal · ${fmtNum(t.population)}` : `${ARCHETYPES.find(a => a.id === t.archetype)?.label} · ${fmtNum(t.population)}`}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="px-2 pb-1 text-xs leading-5 text-[#8a7b69]">Abstract diagram, not a map. Each circle is a separate region with a single terminal. Other regions are hypothetical: none are planned, secured or operational.</p>
        </div>

        <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
          <h3 className="text-lg font-bold text-[#3F3228]">Terminals in the network</h3>
          <ul className="mt-3 divide-y divide-[#efe6d8]">
            {state.network.map((t, i) => (
              <li key={t.id} className="flex items-start gap-3 py-2.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${i === 0 ? 'bg-brand-primary text-white' : 'border-2 border-[#2F5D50] text-[#2F5D50]'}`}>{i === 0 ? 'PEC' : letter(i)}</span>
                {i === 0 ? (
                  <span className="flex-1 text-sm text-[#3F3228]">Prince Edward County <span className="block text-xs text-[#8a7b69]">The pilot: one terminal for the whole County, proposed at Base31, configured above · {fmtCadCompact(net.rows[0].capex)}</span></span>
                ) : (
                  <>
                    <span className="grid min-w-0 flex-1 gap-1.5">
                      <label className="sr-only" htmlFor={`arch-${t.id}`}>Region type for hypothetical region {letter(i)}</label>
                      <select id={`arch-${t.id}`} value={t.archetype} onChange={e => dispatch({ type: 'terminalArchetype', id: t.id, archetype: e.target.value })} className={SELECT}>
                        {ARCHETYPES.map(a => <option key={a.id} value={a.id}>{a.label} (~{fmtNum(a.population)} people)</option>)}
                      </select>
                      <label className="sr-only" htmlFor={`stage-${t.id}`}>Terminal for hypothetical region {letter(i)}</label>
                      <select id={`stage-${t.id}`} value={net.rows[i].stage} onChange={e => dispatch({ type: 'terminalStage', id: t.id, stage: e.target.value })} className={SELECT}>
                        {STAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <span className="text-xs text-[#8a7b69]">{fmtCadCompact(net.rows[i].capex)} capital · {fmtCadCompact(net.rows[i].annualSales)}/yr sales</span>
                    </span>
                    <button type="button" onClick={() => dispatch({ type: 'removeTerminal', id: t.id })} className="rounded-full px-2 py-1 text-xs font-semibold text-[#8a7b69] hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary" aria-label={`Remove hypothetical region ${letter(i)}`}>
                      Remove
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="new-archetype">Region type for a new hypothetical region</label>
            <select id="new-archetype" value={archetype} onChange={e => setArchetype(e.target.value)} disabled={full} className={`${SELECT} flex-1`}>
              {ARCHETYPES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <label className="sr-only" htmlFor="new-stage">Terminal for a new hypothetical region</label>
            <select id="new-stage" value={stage} onChange={e => setStage(e.target.value)} disabled={full} className={`${SELECT} flex-1`}>
              {STAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button type="button" disabled={full} onClick={() => dispatch({ type: 'addTerminal', archetype, stage })} className="rounded-full bg-[#2F5D50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#244a40] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5D50]">
              + Add another region
            </button>
          </div>
          {state.network.length > 1 && (
            <button type="button" onClick={() => dispatch({ type: 'resetNetwork' })} className="mt-3 text-xs font-semibold text-[#2F5D50] hover:underline">Back to the PEC pilot only</button>
          )}
          <p className="mt-4 text-xs leading-5 text-[#8a7b69]">Each region gets one terminal. New regions open as a Starter by default, the same first step proposed for PEC, or you can give them any scenario’s terminal or the one you configured above.</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5" aria-live="polite">
        <Stat label="Regions served" value={fmtNum(state.network.length)} sub={`${fmtNum(net.population)} people`} />
        <Stat label="Regional food demand" value={fmtCadCompact(net.demand)} sub="Annual household food spending" />
        <Stat label="Combined investment" term="capex" value={fmtCadCompact(net.investment)} sub="Capital across all terminals, at each one’s stage" />
        <Stat label="Aggregate sales" term="gmv" value={fmtCadCompact(net.sales)} sub="Annual, at each terminal’s stage" tone="good" />
        <Stat label="Interregional connections" value={fmtNum(links.length)} sub="Links between neighbouring regions" />
      </dl>
    </div>
  )
}
