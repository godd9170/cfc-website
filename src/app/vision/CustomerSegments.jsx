'use client'

import { WHOLESALE_SEGMENTS } from './model/config.js'
import { fmtCad, fmtCadCompact, fmtNum, fmtPct } from './model/format.js'
import { useVision } from './state'
import { ParamSlider } from './ui'

// Sales by customer segment: retail (households) and wholesale (businesses).

export default function CustomerSegments() {
  const { model } = useVision()
  const segs = model.segments
  const total = segs.reduce((s, x) => s + x.sales, 0) || 1
  const kept = segs.reduce((s, x) => s + x.kept, 0)
  const groups = ['Retail', 'Wholesale'].map(g => {
    const rows = segs.filter(s => s.group === g)
    return { g, rows, sales: rows.reduce((s, x) => s + x.sales, 0), kept: rows.reduce((s, x) => s + x.kept, 0) }
  })

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
        <h3 className="text-lg font-bold text-[#3F3228]">Wholesale customers</h3>
        <p className="mt-1 text-sm leading-6 text-[#6d5f50]">Businesses buying on top of household demand, modelled as accounts × average weekly order.</p>
        <div className="mt-1 divide-y divide-[#efe6d8]">
          {WHOLESALE_SEGMENTS.map(s => (
            <div key={s.id} className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <ParamSlider k={s.accounts} />
              <ParamSlider k={s.weekly} />
            </div>
          ))}
          <ParamSlider k="wholesaleMarginPct" />
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2d8ca] bg-[#fffdf8] p-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a7b69]" style={{ fontFamily: 'inherit' }}>Sales by customer segment</h3>

        <div className="mt-4 flex h-9 w-full overflow-hidden rounded-lg" role="img" aria-label={segs.map(s => `${s.label} ${fmtPct(s.sales / total, 0)}`).join(', ')}>
          {segs.filter(s => s.sales > 0).map(s => (
            <div key={s.id} className="flex items-center justify-center text-[11px] font-semibold text-white transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(s.sales / total) * 100}%`, background: s.color }} title={`${s.label}: ${fmtCad(s.sales)}`}>
              {s.sales / total > 0.09 && fmtPct(s.sales / total, 0)}
            </div>
          ))}
        </div>
        <div className="mt-2 flex text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a7b69]">
          <span style={{ width: `${(groups[0].sales / total) * 100}%` }} className="truncate">Retail · households</span>
          <span className="truncate">Wholesale</span>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[#e2d8ca] text-xs uppercase tracking-[0.1em] text-[#8a7b69]">
                <th scope="col" className="py-2 text-left font-semibold">Segment</th>
                <th scope="col" className="py-2 text-right font-semibold">Annual sales</th>
                <th scope="col" className="py-2 text-right font-semibold">Share</th>
                <th scope="col" className="py-2 text-right font-semibold">Terminal keeps</th>
                <th scope="col" className="py-2 text-right font-semibold">Orders/wk</th>
              </tr>
            </thead>
            {groups.map(({ g, rows, sales, kept: gKept }) => (
              <tbody key={g}>
                <tr className="bg-[#f6f1e7]">
                  <th scope="rowgroup" colSpan={1} className="px-2 py-1.5 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#3F3228]">{g === 'Retail' ? 'Retail (households)' : 'Wholesale (businesses)'}</th>
                  <td className="py-1.5 text-right text-xs font-bold tabular-nums text-[#3F3228]">{fmtCadCompact(sales)}</td>
                  <td className="py-1.5 text-right text-xs font-bold tabular-nums text-[#3F3228]">{fmtPct(sales / total, 0)}</td>
                  <td className="py-1.5 text-right text-xs font-bold tabular-nums text-[#3F3228]">{fmtCadCompact(gKept)}</td>
                  <td />
                </tr>
                {rows.map(r => (
                  <tr key={r.id} className="border-b border-[#f1e9dc]">
                    <th scope="row" className="py-2 pl-2 text-left font-normal text-[#3F3228]">
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
                        {r.label}
                        {r.accounts != null && <span className="text-xs text-[#8a7b69]">· {fmtNum(r.accounts)} accounts</span>}
                      </span>
                    </th>
                    <td className={`py-2 text-right tabular-nums ${r.sales ? 'text-[#3F3228]' : 'text-[#b5a892]'}`}>{fmtCadCompact(r.sales)}</td>
                    <td className="py-2 text-right tabular-nums text-[#6d5f50]">{fmtPct(r.sales / total, 0)}</td>
                    <td className="py-2 text-right tabular-nums text-[#6d5f50]">{fmtCadCompact(r.kept)}{r.sales > 0 && <span className="ml-1 text-xs text-[#8a7b69]">({fmtPct(r.kept / r.sales, 0)})</span>}</td>
                    <td className="py-2 text-right tabular-nums text-[#6d5f50]">{fmtNum(r.ordersWeekly)}</td>
                  </tr>
                ))}
              </tbody>
            ))}
            <tfoot>
              <tr>
                <th scope="row" className="pt-2 text-left font-semibold text-[#3F3228]">All customers</th>
                <td className="pt-2 text-right font-bold tabular-nums text-[#3F3228]">{fmtCadCompact(total)}</td>
                <td />
                <td className="pt-2 text-right font-bold tabular-nums text-[#3F3228]">{fmtCadCompact(kept)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#8a7b69]">
          Online and walk-in sales are consigned: the terminal keeps the consignment rate (and the full value of food grown on site); wholesale keeps the wholesale margin.
          Walk-in sales need a retail module. Wholesale orders count toward fulfillment capacity and are each delivered.
        </p>
      </div>
    </div>
  )
}
