'use client'
import { useOrderWindow, formatDuration, SHOP_URL } from '../../../lib/orderWindow'

// If someone signs up while ordering is already open, don't make them wait
// for Sunday's email: offer the store right away.
export default function ShopIfOpen() {
  const win = useOrderWindow()
  if (!win?.isOpen) return null
  return (
    <div className="mt-8">
      <p className="mb-3 text-sm text-[#2F5D50]">
        <span className="font-semibold">Ordering is open right now</span>, with{' '}
        {formatDuration(win.minutesLeft)} left this week.
      </p>
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-[#f7f4ed] hover:bg-brand-primary-dark"
      >
        Shop this week&apos;s harvest
      </a>
    </div>
  )
}
