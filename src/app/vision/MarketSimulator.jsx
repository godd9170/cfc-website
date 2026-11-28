'use client'

import { useMemo } from 'react'
import LineChart from './LineChart'
import { sweepCapture } from './model/calc.js'
import { PARAMS } from './model/config.js'
import { fmtCad, fmtCadCompact, fmtNum, fmtPct } from './model/format.js'
import { useVision } from './state'
import { ParamSlider, Stat, Term } from './ui'

const MARKET_KEYS = Object.keys(PARAMS).filter(k => PARAMS[k].group === 'market')

// Nested bars: regional spend ⊃ addressable ⊃ terminal sales.
function Funnel({ model }) {
  const rows = [
    { label: 'Total regional food expenditure', value: model.regionalSpend, color: '#d9cdbb' },
    { label: 'Addressable by regional producers', value: model.addressable, color: '#a4b787', term: 'addressable' },
    { label: 'Terminal sales (GMV)', value: model.annualSales, color: '#c8513b', term: 'gmv' },
  ]
  const max = rows[0].value || 1
  return (
    <div className="space-y-3">
      {rows.map(r => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-[#5f5244]">{r.term ? <Term k={r.term}>{r.label}</Term> : r.label}</span>
            <span className="font-semibold tabular-nums text-[#3F3228]">{fmtCad(r.value)}</span>
          </div>
          <div className="mt-1 h-3 w-full rounded-full bg-[#f3ecdf]">
            <div className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.max(0.6, (r.value / max) * 100)}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Where each dollar of terminal sales goes.
function SplitBar({ model }) {
  const total = model.totalGmv || 1
  const parts = [
    { label: 'Producer payouts', value: model.producerPayouts, color: '#2F5D50' },
    { label: 'Retained by terminal', value: model.totalRetained, color: '#e8b04a' },
  ]
  return (
    <div>
      <div className="flex h-8 w-full overflow-hidden rounded-lg">
        {parts.map(p => (
          <div key={p.label} className="flex items-center justify-center text-xs font-semibold text-white transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(p.value / total) * 100}%`, background: p.color }}>
            {p.value / total > 0.12 && fmtPct(p.value / total, 0)}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5f5244]">
        {parts.map(p => (
          <span key={p.label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function MarketSimulator() {
  const { state, dispatch, model } = useVision()
  const maxCapture = PARAMS.capturePct.max
  const sweep = useMemo(() => sweepCapture(state.a, state.modules, maxCapture, 60), [state.a, state.modules, maxCapture])
  const data = sweep.map(p => ({ x: p.capture, gmv: p.totalGmv, payouts: p.producerPayouts, retained: p.totalRetained }))

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#3F3228]">Market assumptions</h3>
          <button type="button" onClick={() => dispatch({ type: 'resetMarket' })} className="text-xs font-semibold text-[#2F5D50] hover:underline">Reset market</button>
        </div>
        <div className="mt-1 divide-y divide-[#efe6d8]">
          {MARKET_KEYS.map(k => <ParamSlider key={k} k={k} />)}
        </div>
      </div>

      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-3 xl:grid-cols-3" aria-live="polite">
          <Stat label="Regional food spending" value={fmtCadCompact(model.regionalSpend)} sub={`${fmtNum(model.households)} households${state.a.newHouseholds ? ` (incl. ${fmtNum(state.a.newHouseholds)} new)` : ''} × ${fmtCad(state.a.weeklySpend)}/wk × 52`} />
          <Stat label="Addressable market" term="addressable" value={fmtCadCompact(model.addressable)} sub={`${fmtPct(state.a.addressablePct)} of spending`} />
          <Stat label="Annual terminal sales" term="gmv" value={fmtCadCompact(model.totalGmv)} sub={`Households ${fmtCadCompact(model.annualSales)} (${fmtPct(model.capture, 1)} capture) + wholesale ${fmtCadCompact(model.wholesaleGmv)}`} tone="good" />
          <Stat label="Weekly orders (equivalent)" term="aov" value={fmtNum(model.weeklyOrders + model.wholesaleOrdersWeekly)} sub={`${fmtNum(model.weeklyOrders)} household at ${fmtCad(state.a.aov)} + ${fmtNum(model.wholesaleOrdersWeekly)} wholesale`} />
          <Stat label="Annual producer payouts" term="payouts" value={fmtCadCompact(model.producerPayouts)} sub="Retail and wholesale" />
          <Stat label="Terminal retained revenue" term="retained" value={fmtCadCompact(model.totalRetained)} sub={`Online effective commission ${fmtPct(model.effectiveCommission, 1)}`} />
        </dl>

        <div className="grid gap-5 rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>From regional demand to terminal sales</h3>
            <Funnel model={model} />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>Where each sales dollar goes</h3>
            <SplitBar model={model} />
            <p className="mt-3 text-xs leading-5 text-[#8a7b69]">
              Sales are gross merchandise value, not terminal revenue. Most of each dollar is paid to producers. Online sales use CFC’s fee-added model; retail uses a gross margin; on-site growing replaces purchased stock rather than adding sales.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>As market capture increases</h3>
          <p className="mb-3 text-xs text-[#8a7b69]">Annual values, including wholesale at its current level. Drag across the chart to read them.</p>
          <LineChart
            data={data}
            series={[
              { key: 'gmv', label: 'Terminal sales (GMV)', color: '#c8513b' },
              { key: 'payouts', label: 'Producer payouts', color: '#2F5D50' },
              { key: 'retained', label: 'Retained revenue', color: '#e8b04a' },
            ]}
            xFormat={x => fmtPct(x, x < 0.1 && x !== 0 ? 1 : 0)}
            yFormat={(y, full) => (full ? fmtCad(y) : fmtCadCompact(y))}
            xLabel="Market capture (share of addressable market)"
            markers={[{ x: model.capture, label: `Current ${fmtPct(model.capture, 1)}` }]}
            ariaLabel={`Line chart of annual terminal sales, producer payouts and retained revenue as market capture rises from 0 to ${fmtPct(maxCapture)}. At the current ${fmtPct(model.capture, 1)}: sales ${fmtCad(model.totalGmv)}, payouts ${fmtCad(model.producerPayouts)}, retained ${fmtCad(model.totalRetained)}.`}
          />
        </div>
      </div>
    </div>
  )
}
