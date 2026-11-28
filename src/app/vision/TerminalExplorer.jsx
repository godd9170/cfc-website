'use client'

import { useState } from 'react'
import TerminalIllustration from './TerminalIllustration'
import { FUNCTIONS, MODULES, STREAMS } from './model/config.js'
import { fmtCad, fmtNum } from './model/format.js'
import { useVision } from './state'
import { Term } from './ui'

const capexOf = m => Object.values(m.capex).reduce((s, v) => s + v, 0)
const monthlyOf = (m, a) => (a[`staff_${m.id}`] ?? 0) * a.wageHourly * (52 / 12) + m.monthly.energy + m.monthly.water

export function capacityText(m, a) {
  const c = m.capacity
  if (m.service) return `~${fmtNum(m.service.perWeek)} ${m.service.units} a week`
  if (c.ordersPerWeek) return `~${fmtNum(c.ordersPerWeek)} orders a week`
  if (c.coldWeekly && c.frozenWeekly) return `~${fmtCad(c.coldWeekly)} chilled, ${fmtCad(c.frozenWeekly)} frozen and ${fmtCad(c.dryWeekly)} dry product a week`
  if (c.coldWeekly) return `~${fmtCad(c.coldWeekly)} of chilled product a week · ${c.coldPallets} pallet positions`
  if (c.frozenWeekly) return `~${fmtCad(c.frozenWeekly)} of frozen product a week · ${c.frozenPallets} pallet positions`
  if (c.dryWeekly) return `~${fmtCad(c.dryWeekly)} of shelf-stable product a week · ${c.dryPallets} pallet positions`
  if (c.retailAnnual) return `~${fmtCad(c.retailAnnual)} of retail sales a year`
  if (c.growAnnual) return `~${fmtCad(c.growAnnual)} of produce a year (at retail value)`
  if (c.kitchenHours) return `${fmtNum(a.kitchenHoursPerMonth)} rentable hours a month`
  return 'Supports producer drop-offs and check-in'
}

export default function TerminalExplorer() {
  const { state } = useVision()
  const [active, setActive] = useState('aggregate')
  const fn = FUNCTIONS.find(f => f.id === active)
  const mods = MODULES.filter(m => m.fn === active)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="vision-blueprint rounded-3xl border border-[#e2d8ca] p-2 sm:p-4">
        <TerminalIllustration active={active} onSelect={setActive} title="Interactive terminal: select a numbered zone to see what it does" />
        <p className="px-2 pb-1 text-xs text-[#8a7b69]">Select a numbered zone, or use the list. Conceptual illustration, not a committed design.</p>
      </div>

      <div>
        <div role="group" aria-label="Terminal functions" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FUNCTIONS.map((f, i) => {
            const on = f.id === active
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                aria-controls="fn-panel"
                onClick={() => setActive(f.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${on ? 'border-[#3F3228] bg-[#3F3228] text-[#fffdf8]' : 'border-[#e2d8ca] bg-[#fffdf8] text-[#3F3228] hover:border-[#c8bca9]'}`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: on ? '#fffdf8' : f.color, color: on ? '#3F3228' : '#fff' }}>{i + 1}</span>
                {f.label}
              </button>
            )
          })}
        </div>

        <div id="fn-panel" aria-live="polite" className="mt-4 rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: fn.color }}>{fn.label}</p>
          <h3 className="mt-1 text-xl font-bold text-[#3F3228]">{fn.summary}</h3>
          <div className="mt-4 space-y-4">
            {mods.map(m => (
              <div key={m.id} className="border-t border-[#efe6d8] pt-4">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ background: m.color }} />
                  <h4 className="text-sm font-bold text-[#3F3228]" style={{ fontFamily: 'inherit' }}>{m.name}</h4>
                </div>
                <p className="mt-1 text-sm leading-6 text-[#5f5244]">{m.description}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-[#8a7b69]">Potential capacity</dt>
                  <dd className="text-[#3F3228]">{capacityText(m, state.a)}</dd>
                  <dt className="text-[#8a7b69]"><Term k="capex">Capital per unit</Term></dt>
                  <dd className="tabular-nums text-[#3F3228]">{fmtCad(capexOf(m))}</dd>
                  <dt className="text-[#8a7b69]"><Term k="opex">Fixed cost per month</Term></dt>
                  <dd className="tabular-nums text-[#3F3228]">{fmtCad(monthlyOf(m, state.a))}</dd>
                  <dt className="text-[#8a7b69]">Revenue streams</dt>
                  <dd className="text-[#3F3228]">{m.streams.length ? m.streams.map(s => STREAMS[s]).join(', ') : 'None directly; it enables the others'}</dd>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#8a7b69]">Illustrative figures before shared site costs, fees and contingency. Configure the full terminal below.</p>
        </div>
      </div>
    </div>
  )
}
