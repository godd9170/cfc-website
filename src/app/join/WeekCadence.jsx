// A one-week timeline (Sunday → Saturday) showing when ordering is open,
// when farms harvest, and when orders go out. Positions are fractions of
// the week, so bars line up with the real times.
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const at = (day, hour = 0) => ((day + hour / 24) / 7) * 100

const PHASES = [
  {
    key: 'order',
    label: 'Order window',
    when: 'Sunday noon – Tuesday 2pm',
    detail: 'Shop what County farms have this week. No minimums, no subscription.',
    from: at(0, 12),
    to: at(2, 14),
    color: 'bg-[#2F5D50]',
    text: 'text-[#f7f4ed]',
  },
  {
    key: 'harvest',
    label: 'Harvest',
    when: 'Wednesday',
    detail: 'Farms pick and pack for your order, not for a shelf.',
    from: at(3),
    to: at(4),
    color: 'bg-brand-sage',
    text: 'text-[#2c3a22]',
  },
  {
    key: 'delivery',
    label: 'Delivery',
    when: 'Thursday 12–5pm',
    detail: 'Pick up in Picton or Wellington, or get it delivered. Free delivery over $75.',
    from: at(4),
    to: at(5),
    color: 'bg-brand-primary',
    text: 'text-[#f7f4ed]',
  },
]

export default function WeekCadence() {
  return (
    <figure>
      <div className="relative">
        {/* Day labels */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7b69]">
          {DAYS.map((d) => (
            <span key={d} className="pb-2">{d}</span>
          ))}
        </div>

        {/* Track */}
        <div className="relative h-14 overflow-hidden rounded-xl border border-[#e2d8ca] bg-[#fffdf8] sm:h-16">
          <div className="absolute inset-0 grid grid-cols-7" aria-hidden="true">
            {DAYS.map((d, i) => (
              <span key={d} className={i ? 'border-l border-[#efe7da]' : ''} />
            ))}
          </div>
          {PHASES.map((p) => (
            <div
              key={p.key}
              className={`absolute inset-y-2 flex items-center justify-center rounded-lg ${p.color} ${p.text}`}
              style={{ left: `calc(${p.from}% + 3px)`, width: `calc(${p.to - p.from}% - 6px)` }}
            >
              <span className="hidden truncate px-2 text-xs font-semibold sm:block">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <figcaption className="mt-6 grid gap-5 sm:grid-cols-3">
        {PHASES.map((p) => (
          <div key={p.key} className="flex gap-3">
            <span className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${p.color}`} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[#3F3228]">{p.label}</p>
              <p className="text-sm text-[#3F3228]">{p.when}</p>
              <p className="mt-1 text-sm leading-6 text-[#6d5f50]">{p.detail}</p>
            </div>
          </div>
        ))}
      </figcaption>
    </figure>
  )
}
