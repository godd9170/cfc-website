import MetaPixel from '../../components/MetaPixel'
import VendorLogo from '../../components/VendorLogo'
import { activeVendors } from '../../data/vendors'
import JoinForm from './JoinForm'
import WeekCadence from './WeekCadence'

// Paid-traffic landing page (Facebook/Instagram ads). Kept out of search
// results and the sitemap; the site header is hidden here (see Header.jsx).
export const metadata = {
  title: 'Get local food from Prince Edward County farms',
  description:
    'One weekly order from Prince Edward County farms and makers. No subscription, no boxes. Get a reminder when ordering opens.',
  alternates: { canonical: '/join' },
  robots: { index: false, follow: false },
}

export default function JoinPage() {
  return (
    <>
      <MetaPixel />

      <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-10 sm:px-6 md:pt-16">
        <header className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <img src="/cabbage.png" alt="" className="h-9 w-auto" />
            <span className="font-amatic text-2xl font-bold leading-none text-[#3F3228]">
              County Farm Collective
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#3F3228] md:text-4xl">
            Prince Edward County&apos;s farms,
            <br className="hidden sm:block" /> one order a week.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#6d5f50]">
            No subscription, no pre-set boxes. Shop what you want, when you
            want.
          </p>
        </header>

        <section className="mb-14" aria-label="Get a reminder">
          <JoinForm
            heading="Get a reminder when ordering opens"
            subheading="One email a week, Sunday at noon, plus 10% off your first order. Unsubscribe any time."
            compact
          />
        </section>

        <section className="mb-14" aria-labelledby="week-heading">
          <h2 id="week-heading" className="sr-only">How a week works</h2>
          <WeekCadence />
        </section>

        <section className="text-center" aria-labelledby="farms-heading">
          <h2 id="farms-heading" className="mb-5 text-lg font-semibold text-[#3F3228]">
            {activeVendors.length} local farms &amp; makers
          </h2>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {activeVendors.map((v) => (
              <li key={v.slug} title={v.name}>
                <VendorLogo name={v.name} src={v.logo} className="h-14 w-14" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
