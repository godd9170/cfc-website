import { Big_Shoulders } from 'next/font/google'
import growth from '../../data/growth.json'
import MonthlySalesChart from './MonthlySalesChart'
import { YEAR_COLOR, INK, MUSTARD } from './colors'

// Unlisted year-over-year growth report, shared directly (e.g. with grant
// funders). Not linked from the site, kept out of the sitemap and search
// results, and rendered without the site header (see Header.jsx).
// Numbers come from src/data/growth.json: refresh with
// `node scripts/sync-growth.js`.

const bigShoulders = Big_Shoulders({ subsets: ['latin'], axes: ['opsz'], display: 'swap', adjustFontFallback: false })
const display = { className: `${bigShoulders.className} font-black` }

export const metadata = {
  title: 'Year-over-year growth, 2025 to 2026',
  description: 'How County Farm Collective grew from its first season in 2025 to 2026: sales, producers, products and customers.',
  robots: { index: false, follow: false },
}

const A = growth.years['2025']
const B = growth.years['2026']

const cutoff = new Date(`${growth.cutoff}T12:00:00`)
const cutoffLong = cutoff.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
const cutoffShort = cutoff.toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })
const cutoffMonth = cutoff.getMonth() + 1
const openedLabel = new Date(`${A.firstDate}T12:00:00`).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })

const fmt = n => n.toLocaleString('en-CA')
const dollars = n => `$${fmt(n)}`
const roundDown = (n, to) => Math.floor(n / to) * to
const times = (b, a) => `${(b / a).toFixed(1)}×`
const pct = (n, d) => `${Math.round((n / d) * 100)}%`

// Like-for-like: the same calendar months in both years.
const sameMonths = Object.keys(A.months).map(Number).filter(m => m <= cutoffMonth)
const sumMonths = (y, months) => months.reduce((s, m) => s + (y.months[m]?.sales ?? 0), 0)
const samePeriodA = sumMonths(A, sameMonths)
const samePeriodB = sumMonths(B, sameMonths)
const monthName = m => new Date(2026, m - 1, 1).toLocaleDateString('en-CA', { month: 'long' })

const bars = [
  ...Object.entries(A.months).map(([m, v]) => ({ year: 2025, month: Number(m), ...v })),
  ...Object.entries(B.months).map(([m, v]) => ({ year: 2026, month: Number(m), ...v })),
].map(b => ({ ...b, key: `${b.year}-${b.month}`, partial: b.year === 2026 && b.month === cutoffMonth }))

const peak2026 = bars.filter(b => b.year === 2026).reduce((a, b) => (b.sales > a.sales ? b : a))
const winter2026 = [1, 2, 3].reduce((s, m) => s + (B.months[m]?.sales ?? 0), 0)

const returningVendors = B.vendorNames.filter(v => !B.newVendorNames.includes(v))
const allReturned = returningVendors.length === A.vendors

const METRICS = [
  { label: 'Sales', a: A.sales, b: B.sales, format: dollars, note: 'in local food sold through the Collective' },
  { label: 'Producers', a: A.vendors, b: B.vendors, format: fmt, note: 'local farms and food makers on the shelf' },
  { label: 'Products', a: A.products, b: B.products, format: fmt, note: 'different products ordered by customers' },
  { label: 'Customers', a: A.customers, b: B.customers, format: fmt, note: 'households who placed an order' },
]

function Heading({ children, aside }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <h2 className={`${display.className} text-4xl uppercase leading-none tracking-tight sm:text-5xl`} style={{ color: INK }}>
        {children}
      </h2>
      {aside && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b5a4f]">{aside}</p>}
    </div>
  )
}

function GrowthCard({ label, a, b, format, note }) {
  const max = Math.max(a, b)
  return (
    <div className="flex flex-col border-t-4 pt-4" style={{ borderColor: INK }}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: INK, fontFamily: 'inherit' }}>{label}</h3>
        <span className={`${display.className} text-3xl leading-none`} style={{ color: YEAR_COLOR[2026] }}>{times(b, a)}</span>
      </div>
      <dl className="mt-4 space-y-3">
        {[[2025, a], [2026, b]].map(([year, v]) => (
          <div key={year}>
            <div className="flex items-baseline justify-between">
              <dt className="text-xs font-semibold text-[#4b5a4f]">{year}</dt>
              <dd className={`${display.className} text-[2.5rem] leading-none tabular-nums`} style={{ color: INK }}>{format(v)}</dd>
            </div>
            <div className="mt-1.5 h-2.5 w-full rounded-full bg-[#1f3a2b]/10">
              <div className="h-full rounded-full" style={{ width: `${(v / max) * 100}%`, background: YEAR_COLOR[year] }} />
            </div>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm leading-5 text-[#4b5a4f]">{note}</p>
    </div>
  )
}

export default function GrowthPage() {
  return (
    <div className="bg-[#efefe3] text-[#1f3a2b]">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        {/* Masthead */}
        <header className="flex flex-wrap items-end justify-between gap-6 border-b-2 pb-6" style={{ borderColor: INK }}>
          <div>
            <p className={`${display.className} text-6xl uppercase leading-[0.85] tracking-tight sm:text-8xl`} style={{ color: INK }}>County Farm</p>
            <p className={`${display.className} text-6xl uppercase leading-[0.85] tracking-tight sm:text-8xl`} style={{ color: MUSTARD }}>Collective</p>
          </div>
          <div className="text-right">
            <h1 className={`${display.className} text-6xl leading-none sm:text-7xl`} style={{ color: YEAR_COLOR[2026] }}>
              2025<span style={{ color: INK }}> → </span>2026
            </h1>
            <p className={`${display.className} mt-1 text-2xl uppercase tracking-wide`} style={{ color: INK }}>Year-over-year growth</p>
          </div>
          <p className="w-full text-sm text-[#4b5a4f]">
            First season {openedLabel} – December 2025, compared with January 1 – {cutoffLong}
            <span className="mx-2">·</span>Prince Edward County, Ontario
          </p>
        </header>

        {/* Hero */}
        <section className="mt-8 rounded-sm px-6 py-8 text-[#f4f1e6] sm:px-10 sm:py-10" style={{ background: INK }}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: MUSTARD }}>In our second year we sold</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-10 gap-y-4">
            <p className={`${display.className} text-7xl leading-none sm:text-[9rem]`}>{dollars(roundDown(B.sales, 100))}<span className="align-top text-5xl sm:text-7xl" style={{ color: MUSTARD }}>+</span></p>
            <p className="max-w-xs text-lg leading-7">
              of local food, <strong style={{ color: MUSTARD }}>{times(B.sales, A.sales)} our first season</strong>,
              across {fmt(B.orders)} orders packed and handed off.
            </p>
          </div>
          <div className="mt-8 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-2">
            <p className="text-sm leading-6">
              <span className={`${display.className} mr-2 text-3xl`} style={{ color: MUSTARD }}>{times(samePeriodB, samePeriodA)}</span>
              sales over the same months, {monthName(sameMonths[0])} to {monthName(sameMonths.at(-1))}: {dollars(roundDown(samePeriodA, 100))} in 2025, {dollars(roundDown(samePeriodB, 100))} in 2026 (with {monthName(cutoffMonth)} 2026 still in progress)
            </p>
            <p className="text-sm leading-6">
              <span className={`${display.className} mr-2 text-3xl`} style={{ color: MUSTARD }}>{dollars(roundDown(A.producerPayout + B.producerPayout, 1000))}+</span>
              paid to local producers since we opened in {openedLabel}
            </p>
          </div>
        </section>

        {/* Four growth metrics */}
        <section className="mt-14" aria-labelledby="growth-heading">
          <Heading aside={`2025 season vs. 2026 to ${cutoffShort}`}><span id="growth-heading">Every number grew</span></Heading>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map(m => <GrowthCard key={m.label} {...m} />)}
          </div>
        </section>

        {/* Monthly timeline */}
        <section className="mt-16 rounded-sm bg-[#e5e6d6] p-5 sm:p-8" aria-labelledby="timeline-heading">
          <Heading aside="Sales by month, in thousands of dollars"><span id="timeline-heading">A business that kept growing</span></Heading>
          <MonthlySalesChart
            bars={bars}
            cutoffLabel={cutoffShort}
            partialNote={`${monthName(cutoffMonth)} 2026, through the ${cutoff.getDate()}th`}
          />
          <div className="mt-6 grid gap-4 text-sm leading-6 text-[#33463a] sm:grid-cols-3">
            <p><strong style={{ color: INK }}>Open year-round.</strong> The first season ended in December. In 2026 we stayed open through the winter, selling {dollars(roundDown(winter2026, 100))} from January to March.</p>
            <p><strong style={{ color: INK }}>Busiest month: {monthName(peak2026.month)} 2026.</strong> {dollars(peak2026.sales)} in sales across {peak2026.orders} orders, more than any month of our first season.</p>
            <p><strong style={{ color: INK }}>{fmt(B.orders)} orders</strong> in 2026, up from {fmt(A.orders)} in 2025: {times(B.orders, A.orders)} as many.</p>
          </div>
        </section>

        {/* Customers + fulfillment */}
        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <Heading>Customers came back</Heading>
            <dl className="space-y-6">
              <div className="flex items-baseline gap-4 border-t pt-4" style={{ borderColor: `${INK}33` }}>
                <dt className={`${display.className} w-28 shrink-0 text-5xl leading-none`} style={{ color: YEAR_COLOR[2026] }}>{pct(B.returningFromPriorYear, A.customers)}</dt>
                <dd className="text-sm leading-6 text-[#33463a]">of first-season households ordered again in 2026 ({B.returningFromPriorYear} of {A.customers})</dd>
              </div>
              <div className="flex items-baseline gap-4 border-t pt-4" style={{ borderColor: `${INK}33` }}>
                <dt className={`${display.className} w-28 shrink-0 text-5xl leading-none`} style={{ color: YEAR_COLOR[2026] }}>{pct(B.repeatCustomers, B.customers)}</dt>
                <dd className="text-sm leading-6 text-[#33463a]">of 2026 customers ordered more than once ({B.repeatCustomers} of {B.customers})</dd>
              </div>
              <div className="flex items-baseline gap-4 border-t pt-4" style={{ borderColor: `${INK}33` }}>
                <dt className={`${display.className} w-28 shrink-0 text-5xl leading-none`} style={{ color: YEAR_COLOR[2026] }}>{fmt(B.customers - B.returningFromPriorYear)}</dt>
                <dd className="text-sm leading-6 text-[#33463a]">new households ordered for the first time in 2026</dd>
              </div>
            </dl>
          </div>

          <div>
            <Heading>More ways to get food home</Heading>
            <p className="mb-5 text-sm leading-6 text-[#33463a]">
              Our first season was almost all home delivery. In 2026 we added community pickup spots, and pickup became the most common way to collect an order.
            </p>
            <div className="space-y-5">
              {[[2025, A], [2026, B]].map(([year, y]) => {
                const total = y.fulfillment.delivery + y.fulfillment.pickup
                return (
                  <div key={year}>
                    <div className="mb-1.5 flex justify-between text-xs font-semibold text-[#4b5a4f]">
                      <span>{year}</span>
                      <span className="tabular-nums">{fmt(total)} orders</span>
                    </div>
                    <div className="flex h-9 gap-0.5 overflow-hidden rounded-sm text-xs font-semibold">
                      <div className="flex items-center whitespace-nowrap px-2 text-white" style={{ width: `${(y.fulfillment.delivery / total) * 100}%`, background: INK }}>
                        {fmt(y.fulfillment.delivery)} delivered
                      </div>
                      <div className="flex items-center justify-end whitespace-nowrap px-2" style={{ width: `${(y.fulfillment.pickup / total) * 100}%`, background: MUSTARD, color: INK }}>
                        {y.fulfillment.pickup / total > 0.2 ? `${fmt(y.fulfillment.pickup)} picked up` : fmt(y.fulfillment.pickup)}
                      </div>
                    </div>
                  </div>
                )
              })}
              <p className="flex gap-5 text-xs text-[#4b5a4f]">
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: INK }} />Delivered</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: MUSTARD }} />Picked up</span>
              </p>
            </div>
          </div>
        </section>

        {/* Producers */}
        <section className="mt-16" aria-labelledby="producers-heading">
          <Heading aside={allReturned ? `Every first-season producer came back` : undefined}>
            <span id="producers-heading">From {A.vendors} producers to {B.vendors}</span>
          </Heading>
          <ul className="flex flex-wrap gap-2">
            {returningVendors.map(v => (
              <li key={v} className="rounded-full border-2 px-3.5 py-1.5 text-sm font-medium" style={{ borderColor: INK, color: INK }}>{v}</li>
            ))}
            {B.newVendorNames.map(v => (
              <li key={v} className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white" style={{ background: YEAR_COLOR[2026], border: `2px solid ${YEAR_COLOR[2026]}` }}>
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex flex-wrap gap-5 text-xs text-[#4b5a4f]">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2" style={{ borderColor: INK }} />With us since 2025 ({returningVendors.length})</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: YEAR_COLOR[2026] }} />Joined in 2026 ({B.newVendorNames.length})</span>
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t-2 pt-6" style={{ borderColor: INK }}>
          <p className={`${display.className} text-4xl uppercase leading-none sm:text-6xl`} style={{ color: INK }}>countyfarmcollective.com</p>
          <p className="mt-4 max-w-xl text-xs leading-5 text-[#4b5a4f]">
            Source: County Farm Collective orders on Local Line, by fulfillment date, {openedLabel} to {cutoffLong}.
            Excludes draft and cancelled orders. Sales are order subtotals before tax and delivery fees. Producer payouts are line-item sales at each producer&apos;s own price, before the Collective&apos;s markup. Products counts distinct products ordered.
          </p>
        </footer>
      </div>
    </div>
  )
}
