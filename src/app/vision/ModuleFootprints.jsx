'use client'

import { useState } from 'react'
import { BENCHMARK_SOURCES, CAPEX_CATEGORIES, MODULES } from './model/config.js'
import { fmtCad, fmtNum } from './model/format.js'
import { useVision } from './state'
import { capacityText } from './TerminalExplorer'

// Scaled interior plan of each module, with its specs, itemized capital and
// how those costs compare with current market prices.

const FILL = {
  door: '#fffdf8', equip: '#e7cdb6', work: '#f1dfae', storage: '#e6dccb', cold: '#cfe0ec',
  frozen: '#a9c4dc', dry: '#ead9b6', grow: '#c9d9ae', mech: '#c4bcb0', public: '#f6efe0', wall: '#3F3228',
}
const CAT_LABEL = Object.fromEntries(CAPEX_CATEGORIES.map(c => [c.id, c.label]))

// Greedy word-wrap into at most four lines of roughly maxChars each.
function wrap(text, maxChars) {
  const lines = []
  for (const word of text.split(' ')) {
    const last = lines.at(-1)
    if (last && (last + ' ' + word).length <= maxChars) lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  return lines.slice(0, 4)
}

function Plan({ m }) {
  const { L, W, items } = m.layout
  const VB_W = 760
  const pad = 36
  const s = (VB_W - pad * 2) / L
  const VB_H = Math.round(W * s + pad * 2 + 8)
  const X = ft => pad + ft * s
  const Y = ft => pad + ft * s
  const containers = m.containers
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" role="img" aria-label={`Floor plan of the ${m.name}: ${L} by ${W} feet. ${items.filter(i => i.label).map(i => i.label).join(', ')}.`}>
      <defs>
        <marker id="fp-tick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <line x1="5" y1="0" x2="5" y2="10" stroke="#5f5244" strokeWidth="1.5" />
        </marker>
      </defs>
      {/* Shell */}
      <rect x={X(0) - 5} y={Y(0) - 5} width={L * s + 10} height={W * s + 10} fill={containers ? '#8a7b69' : 'none'} stroke="#3F3228" strokeWidth={containers ? 1 : 2} strokeDasharray={containers ? undefined : '8 4'} rx="2" />
      <rect x={X(0)} y={Y(0)} width={L * s} height={W * s} fill="#fbf7ef" />
      {containers > 1 && <line x1={X(0)} x2={X(L)} y1={Y(W / 2)} y2={Y(W / 2)} stroke="#8a7b69" strokeWidth="2" strokeDasharray="10 6" />}

      {items.map((it, i) => {
        const w = it.w * s
        const h = it.h * s
        const fits = it.label && w > it.label.length * 5.6 + 8
        return (
          <g key={i}>
            <rect x={X(it.x)} y={Y(it.y)} width={w} height={h} fill={FILL[it.kind] ?? '#eee'} stroke={it.kind === 'wall' ? 'none' : '#3F3228'} strokeWidth="0.9" strokeDasharray={it.kind === 'door' ? '4 3' : undefined} rx="2" />
            {it.label && (
              fits ? (
                <text x={X(it.x) + w / 2} y={Y(it.y) + h / 2 + 4} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#3F3228">{it.label}</text>
              ) : (
                <text x={X(it.x) + w / 2} y={Y(it.y) + h / 2} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#3F3228">
                  {wrap(it.label, Math.max(6, Math.floor(w / 6))).map((line, j, arr) => (
                    <tspan key={j} x={X(it.x) + w / 2} dy={j === 0 ? -(arr.length - 1) * 6 + 4 : 12}>{line}</tspan>
                  ))}
                </text>
              )
            )}
          </g>
        )
      })}

      {/* Dimensions */}
      <line x1={X(0)} x2={X(L)} y1={Y(W) + 22} y2={Y(W) + 22} stroke="#5f5244" strokeWidth="1" markerStart="url(#fp-tick)" markerEnd="url(#fp-tick)" />
      <text x={X(L / 2)} y={Y(W) + 18} textAnchor="middle" fontSize="11" fill="#5f5244">{L}′</text>
      <line x1={X(0) - 20} x2={X(0) - 20} y1={Y(0)} y2={Y(W)} stroke="#5f5244" strokeWidth="1" markerStart="url(#fp-tick)" markerEnd="url(#fp-tick)" />
      <text x={X(0) - 24} y={Y(W / 2) + 4} textAnchor="end" fontSize="11" fill="#5f5244" transform={`rotate(-90 ${X(0) - 26} ${Y(W / 2)})`}>{W}′</text>
    </svg>
  )
}

export default function ModuleFootprints() {
  const { state, model } = useVision()
  const [id, setId] = useState('cold')
  const m = MODULES.find(x => x.id === id)
  const inBuilding = model.capex.inBuilding
  const usingLean = inBuilding && m.lean
  const capex = usingLean ? m.lean : m.capex
  const total = Object.values(capex).reduce((s, v) => s + v, 0)
  const sqft = m.layout.L * m.layout.W
  const staff = state.a[`staff_${m.id}`]
  const count = state.modules[m.id] || 0

  return (
    <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-4 sm:p-6">
      <div role="group" aria-label="Choose a module" className="flex flex-wrap gap-2">
        {MODULES.map(x => {
          const on = x.id === id
          return (
            <button
              key={x.id}
              type="button"
              aria-pressed={on}
              onClick={() => setId(x.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary ${on ? 'border-[#3F3228] bg-[#3F3228] text-[#fffdf8]' : 'border-[#e2d8ca] text-[#3F3228] hover:border-[#c8bca9]'}`}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ background: x.color }} />
              {x.short}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="vision-blueprint rounded-2xl border border-[#ece3d4] p-2 sm:p-4">
            <Plan m={m} />
          </div>
          <p className="mt-2 text-xs leading-5 text-[#8a7b69]">
            {m.containers ? `${m.containers === 2 ? 'Two joined 40′ containers' : 'One 40′ container'} · interior ≈ 39′ × 7′8″, with 8′10″ to 9′4″ of headroom in a high cube.` : 'A free-standing structure, not a container.'} Conceptual layout, not to exact scale.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold text-[#3F3228]">{m.name}</h4>
            <p className="mt-1 text-sm leading-6 text-[#5f5244]">{m.description}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-[#8a7b69]">Footprint</dt><dd className="text-right tabular-nums text-[#3F3228]">{m.layout.L}′ × {m.layout.W}′ · {fmtNum(sqft)} sq ft</dd>
            <dt className="text-[#8a7b69]">Capacity</dt><dd className="text-right text-[#3F3228]">{capacityText(m, state.a)}</dd>
            <dt className="text-[#8a7b69]">Staffing</dt><dd className="text-right tabular-nums text-[#3F3228]">{staff ? `${staff} hr/wk` : m.service ? 'Per use' : 'Shared team'}</dd>
            <dt className="text-[#8a7b69]">Energy</dt><dd className="text-right tabular-nums text-[#3F3228]">{fmtCad(m.monthly.energy)}/mo</dd>
            <dt className="text-[#8a7b69]">In your terminal</dt><dd className="text-right tabular-nums text-[#3F3228]">{count}</dd>
          </dl>

          <div className="rounded-xl border border-[#efe6d8] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7b69]">Capital per unit{usingLean ? ' · existing-building approach' : ''}</p>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {Object.entries(capex).map(([k, v]) => (
                  <tr key={k} className="border-b border-[#f4ede2]">
                    <th scope="row" className="py-1 text-left font-normal text-[#5f5244]">{k === 'containers' ? 'Container, delivery & placement' : CAT_LABEL[k]}</th>
                    <td className="py-1 text-right tabular-nums text-[#3F3228]">{fmtCad(v)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="pt-1.5 text-left font-semibold text-[#3F3228]">Total</th>
                  <td className="pt-1.5 text-right font-bold tabular-nums text-[#3F3228]">{fmtCad(total)} <span className="text-xs font-normal text-[#8a7b69]">({fmtCad(total / sqft)}/sq ft)</span></td>
                </tr>
              </tfoot>
            </table>
            <p className="mt-2 text-xs leading-5 text-[#8a7b69]">Before shared site costs, professional fees and contingency, which the totals elsewhere add.</p>
          </div>

          {m.checks?.length > 0 && (
            <div className="rounded-xl bg-[#f3ecdf] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7b69]">Market check</p>
              <ul className="mt-2 space-y-2.5 text-sm">
                {m.checks.map(c => (
                  <li key={c.item}>
                    <p className="font-medium text-[#3F3228]">{c.item}</p>
                    <p className="text-xs leading-5 text-[#5f5244]">Market: {c.market}</p>
                    <p className="text-xs leading-5 text-[#5f5244]">Modelled: {c.modelled}</p>
                    {c.sources.length > 0 && (
                      <p className="text-xs leading-5">
                        {c.sources.map((k, i) => (
                          <span key={k}>
                            {i > 0 && ' · '}
                            <a href={BENCHMARK_SOURCES[k].url} target="_blank" rel="noreferrer" className="text-[#2F5D50] underline-offset-2 hover:underline">{BENCHMARK_SOURCES[k].label}</a>
                          </span>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] leading-4 text-[#8a7b69]">Published prices and dealer listings checked November 2026; US dollars converted at about 1.38. Indicative only: get local quotes before budgeting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
