'use client'
import { useEffect, useState } from 'react'
import { getWeekProgress } from '../../lib/orderWindow'

// Vertical "now" line over the week timeline, positioned from the current
// Toronto time. Renders nothing until mounted so the static HTML never
// carries a stale position, then moves itself every minute.
export default function NowMarker() {
  const [progress, setProgress] = useState(null)
  useEffect(() => {
    const tick = () => setProgress(getWeekProgress())
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])
  if (progress === null) return null

  const left = `${progress * 100}%`
  // Keep the label inside the timeline near Sunday morning / Saturday night.
  const labelLeft = `${Math.min(Math.max(progress * 100, 4), 96)}%`

  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-6 -top-1" aria-hidden="true">
      <span
        className="absolute -top-0.5 bottom-6 w-0.5 -translate-x-1/2 rounded-full bg-[#3F3228]"
        style={{ left }}
      />
      <span
        className="absolute -top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-[#fffdf8] bg-[#3F3228]"
        style={{ left }}
      />
      <span
        className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#3F3228]"
        style={{ left: labelLeft }}
      >
        Now
      </span>
    </div>
  )
}
