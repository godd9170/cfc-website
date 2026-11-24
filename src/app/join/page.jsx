import MetaPixel from '../../components/MetaPixel'
import Testimonials from '../../components/Testimonials'
import VendorLogo from '../../components/VendorLogo'
import { activeVendors } from '../../data/vendors'
import JoinForm from './JoinForm'

// Paid-traffic landing page (Facebook/Instagram ads). Kept out of search
// results and the sitemap; the site nav is hidden here (see Header.jsx).
export const metadata = {
  title: 'Get local food from 20+ Prince Edward County farms',
  description:
    'One weekly order from Prince Edward County farms and makers. No subscription, no boxes. Get a reminder when ordering opens.',
  alternates: { canonical: '/join' },
  robots: { index: false, follow: false },
}

const card =
  'rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] shadow-[0_8px_24px_rgba(63,50,40,0.06)]'

const farmCount = `${Math.floor(activeVendors.length / 5) * 5}+`

const VALUE_PROPS = [
  {
    img: '/cabbage.png',
    title: `${farmCount} County farms, one order`,
    body: 'Vegetables, meat, mushrooms, honey, bread, coffee and more from Prince Edward County growers and makers, all in one checkout.',
  },
  {
    img: '/pea.png',
    title: 'No subscription, no boxes',
    body: "Pick exactly what you want, when you want it. Skip a week, or ten. There's no membership fee and no commitment.",
  },
  {
    img: '/mushroom.png',
    title: 'Harvested for your order',
    body: 'Farmers pick and pack after ordering closes, so food reaches you days fresher than the grocery store.',
  },
]

const STEPS = [
  {
    when: 'Sunday',
    title: 'Get your reminder',
    body: "We email you when the week's ordering opens at noon, with what's new and what's on sale.",
  },
  {
    when: 'Sun noon – Tue 2pm',
    title: 'Shop the week',
    body: 'Browse what County producers have this week and order as much or as little as you like.',
  },
  {
    when: 'Wed',
    title: 'Farmers harvest',
    body: 'Your order goes straight to the farms, who harvest and pack it for you.',
  },
  {
    when: 'Thursday',
    title: 'Pick up or get delivery',
    body: 'Collect in Picton or Wellington, or get it delivered. Free delivery on orders over $75.',
  },
]

export default function JoinPage() {
  return (
    <>
      <MetaPixel />

      {/* Hero + primary ask */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-10 md:pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-[#e2d8ca] bg-gradient-to-br from-[#fffdf8] to-[#f2e9db] p-6 shadow-[0_12px_32px_rgba(63,50,40,0.08)] md:p-12">
          <img
            src="/apple.png"
            alt=""
            className="pointer-events-none absolute -right-6 -top-4 hidden h-56 w-auto opacity-60 md:block"
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7b69]">
            Prince Edward County&apos;s farm collective
          </p>
          <h1 className="mb-4 max-w-3xl font-amatic text-6xl font-bold leading-[0.95] text-[#3F3228] md:text-8xl">
            Shop {farmCount} local farms in one weekly order.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-7 text-[#5f5244] md:text-lg">
            Fresh County food, harvested for your order and ready for pickup or
            delivery every Thursday. No subscription, no pre-set boxes.
          </p>
          <div className="max-w-2xl">
            <JoinForm
              heading="Get a reminder when ordering opens"
              subheading="One email a week, Sunday at noon. Plus 10% off your first order. Unsubscribe any time."
              compact
            />
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#3F3228]">
          Why County Farm Collective
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {VALUE_PROPS.map((v) => (
            <article key={v.title} className={`${card} p-6`}>
              <img src={v.img} alt="" className="mb-3 h-12 w-auto" />
              <h3 className="mb-2 text-lg font-semibold text-[#3F3228]">{v.title}</h3>
              <p className="text-sm leading-6 text-[#6d5f50]">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#3F3228]">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`${card} p-6`}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-[#f7f4ed]">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
                  {s.when}
                </span>
              </div>
              <h3 className="mb-1 text-base font-semibold text-[#3F3228]">{s.title}</h3>
              <p className="text-sm leading-6 text-[#6d5f50]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Social proof: the farms */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#3F3228]">
          The farms behind your order
        </h2>
        <ul className="flex flex-wrap gap-3">
          {activeVendors.map((v) => (
            <li key={v.slug} title={v.name}>
              <VendorLogo name={v.name} src={v.logo} className="h-14 w-14 md:h-16 md:w-16" />
            </li>
          ))}
        </ul>
      </section>

      <Testimonials heading="From our customers" />

      {/* Closing ask */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-6">
        <JoinForm
          heading="Never miss an order window"
          subheading="Ordering is open Sunday at noon until Tuesday at 2pm. We'll send one reminder a week, plus 10% off your first order."
        />
      </section>
    </>
  )
}
