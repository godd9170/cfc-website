'use client'
import Link from 'next/link'
import EmailCTA from './EmailCTA'
import {
  useOrderWindow,
  formatDuration,
  OPENS_LABEL,
  CLOSES_LABEL,
  SHOP_URL,
} from '../lib/orderWindow'

const NEWSLETTER_SUBHEADING =
  "Sign up to be notified each week about when the order window opens, what's new, and any sales we have on! You can unsubscribe any time."

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7fd1a8] opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3fbf7f]" />
    </span>
  )
}

// Site-wide bar under the header, shown only while ordering is open.
export function OrderOpenBar() {
  const win = useOrderWindow()
  if (!win?.isOpen) return null
  return (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noreferrer"
      className="block bg-[#2F5D50] text-[#f7f4ed] hover:bg-[#264d42]"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <LiveDot />
          Ordering is open now
        </span>
        <span className="text-[#d6e6de]">
          Closes {CLOSES_LABEL} · {formatDuration(win.minutesLeft)} left
        </span>
        <span className="font-semibold underline underline-offset-2">Shop now →</span>
      </div>
    </a>
  )
}

// Status pill + buttons at the bottom of the landing hero.
export function HeroActions() {
  const win = useOrderWindow()
  const secondary =
    'inline-flex items-center rounded-full border border-[#c8bca9] bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#3F3228] hover:bg-[#f5efe4]'
  const primary =
    'inline-flex items-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-[#f7f4ed] hover:bg-brand-primary-dark'

  return (
    <div className="mt-7">
      {win?.isOpen && (
        <div className="mb-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-[#2F5D50]/30 bg-[#e6f2ec] px-4 py-2 text-sm text-[#2F5D50]">
          <LiveDot />
          <span className="font-semibold">Ordering is open now!</span>
          <span>
            Closes {CLOSES_LABEL} ({formatDuration(win.minutesLeft)} left)
          </span>
        </div>
      )}
      {win && !win.isOpen && (
        <div className="mb-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-[#c8bca9] bg-[#fffdf8] px-4 py-2 text-sm text-[#5f5244]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#c8bca9]" aria-hidden="true" />
          <span className="font-semibold text-[#3F3228]">Ordering opens {OPENS_LABEL}</span>
          <span>(in {formatDuration(win.minutesLeft)})</span>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {win && !win.isOpen ? (
          <a href="#newsletter" className={primary}>
            Get a reminder
          </a>
        ) : (
          <a href={SHOP_URL} target="_blank" rel="noreferrer" className={primary}>
            {win?.isOpen ? 'Shop now' : 'Shop this week'}
          </a>
        )}
        <Link href="/customers" className={secondary}>
          How ordering works
        </Link>
      </div>
    </div>
  )
}

function DiscountStrip({ isOpen }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8b04a]/40 bg-[#fffbf0] px-6 py-4 shadow-[0_4px_16px_rgba(63,50,40,0.06)]">
      <div className="flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">🌱</span>
        <p className="text-sm text-[#3F3228]">
          <span className="font-semibold">New to the Collective?</span>{' '}
          {isOpen ? 'Use code' : 'Save code'}{' '}
          <span className="rounded-md border border-[#e8b04a]/60 bg-[#fef3d0] px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-[#3F3228]">
            EATLOCAL
          </span>{' '}
          {isOpen
            ? 'at checkout for 10% off your first order.'
            : `for 10% off your first order when ordering opens ${OPENS_LABEL}.`}
        </p>
      </div>
      {isOpen && (
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 rounded-full bg-brand-amber px-4 py-2 text-xs font-semibold text-[#3F3228] hover:opacity-90"
        >
          Shop with 10% off
        </a>
      )}
    </div>
  )
}

// Discount strip + newsletter signup. While ordering is open the discount
// comes first (people can act on it now); while closed, the signup leads.
export function OrderFlow() {
  const win = useOrderWindow()
  const isOpen = win?.isOpen ?? false

  const discount = (
    <section key="discount" className="mx-auto w-full max-w-6xl px-6 pb-6">
      <DiscountStrip isOpen={isOpen} />
    </section>
  )
  const newsletter = (
    <section
      key="newsletter"
      id="newsletter"
      className="mx-auto w-full max-w-6xl scroll-mt-32 px-6 pb-6"
    >
      <EmailCTA
        heading={
          isOpen
            ? 'Get the weekly harvest update'
            : `Ordering opens ${OPENS_LABEL} — get a reminder`
        }
        subheading={NEWSLETTER_SUBHEADING}
      />
    </section>
  )

  return (
    <div className="pb-6">
      {isOpen ? [discount, newsletter] : [newsletter, discount]}
    </div>
  )
}
