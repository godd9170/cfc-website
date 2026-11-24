import Link from 'next/link'
import MetaPixel from '../../../components/MetaPixel'
import ShopIfOpen from './ShopIfOpen'

// Shown after a /join signup. Not a conversion trigger itself: the Lead
// event fires from the form, so revisits/refreshes here don't count twice.
export const metadata = {
  title: "You're on the list",
  robots: { index: false, follow: false },
}

export default function JoinThanksPage() {
  return (
    <>
      <MetaPixel />

      <div className="mx-auto w-full max-w-xl px-4 pb-6 pt-10 text-center sm:px-6 md:pt-16">
        <div className="mb-10 flex items-center justify-center gap-2">
          <img src="/cabbage.png" alt="" className="h-9 w-auto" />
          <span className="font-amatic text-2xl font-bold leading-none text-[#3F3228]">
            County Farm Collective
          </span>
        </div>

        <img src="/pea.png" alt="" className="mx-auto mb-6 h-16 w-auto" />
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#3F3228] md:text-4xl">
          Thanks, you&apos;re on the list!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#5f5244]">
          Watch your inbox <span className="font-semibold text-[#3F3228]">Sundays at noon</span>.
          That&apos;s when ordering opens, and when we send this week&apos;s
          harvest and new offers from County Farm Collective.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#e8b04a]/40 bg-[#fffbf0] px-6 py-5">
          <p className="text-sm text-[#3F3228]">
            New to the Collective? Use code{' '}
            <span className="rounded-md border border-[#e8b04a]/60 bg-[#fef3d0] px-2 py-0.5 font-mono text-xs font-bold tracking-wider">
              EATLOCAL
            </span>{' '}
            for 10% off your first order.
          </p>
        </div>

        <ShopIfOpen />

        <p className="mt-10 text-sm">
          <Link href="/" className="text-[#6d5f50] hover:underline">
            Visit countyfarmcollective.com →
          </Link>
        </p>
      </div>
    </>
  )
}
