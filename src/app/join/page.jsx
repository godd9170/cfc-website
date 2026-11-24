import Image from 'next/image'
import MetaPixel from '../../components/MetaPixel'
import { activeVendors } from '../../data/vendors'
import { featuredProducts } from '../../data/featuredProducts'
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
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-[#3F3228] md:text-4xl">
            Shop seasonal Prince Edward County farm fresh food, every week
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#6d5f50]">
            No subscription, no pre-set boxes. Shop what you want, when you
            want.
          </p>
        </header>

        {/* Best sellers */}
        <ul className="mb-8 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Popular this season">
          {featuredProducts.map((p, i) => (
            <li key={p.name}>
              <Image
                src={p.image}
                alt={`${p.name} from ${p.vendor}`}
                width={320}
                height={320}
                sizes="(min-width: 768px) 170px, 25vw"
                priority={i < 4}
                className="aspect-square w-full rounded-xl object-cover shadow-[0_6px_16px_rgba(63,50,40,0.12)]"
              />
              <p className="mt-2 hidden text-center text-xs leading-4 text-[#6d5f50] sm:block">
                <span className="font-semibold text-[#3F3228]">{p.name}</span>
                <br />
                {p.vendor}
              </p>
            </li>
          ))}
        </ul>

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
          {/* Masonry: logos keep their own shapes, flowing down CSS columns. */}
          <ul className="columns-3 gap-3 sm:columns-4 md:columns-5">
            {activeVendors.map((v) => (
              <li key={v.slug} className="mb-3 break-inside-avoid">
                {v.logo ? (
                  <img
                    src={v.logo}
                    alt={v.name}
                    title={v.name}
                    loading="lazy"
                    className="w-full rounded-lg shadow-[0_4px_12px_rgba(63,50,40,0.08)]"
                  />
                ) : (
                  <span className="block rounded-lg bg-[#efe7da] px-3 py-5 font-amatic text-2xl font-bold leading-none text-[#3F3228]">
                    {v.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
