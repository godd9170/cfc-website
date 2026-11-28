'use client'

import { MODULES, STREAMS } from './model/config.js'
import { fmtAcres, fmtCad, fmtCadCompact, fmtNum, fmtSqft } from './model/format.js'
import { useVision } from './state'
import CostBreakdown from './CostBreakdown'
import { Flags, Stat, Term } from './ui'

// Plan view, in feet. North (producer & freight) road at the top, south
// (customer) road at the bottom. Each module has fixed bays; filled bays
// show a container, empty bays show where the terminal could grow.

const K = 4.6
const PAD = 10
const NORTH = 16
const X = ft => PAD + ft * K
const Y = ft => PAD + (ft + NORTH) * K
const VB_W = Math.round(PAD * 2 + 200 * K)
const VB_H = Math.round(PAD * 2 + (146 + NORTH) * K)

const row = y => [6, 47, 88].map(x => ({ x, y, w: 40, h: 8 }))
const [r1, r2, r3, r4, r5, r6] = [16, 25, 34, 43, 52, 61].map(row)
const BAYS = {
  receiving: [r1[0], r1[1]],
  frozen: [r1[2], r3[0]],
  cold: r2,
  dry: [r3[1], r3[2]],
  fulfillment: r4,
  staff: [r5[0]],
  kitchen: [r5[1], r5[2]],
  combined: [r6[0], r6[1]],
  greenhouse: [{ x: 136, y: 12, w: 30, h: 48 }, { x: 168, y: 12, w: 30, h: 48 }],
  eggGrading: [r6[2]],
  grainMill: [{ x: 136, y: 96, w: 40, h: 8 }],
  butchery: [{ x: 136, y: 104, w: 40, h: 8 }],
  hydroponic: [66, 75, 84].map(y => ({ x: 136, y, w: 40, h: 8 })),
  retail: [{ x: 6, y: 96, w: 40, h: 16 }, { x: 47, y: 96, w: 40, h: 16 }],
}

function Bay({ module, bay, filled, onAdd, onRemove }) {
  const x = X(bay.x)
  const y = Y(bay.y)
  const w = bay.w * K
  const h = bay.h * K
  const greenhouse = module.id === 'greenhouse'
  if (!filled) {
    return (
      <g className="cursor-pointer" onClick={onAdd} aria-hidden="true">
        <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="rgba(255,253,248,0.5)" stroke="#b8aa92" strokeWidth="1" strokeDasharray="4 3" rx="1.5" />
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fill="#a39580">+ {module.short}</text>
      </g>
    )
  }
  const ribs = []
  if (!greenhouse) for (let i = 1; i < bay.w / 1.5; i++) ribs.push(<line key={i} x1={x + i * 1.5 * K} x2={x + i * 1.5 * K} y1={y + 1} y2={y + h - 1} stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />)
  const dark = ['#2F5D50', '#802048', '#c8513b', '#5f8fb4', '#8a7b69', '#b5655a'].includes(module.color)
  return (
    <g className="vision-pop cursor-pointer" onClick={onRemove} aria-hidden="true">
      <rect x={x} y={y} width={w} height={h} fill={module.color} stroke="#3F3228" strokeWidth="1.1" rx="1" />
      {module.segments && module.segments.reduce((acc, seg) => {
        const sx = x + acc.at * K
        acc.els.push(
          <g key={seg.label}>
            <rect x={sx} y={y} width={seg.ft * K} height={h} fill={seg.color} stroke="#3F3228" strokeWidth={acc.at ? 0.9 : 0} />
            <text x={sx + (seg.ft * K) / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={seg.color === '#5f8fb4' ? '#fffdf8' : '#3F3228'}>{seg.label}</text>
          </g>,
        )
        acc.at += seg.ft
        return acc
      }, { at: 0, els: [] }).els}
      {module.segments && <rect x={x} y={y} width={w} height={h} fill="none" stroke="#3F3228" strokeWidth="1.1" rx="1" />}
      {ribs}
      {greenhouse && Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={x + 4} x2={x + w - 4} y1={y + 8 + i * (h - 16) / 5} y2={y + 8 + i * (h - 16) / 5} stroke="#7d9a5b" strokeWidth="3" strokeLinecap="round" />
      ))}
      {!module.segments && (
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={dark ? '#fffdf8' : '#3F3228'} paintOrder="stroke" stroke={greenhouse ? module.color : 'none'} strokeWidth="3">
          {module.short}
        </text>
      )}
    </g>
  )
}

function Arrow({ d, color, id }) {
  return <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeDasharray="7 5" markerEnd={`url(#${id})`} className="vision-flow" />
}

function SitePlan({ modules, dispatch, inBuilding }) {
  const trees = [[16, 82], [32, 87], [98, 86], [120, 82], [110, 88]]
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" role="img" aria-label="Site plan of the configured terminal. Use the module list to add or remove modules.">
      <defs>
        {[['arr-amber', '#c48a1f'], ['arr-terra', '#c8513b']].map(([id, c]) => (
          <marker key={id} id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={c} />
          </marker>
        ))}
        <pattern id="hatch-exp" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#c8bca9" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Roads */}
      <rect x={0} y={Y(-15)} width={VB_W} height={11 * K} fill="#d5c9b1" />
      <line x1={0} x2={VB_W} y1={Y(-9.5)} y2={Y(-9.5)} stroke="#f4eee2" strokeWidth="1.5" strokeDasharray="14 10" />
      <text x={X(2)} y={Y(-6)} fontSize="12" fill="#5f5244" fontWeight="600">Service road · producer &amp; freight access</text>
      <rect x={0} y={Y(133)} width={VB_W} height={12 * K} fill="#d5c9b1" />
      <line x1={0} x2={VB_W} y1={Y(139)} y2={Y(139)} stroke="#f4eee2" strokeWidth="1.5" strokeDasharray="14 10" />
      <text x={X(2)} y={Y(143)} fontSize="12" fill="#5f5244" fontWeight="600">County road · customer access</text>

      {/* Site */}
      <rect x={X(0)} y={Y(0)} width={200 * K} height={132 * K} fill="#ede5d3" stroke="#3F3228" strokeWidth="1.4" strokeDasharray="10 4 2 4" />

      {/* Producer lane */}
      <rect x={X(0)} y={Y(1)} width={132 * K} height={11 * K} fill="#e2d6bd" />
      <rect x={X(104)} y={Y(-4)} width={14 * K} height={6 * K} fill="#e2d6bd" />
      <Arrow id="arr-amber" color="#c48a1f" d={`M${X(111)},${Y(-6)} V${Y(6)} H${X(12)}`} />
      <text x={X(64)} y={Y(4.2)} textAnchor="middle" fontSize="11" fill="#7a5a17" fontWeight="600">Producer drop-off lane</text>

      {/* Courtyard */}
      <rect x={X(6)} y={Y(72)} width={122 * K} height={20 * K} fill="#f6efe0" stroke="#dccfb6" rx="6" />
      <text x={X(67)} y={Y(83.5)} textAnchor="middle" fontSize="12" fill="#6d5f50" fontWeight="600">Community courtyard</text>
      {trees.map(([tx, ty]) => <circle key={`${tx}-${ty}`} cx={X(tx)} cy={Y(ty)} r={4.5 * K} fill="#a4b787" stroke="#7d9a5b" strokeWidth="1" opacity="0.9" />)}
      {[[30, 76], [104, 76]].map(([tx, ty]) => <rect key={tx} x={X(tx)} y={Y(ty)} width={8 * K} height={3 * K} fill="#a07a52" rx="2" />)}

      {/* Pickup canopy (fixed) */}
      <rect x={X(88)} y={Y(96)} width={40 * K} height={16 * K} fill="#fffdf8" stroke="#3F3228" strokeWidth="1" strokeDasharray="3 3" />
      <text x={X(108)} y={Y(105)} textAnchor="middle" fontSize="11.5" fill="#3F3228" fontWeight="600">Customer pickup</text>

      {/* Future expansion */}
      <rect x={X(136)} y={Y(96)} width={62 * K} height={16 * K} fill="url(#hatch-exp)" stroke="#b8aa92" strokeDasharray="5 4" />
      <text x={X(187)} y={Y(103)} textAnchor="middle" fontSize="11" fill="#6d5f50" fontWeight="600" paintOrder="stroke" stroke="#ede5d3" strokeWidth="4">
        <tspan x={X(187)}>Future</tspan>
        <tspan x={X(187)} dy="13">expansion</tspan>
      </text>

      {/* Parking & customer circulation */}
      <rect x={X(0)} y={Y(116)} width={200 * K} height={16 * K} fill="#e2d6bd" />
      {Array.from({ length: 13 }, (_, i) => <line key={i} x1={X(8 + i * 10)} x2={X(8 + i * 10)} y1={Y(117)} y2={Y(124)} stroke="#fffdf8" strokeWidth="1.2" />)}
      <rect x={X(168)} y={Y(124)} width={14 * K} height={10 * K} fill="#e2d6bd" />
      <Arrow id="arr-terra" color="#c8513b" d={`M${X(175)},${Y(136)} V${Y(128)} H${X(10)}`} />
      <text x={X(150)} y={Y(130.6)} textAnchor="middle" fontSize="11" fill="#7a2f22" fontWeight="600">Customer parking</text>
      <path d={`M${X(66)},${Y(116)} V${Y(112.5)} M${X(108)},${Y(116)} V${Y(112.5)} M${X(46.5)},${Y(96)} V${Y(92)}`} stroke="#6d5f50" strokeWidth="1.5" strokeDasharray="2 3" />

      {/* Existing building option: modules sit inside leased space */}
      {inBuilding && (
        <g>
          <rect x={X(2)} y={Y(12)} width={129 * K} height={59.5 * K} fill="#e6dccb" stroke="#3F3228" strokeWidth="3" />
          <rect x={X(2) + 6} y={Y(12) + 6} width={129 * K - 12} height={59.5 * K - 12} fill="none" stroke="#3F3228" strokeWidth="0.8" strokeDasharray="2 3" />
          <text x={X(108)} y={Y(14.6)} textAnchor="middle" fontSize="12" fontWeight="700" fill="#3F3228" paintOrder="stroke" stroke="#e6dccb" strokeWidth="4">Existing building · leased space</text>
        </g>
      )}

      {/* Modules */}
      {MODULES.map(m => (BAYS[m.id] ?? []).map((bay, i) => (
        <Bay
          key={`${m.id}-${i}-${i < (modules[m.id] || 0)}`}
          module={m}
          bay={bay}
          filled={i < (modules[m.id] || 0)}
          onAdd={() => dispatch({ type: 'module', id: m.id, value: (modules[m.id] || 0) + 1 })}
          onRemove={() => dispatch({ type: 'module', id: m.id, value: (modules[m.id] || 0) - 1 })}
        />
      )))}

      {/* North arrow & scale */}
      <g transform={`translate(${X(186)} ${Y(-11)})`} aria-hidden="true">
        <path d="M0,-14 L6,6 L0,2 L-6,6 Z" fill="#3F3228" />
        <text x="0" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3F3228">N</text>
      </g>
      <g transform={`translate(${X(136)} ${Y(125)})`} aria-hidden="true" fontSize="10" fill="#5f5244">
        {[0, 1, 2, 3].map(i => <rect key={i} x={i * 10 * K} y={0} width={10 * K} height={4} fill={i % 2 ? '#fffdf8' : '#3F3228'} stroke="#3F3228" strokeWidth="0.6" />)}
        <text x={0} y={-3}>0</text>
        <text x={40 * K} y={-3} textAnchor="end">40 ft</text>
      </g>
    </svg>
  )
}

function Stepper({ m, value, dispatch, inBuilding }) {
  const set = v => dispatch({ type: 'module', id: m.id, value: v })
  const capex = Object.values(inBuilding && m.lean ? m.lean : m.capex).reduce((s, v) => s + v, 0)
  const btn = 'flex h-8 w-8 items-center justify-center rounded-full border border-[#d9cdbb] bg-white text-lg leading-none text-[#3F3228] transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary'
  return (
    <li className="flex items-center gap-3 py-2">
      <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-sm border border-[#3F3228]/40" style={{ background: m.color }} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-5 text-[#3F3228]">{m.name}</span>
        <span className="block text-xs text-[#8a7b69]">
          {fmtCadCompact(capex)} each · {m.containers ? `${m.containers} container${m.containers > 1 ? 's' : ''}` : 'structure'}
          {m.min > 0 && ' · required'}
        </span>
      </span>
      <span className="flex items-center gap-2">
        <button type="button" className={btn} disabled={value <= m.min} onClick={() => set(value - 1)} aria-label={`Remove one ${m.name}`}>−</button>
        <output className="w-5 text-center text-sm font-bold tabular-nums" aria-live="polite" aria-label={`${m.name} count`}>{value}</output>
        <button type="button" className={btn} disabled={value >= m.max} onClick={() => set(value + 1)} aria-label={`Add one ${m.name}`}>+</button>
      </span>
    </li>
  )
}

export default function TerminalBuilder() {
  const { state, dispatch, model } = useVision()
  const { capex, capacity } = model
  const streamsOn = new Set(MODULES.filter(m => state.modules[m.id] > 0).flatMap(m => m.streams))

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="vision-blueprint rounded-3xl border border-[#e2d8ca] p-2 sm:p-4">
          <SitePlan modules={state.modules} dispatch={dispatch} inBuilding={capex.inBuilding} />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-2 pt-2 text-xs text-[#6d5f50]">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-[#c48a1f]" />Producer circulation</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-[#c8513b]" />Customer circulation</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-sm border border-dashed border-[#b8aa92]" />Available bay</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#3F3228]">Modules</h3>
            <button type="button" onClick={() => dispatch({ type: 'resetModules' })} className="text-xs font-semibold text-[#2F5D50] hover:underline">Reset modules</button>
          </div>
          <ul className="mt-2 divide-y divide-[#efe6d8]">
            {MODULES.map(m => <Stepper key={m.id} m={m} value={state.modules[m.id]} dispatch={dispatch} inBuilding={capex.inBuilding} />)}
          </ul>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-live="polite">
        <Stat label="Facility footprint" value={fmtSqft(capex.buildingSqft)} sub={capex.inBuilding ? `${capex.containers} containers · inside a leased building` : `${capex.containers} containers · site ≈ ${fmtAcres(capex.siteSqft)}`} />
        <Stat label="Capital to provide" term="capex" value={fmtCadCompact(capex.total)} sub="Provided by partners, then leased" />
        <Stat label="Monthly operating costs" term="opex" value={fmtCad(model.operatingCosts)} sub="Incl. lease, at the market assumptions below" />
        <Stat label="Fulfillment capacity" value={`${fmtNum(capacity.ordersPerWeek)}/wk`} sub={`Forecast ${fmtNum(model.marketplaceOrdersWeekly)} online + ${fmtNum(model.wholesaleOrdersWeekly)} wholesale orders/wk`} tone={model.fulfillmentOrdersWeekly > capacity.ordersPerWeek ? 'bad' : 'default'} />
      </dl>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}><Term k="throughput">Storage & sales capacity</Term></h3>
          <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[#6d5f50]">Refrigerated</dt><dd className="text-right tabular-nums">{fmtCad(capacity.coldWeekly)}/wk</dd>
            <dt className="text-[#6d5f50]">Frozen</dt><dd className="text-right tabular-nums">{fmtCad(capacity.frozenWeekly)}/wk</dd>
            <dt className="text-[#6d5f50]">Dry</dt><dd className="text-right tabular-nums">{fmtCad(capacity.dryWeekly)}/wk</dd>
            <dt className="text-[#6d5f50]">Retail sales</dt><dd className="text-right tabular-nums">{fmtCad(capacity.retailAnnual)}/yr</dd>
            <dt className="text-[#6d5f50]">On-site growing</dt><dd className="text-right tabular-nums">{fmtCad(capacity.growAnnual)}/yr</dd>
            <dt className="text-[#6d5f50]">Kitchen hours to rent</dt><dd className="text-right tabular-nums">{fmtNum(capacity.kitchenHours)}/mo</dd>
          </dl>
        </div>
        <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>Potential revenue streams</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {Object.entries(STREAMS).map(([id, label]) => {
              const on = streamsOn.has(id)
              return (
                <li key={id} className={`rounded-full px-3 py-1 text-xs font-semibold ${on ? 'bg-[#2F5D50] text-white' : 'border border-dashed border-[#c8bca9] text-[#a39580]'}`}>
                  {on ? '✓ ' : ''}{label}<span className="sr-only">{on ? ' (enabled)' : ' (needs a module)'}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-xs leading-5 text-[#8a7b69]">Streams switch on as you add the modules that enable them. Their value depends on the market and operating assumptions in the next two sections.</p>
        </div>
      </div>

      <details className="group rounded-2xl border border-[#e2d8ca] bg-[#fffdf8]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-sm font-bold text-[#3F3228] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary">
          <span>What makes up the {fmtCad(model.operatingCosts)} a month?</span>
          <span aria-hidden="true" className="text-xl text-[#8a7b69] transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-[#efe6d8] p-5"><CostBreakdown /></div>
      </details>

      <Flags flags={model.flags} />
    </div>
  )
}
