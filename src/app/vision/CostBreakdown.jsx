'use client'

import { MODULES } from './model/config.js'
import { fmtCad, fmtNum } from './model/format.js'
import { useVision } from './state'
import { InlineParam } from './ui'

// Monthly operating costs, line by line, with what drives each and the
// drivers editable in place. Shown in the builder and the operating model.

const FTE_HOURS = 40

export default function CostBreakdown() {
  const { state, model, dispatch } = useVision()
  const a = state.a
  const { costs, costParts: p } = model
  const staffedModules = MODULES.filter(m => state.modules[m.id] > 0 && `staff_${m.id}` in a)
  const biggestEnergy = MODULES.filter(m => state.modules[m.id] > 0)
    .map(m => ({ m, v: m.monthly.energy * state.modules[m.id] }))
    .sort((x, y) => y.v - x.v)
    .slice(0, 3)
    .map(({ m, v }) => `${m.short.toLowerCase()} ${fmtCad(v)}`)

  const totalHours = p.coreHours + p.moduleHours + p.packingHours + p.serviceHours
  const leasing = a.tenure !== 'own'

  const rows = [
    {
      label: 'Labour', value: costs.labour,
      parts: [
        [`Core operations, ${fmtNum(p.coreHours)} hr/wk`, p.coreStaff],
        ...staffedModules.map(m => [
          `${m.name}, ${fmtNum(a[`staff_${m.id}`] * state.modules[m.id])} hr/wk`,
          a[`staff_${m.id}`] * state.modules[m.id] * a.wageHourly * (52 / 12),
        ]),
        [`Packing ${fmtNum(p.ordersMonthly)} online + ${fmtNum(p.wholesaleOrdersMonthly)} wholesale orders a month`, p.packing],
        ...(p.serviceStaff > 0 ? [['Shared producer services', p.serviceStaff]] : []),
      ],
      params: [
        ['coreStaffHours', 'Core hours/wk'],
        ...staffedModules.map(m => [`staff_${m.id}`, `${m.short} hours/wk`]),
        ['packMinutesPerOrder', 'Packing per online order'],
        ['wholesalePackMinutes', 'Per wholesale order'],
        ['wageHourly', 'Loaded wage'],
      ],
    },
    {
      label: 'Facility lease', value: costs.rent,
      note: leasing ? 'Paid to whoever provides the facilities' : 'None: land is owned',
      params: leasing ? [['leaseMonthly', 'Lease']] : [],
    },
    {
      label: 'Electricity and heating', value: costs.energy,
      note: `Site base + modules${biggestEnergy.length ? ` (largest: ${biggestEnergy.join(', ')})` : ''}`,
      params: [['siteBaseEnergyMonthly', 'Site base']],
    },
    { label: 'Water', value: costs.water, note: 'Site base plus washrooms, kitchen and growing', params: [['siteBaseWaterMonthly', 'Site base']] },
    {
      label: 'Insurance', value: costs.insurance,
      note: 'Liability, plus equipment and contents as a share of capital a year',
      params: [['insuranceBaseMonthly', 'Liability'], ['insurancePctCapex', 'Equipment & contents']],
    },
    {
      label: 'Delivery (net of fees)', value: costs.delivery,
      note: `${fmtNum(p.deliveriesMonthly)} household deliveries × (cost − fee), plus ${fmtNum(p.wholesaleOrdersMonthly)} wholesale drops at cost`,
      params: [['deliveryShare', 'Orders delivered'], ['deliveryCost', 'Cost each'], ['deliveryFee', 'Fee charged']],
    },
    {
      label: 'Software and payment processing', value: costs.software,
      note: `Payment processing alone is ${fmtCad(p.paymentFees)}`,
      params: [['softwareMonthly', 'Software'], ['paymentPct', 'Card fees']],
    },
    { label: 'Maintenance', value: costs.maintenance, note: 'Day-to-day upkeep; major repairs are the owner’s', params: [['maintenancePctCapex', 'Of capital a year']] },
    { label: 'Inventory loss', value: costs.inventoryLoss, params: [['retailShrinkPct', 'Retail stock'], ['marketplaceLossPct', 'Online sales']] },
  ]
  const total = model.operatingCosts

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f3ecdf] px-4 py-3">
        <p className="text-sm text-[#3F3228]">
          <strong className="font-semibold">Paid staff: {fmtNum(totalHours)} hours a week</strong>
          <span className="text-[#6d5f50]"> ≈ {(totalHours / FTE_HOURS).toFixed(1)} full-time equivalents</span>
        </p>
        <p className="text-xs text-[#8a7b69]">Edit any number below; the whole page updates.</p>
      </div>

      <table className="w-full text-sm">
        <caption className="sr-only">Monthly operating costs by line, with editable drivers</caption>
        <tbody>
          {rows.map(r => (
            <tr key={r.label} className="border-b border-[#f1e9dc] align-top">
              <th scope="row" className="py-3 pr-3 text-left font-normal">
                <span className="flex items-center gap-2 font-medium text-[#3F3228]">
                  {r.label}
                  {total > 0 && (
                    <span className="hidden h-1.5 rounded-full bg-[#c8513b]/70 sm:inline-block" style={{ width: `${Math.max(2, (r.value / total) * 120)}px` }} aria-hidden="true" />
                  )}
                </span>
                {r.note && <span className="mt-0.5 block text-xs leading-5 text-[#8a7b69]">{r.note}</span>}
                {r.parts && (
                  <ul className="mt-1 max-w-xl space-y-0.5">
                    {r.parts.map(([label, v]) => (
                      <li key={label} className="flex justify-between gap-3 text-xs leading-5 text-[#8a7b69]">
                        <span>{label}</span>
                        <span className="shrink-0 tabular-nums">{fmtCad(v)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {r.params?.length > 0 && (
                  <span className="mt-2 flex flex-wrap gap-2">
                    {r.params.map(([k, label]) => <InlineParam key={k} k={k} label={label} />)}
                  </span>
                )}
              </th>
              <td className={`py-3 text-right tabular-nums ${r.value === 0 ? 'text-[#b5a892]' : 'text-[#3F3228]'}`}>{fmtCad(r.value)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="pt-3 text-left font-semibold text-[#3F3228]">Total per month</th>
            <td className="pt-3 text-right font-bold tabular-nums text-[#3F3228]">{fmtCad(total)}</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-3 text-xs leading-5 text-[#8a7b69]">
        Staffing is paid hours per week at {fmtCad(a.wageHourly)}/hr loaded; {FTE_HOURS} hours is one full-time person. Unpaid owner or volunteer time is not counted.
        <button type="button" onClick={() => dispatch({ type: 'resetAssumptions' })} className="ml-2 font-semibold text-[#2F5D50] hover:underline">Reset assumptions to the scenario</button>
      </p>
    </div>
  )
}
