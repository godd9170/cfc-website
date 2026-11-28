'use client'

import { MODULE_BY_ID } from './model/config.js'
import { fmtCad, fmtCadCompact, fmtNum } from './model/format.js'
import { useVision } from './state'

// Producer-facing services: equipment and licensed space that would sit idle
// on any one farm, but could stay busy when shared across a region.

const SERVICES = [
  {
    id: 'eggGrading',
    title: 'Egg grading',
    hook: 'From farm gate to grocery shelf',
    body: 'In Ontario, eggs sold through stores and restaurants generally need to be graded at a registered station. Many small flocks sell only at the farm gate because one is out of reach. A shared station could open new markets for them.',
    icon: (
      <g>
        <ellipse cx="20" cy="24" rx="9" ry="12" fill="#fffdf8" stroke="#3F3228" strokeWidth="1.6" />
        <ellipse cx="32" cy="27" rx="8" ry="10.5" fill="#f0d9a0" stroke="#3F3228" strokeWidth="1.6" />
        <path d="M6 36h36" stroke="#3F3228" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 'grainMill',
    title: 'Grain milling',
    hook: 'Keep the value of the grain crop in the region',
    body: 'A stone mill turns regional wheat, rye, spelt and corn into flour, meal and cereal: a local supply for bakers and households, and a better price for growers than selling grain as a commodity.',
    icon: (
      <g>
        <circle cx="24" cy="24" r="14" fill="#c9a66b" stroke="#3F3228" strokeWidth="1.6" />
        <circle cx="24" cy="24" r="4" fill="#fffdf8" stroke="#3F3228" strokeWidth="1.4" />
        {[0, 60, 120, 180, 240, 300].map(d => (
          <line key={d} x1="24" y1="24" x2={24 + 13 * Math.cos((d * Math.PI) / 180)} y2={24 + 13 * Math.sin((d * Math.PI) / 180)} stroke="#3F3228" strokeWidth="1" />
        ))}
      </g>
    ),
  },
  {
    id: 'butchery',
    title: 'Cut-and-wrap butchery',
    hook: 'Ease a well-known bottleneck for small livestock farms',
    body: 'Producers bring carcasses from licensed abattoirs to be cut, packaged and labelled to order, booked when they need it. Processing capacity is one of the hardest constraints small livestock farms face.',
    icon: (
      <g>
        <path d="M10 30c0-10 8-18 18-18 6 0 10 4 10 9 0 8-8 15-18 15-6 0-10-2-10-6z" fill="#b5655a" stroke="#3F3228" strokeWidth="1.6" />
        <circle cx="30" cy="20" r="3" fill="#fffdf8" stroke="#3F3228" strokeWidth="1.2" />
      </g>
    ),
  },
]

const capexOf = (m, inBuilding) => Object.values(inBuilding && m.lean ? m.lean : m.capex).reduce((s, v) => s + v, 0)

export default function SharedServices() {
  const { state, dispatch, model } = useVision()
  const inBuilding = model.capex.inBuilding

  return (
    <div className="mt-14">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#802048]">Shared services</p>
        <h3 className="mt-2 text-2xl font-bold leading-tight text-[#3F3228] md:text-3xl">The equipment no single farm can justify</h3>
        <p className="mt-4 text-base leading-7 text-[#5f5244] md:text-lg md:leading-8">
          For many small producers the hardest part isn’t growing food; it’s getting it into a form they’re allowed to sell.
          Equipment and licensed space that would sit idle on one farm could stay busy when shared across a region. Producers pay a
          fee per use and keep ownership of their product.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {SERVICES.map(s => {
          const m = MODULE_BY_ID[s.id]
          const on = state.modules[s.id] > 0
          const svc = model.services.find(x => x.id === s.id)
          const fee = state.a[m.service.fee]
          return (
            <li key={s.id} className={`flex flex-col rounded-2xl border p-5 transition ${on ? 'border-[#802048] bg-[#fffdf8] shadow-[0_8px_24px_rgba(128,32,72,0.10)]' : 'border-[#e2d8ca] bg-[#fffdf8]'}`}>
              <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">{s.icon}</svg>
              <h4 className="mt-3 text-lg font-bold text-[#3F3228]">{s.title}</h4>
              <p className="mt-1 text-sm font-semibold text-[#802048]">{s.hook}</p>
              <p className="mt-2 grow text-sm leading-6 text-[#5f5244]">{s.body}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-[#efe6d8] pt-3 text-xs">
                <dt className="text-[#8a7b69]">Capacity</dt>
                <dd className="text-right tabular-nums text-[#3F3228]">~{fmtNum(m.service.perWeek)} {m.service.units}/wk</dd>
                <dt className="text-[#8a7b69]">Illustrative fee</dt>
                <dd className="text-right tabular-nums text-[#3F3228]">{fee < 10 ? `$${fee.toFixed(2)}` : fmtCad(fee)} per {m.service.unit}</dd>
                <dt className="text-[#8a7b69]">Capital</dt>
                <dd className="text-right tabular-nums text-[#3F3228]">{fmtCadCompact(capexOf(m, inBuilding))}</dd>
                {on && svc && (
                  <>
                    <dt className="text-[#8a7b69]">Fees at {fmtNum(svc.weekly)} {m.service.units}/wk</dt>
                    <dd className="text-right font-semibold tabular-nums text-[#2F5D50]">{fmtCad(svc.feesMonthly)}/mo</dd>
                  </>
                )}
              </dl>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => dispatch({ type: 'module', id: s.id, value: on ? 0 : 1 })}
                className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#802048] ${on ? 'border border-[#802048] text-[#802048] hover:bg-[#802048]/5' : 'bg-[#802048] text-white hover:bg-[#6a1a3c]'}`}
              >
                {on ? '✓ In your terminal · remove' : '+ Add to your terminal'}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs leading-5 text-[#8a7b69]">
        Added services appear on the site plan below and flow into the operating model. Volumes and fees are illustrative and editable under
        “Shared producer services” in the operating assumptions. Every service would need the appropriate licensing and
        inspection, and would only make sense with enough producer demand.
      </p>
    </div>
  )
}
