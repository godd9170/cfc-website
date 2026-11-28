'use client'

import { useMemo } from 'react'
import LineChart from './LineChart'
import CostBreakdown from './CostBreakdown'
import { computeModel, sweepCapture } from './model/calc.js'
import { CAPEX_CATEGORIES, PARAMS, PARAM_GROUPS, SCENARIOS, STREAMS, scenarioAssumptions, scenarioModules } from './model/config.js'
import { fmtCad, fmtCadCompact, fmtNum, fmtPct } from './model/format.js'
import { useVision } from './state'
import { Flags, ParamField, ParamSlider, Stat, Term } from './ui'

function Breakdown({ title, term, rows, total, totalLabel, note }) {
  return (
    <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>
        {term ? <Term k={term}>{title}</Term> : title}
      </h3>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-[#f1e9dc]">
              <th scope="row" className="py-1.5 pr-3 text-left font-normal text-[#5f5244]">{label}</th>
              <td className={`py-1.5 text-right tabular-nums ${value === 0 ? 'text-[#b5a892]' : 'text-[#3F3228]'}`}>{fmtCad(value)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="pt-2 text-left font-semibold text-[#3F3228]">{totalLabel}</th>
            <td className="pt-2 text-right font-bold tabular-nums text-[#3F3228]">{fmtCad(total)}</td>
          </tr>
        </tfoot>
      </table>
      {note && <p className="mt-3 text-xs leading-5 text-[#8a7b69]">{note}</p>}
    </div>
  )
}

function BreakEvenText({ be, model }) {
  if (!be) return 'Not reached within the addressable market'
  return `${fmtCadCompact(be.annualSales)}/yr · ${fmtPct(be.capture, 1)} capture · ~${fmtNum(be.weeklyOrders)} orders/wk${be.annualSales <= model.annualSales ? ' (reached)' : ''}`
}

function Comparison({ state }) {
  const cols = useMemo(() => {
    const list = SCENARIOS.map(s => ({ id: s.id, label: s.label, m: computeModel(scenarioAssumptions(s.id), scenarioModules(s.id)) }))
    if (state.customized) list.push({ id: 'current', label: 'Your scenario', m: computeModel(state.a, state.modules) })
    return list
  }, [state])

  const rows = [
    ['Terminal size', m => `${fmtNum(m.capex.containers)} containers · ${fmtNum(m.capex.buildingSqft)} sq ft`],
    ['Market capture', m => fmtPct(m.capture, 1)],
    ['Annual terminal sales (GMV)', m => fmtCadCompact(m.annualSales)],
    ['Annual producer payouts', m => fmtCadCompact(m.producerPayouts)],
    ['Monthly income', m => fmtCad(m.tradingIncome + m.serviceIncome)],
    ['Monthly operating costs', m => fmtCad(m.operatingCosts)],
    ['Monthly operating surplus', m => fmtCad(m.surplus), m => (m.surplus >= 0 ? 'text-[#2F5D50]' : 'text-brand-primary-dark')],
    ['Capital to provide (partners)', m => fmtCadCompact(m.capex.total)],
    ['Break-even capture', m => (m.breakEven ? fmtPct(m.breakEven.capture, 1) : 'Not reached')],
  ]

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e2d8ca] bg-[#fffdf8]">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">Scenario comparison. Each scenario uses its own terminal configuration.</caption>
        <thead>
          <tr className="border-b border-[#e2d8ca] text-left">
            <th scope="col" className="p-3 font-semibold text-[#8a7b69]">Each with its own terminal size</th>
            {cols.map(c => (
              <th key={c.id} scope="col" className={`p-3 text-right font-bold ${c.id === state.scenario && !state.customized ? 'text-brand-primary' : c.id === 'current' ? 'text-[#2F5D50]' : 'text-[#3F3228]'}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, f, tone]) => (
            <tr key={label} className="border-b border-[#f1e9dc] last:border-0">
              <th scope="row" className="p-3 text-left font-normal text-[#5f5244]">{label}</th>
              {cols.map(c => <td key={c.id} className={`p-3 text-right tabular-nums ${tone ? tone(c.m) : 'text-[#3F3228]'}`}>{f(c.m)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function OperatingModel() {
  const { state, model } = useVision()
  const { capex, income } = model

  const xMax = Math.min(1, Math.ceil(Math.max(0.3, (model.breakEven?.capture ?? 0) * 1.3) * 20) / 20)
  const sweep = useMemo(() => sweepCapture(state.a, state.modules, xMax, 60), [state.a, state.modules, xMax])
  const data = sweep.map(p => ({ x: p.capture, income: p.tradingIncome + p.serviceIncome, costs: p.operatingCosts }))
  const markers = [{ x: model.capture, label: `Current ${fmtPct(model.capture, 1)}` }]
  if (model.breakEven && model.breakEven.capture > 0) markers.push({ x: model.breakEven.capture, label: 'Break-even', color: '#2F5D50', row: 1 })

  const surplusTone = model.surplus >= 0 ? 'good' : 'bad'

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <dl className="grid grid-cols-2 content-start gap-3" aria-live="polite">
          <Stat label="Retained trading income" term="retained" value={`${fmtCad(model.tradingIncome)}`} sub="per month · marketplace fees, retail & on-site margin" />
          <Stat label="Net service income" value={fmtCad(model.serviceIncome)} sub="per month · wholesale, storage & producer services" />
          <Stat label="Operating costs" term="opex" value={fmtCad(model.operatingCosts)} sub={<>per month, including the facility lease · <a href="#cost-breakdown" className="font-semibold text-[#2F5D50] hover:underline">see breakdown</a></>} />
          <Stat label={model.surplus >= 0 ? 'Operating surplus' : 'Operating deficit'} term="surplus" value={fmtCad(model.surplus)} sub="per month, pre-tax" tone={surplusTone} />
          <div className="col-span-2">
            <Stat label="Break-even sales volume" term="breakEven" value={model.breakEven ? fmtCadCompact(model.breakEven.annualSales) : 'Not reached'} sub={<BreakEvenText be={model.breakEven} model={model} />} />
          </div>
          <div className="col-span-2">
            <Stat label="Capital to provide" term="capex" value={fmtCadCompact(capex.total)} sub="One-time setup, assumed to be provided by partners and leased to CFC, so it isn’t repaid from the terminal’s operating income here." />
          </div>
        </dl>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
            <ParamSlider k="capturePct" />
          </div>
          <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
            <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>Monthly income vs costs as capture grows</h3>
            <p className="mb-3 text-xs text-[#8a7b69]">The terminal sustains itself where the income line crosses above the cost line.</p>
            <LineChart
              data={data}
              series={[
                { key: 'income', label: 'Monthly income', color: '#2F5D50' },
                { key: 'costs', label: 'Operating costs', color: '#c8513b' },
              ]}
              xFormat={x => fmtPct(x, x < 0.1 && x !== 0 ? 1 : 0)}
              yFormat={(y, full) => (full ? fmtCad(y) : fmtCadCompact(y))}
              xLabel="Market capture"
              markers={markers}
              ariaLabel={`Monthly income and operating costs as market capture rises to ${fmtPct(xMax)}. ${model.breakEven ? `Income covers operating costs from about ${fmtPct(model.breakEven.capture, 1)} capture.` : 'Income does not cover operating costs within this range.'}`}
            />
          </div>
        </div>
      </div>

      <Flags flags={model.flags} />

      <div id="cost-breakdown" className="scroll-mt-28 rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}><Term k="opex">Monthly operating costs, and what drives them</Term></h3>
        <div className="mt-3"><CostBreakdown /></div>
        <p className="mt-3 text-xs leading-5 text-[#8a7b69]">Every driver is editable under “Edit every operating assumption” below. Module staffing and energy are set per module.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Breakdown
          title="Capital to provide"
          term="capex"
          rows={CAPEX_CATEGORIES.map(c => [c.label, capex.cats[c.id]])}
          total={capex.total}
          totalLabel="Total one-time setup"
          note={`Site ${fmtCadCompact(capex.groups.site)} + modules ${fmtCadCompact(capex.groups.modules)} + shared infrastructure ${fmtCadCompact(capex.groups.shared)} + fees ${fmtCadCompact(capex.groups.fees)} + contingency ${fmtCadCompact(capex.groups.contingency)}. Assumed to be provided by partners; CFC pays the facility lease.`}
        />
        <Breakdown
          title="Monthly income streams"
          rows={Object.entries(STREAMS).map(([k, label]) => [label, income[k]])}
          total={model.tradingIncome + model.serviceIncome}
          totalLabel="Total per month"
          note={`Annual producer payouts: ${fmtCadCompact(model.producerPayouts)} on ${fmtCadCompact(model.totalGmv)} total sales including wholesale.`}
        />
      </div>

      <details className="group rounded-2xl border border-[#e2d8ca] bg-[#fffdf8]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-bold text-[#3F3228] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary">
          <span>Edit every operating assumption</span>
          <span aria-hidden="true" className="text-xl text-[#8a7b69] transition group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-x-8 gap-y-6 border-t border-[#efe6d8] p-5 md:grid-cols-2">
          {PARAM_GROUPS.filter(g => g.id !== 'market').map(g => (
            <fieldset key={g.id}>
              <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7b69]">{g.label}</legend>
              {Object.keys(PARAMS).filter(k => PARAMS[k].group === g.id).map(k => <ParamField key={k} k={k} />)}
            </fieldset>
          ))}
          <p className="text-xs leading-5 text-[#8a7b69] md:col-span-2">Market assumptions are edited in the Regional Market Simulator above. Module costs and capacities are set per module in the Build Your Own Food Terminal section.</p>
        </div>
      </details>

      <div>
        <h3 className="mb-3 text-lg font-bold text-[#3F3228]">Compare scenarios</h3>
        <Comparison state={state} />
      </div>

      <div className="rounded-2xl border border-[#e2d8ca] bg-[#f3ecdf] p-5 text-xs leading-5 text-[#5f5244]">
        <p className="font-semibold text-[#3F3228]">How these figures are calculated</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Households = population ÷ household size. Regional spending = households × weekly spending × 52. Terminal sales = regional spending × addressable share × capture.</li>
          <li>Marketplace income uses CFC’s fee-added model: effective commission = fee ÷ (1 + fee). Retail income is retail sales × gross margin. Producer payouts are sales minus what the terminal retains.</li>
          <li>On-site growing is sold through the retail market. It adds the cost of goods the shop would otherwise pay producers, not extra sales, so it is never double-counted. Output beyond retail sales is excluded.</li>
          <li>Break-even holds the sales mix and every other assumption fixed, then searches for the capture at which income covers fixed and variable costs. It ignores capacity limits.</li>
          <li><strong>Facilities:</strong> the facilities are assumed to be provided by partners and leased to CFC. The capital figure is what partners or funders would need to put in; CFC’s cost is the monthly facility lease, so no loan repayments or capital payback are modelled. <strong>Tax:</strong> all figures are pre-tax; income tax, HST, depreciation and inflation are not modelled.</li>
          <li>Every figure is an illustrative assumption in CAD, not CFC financial data or a verified construction quotation.</li>
        </ul>
      </div>
    </div>
  )
}
