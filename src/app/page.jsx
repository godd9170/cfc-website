import Link from "next/link";
import EmailCTA from "../components/EmailCTA";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "../lib/site";

export const metadata = {
  title: 'Local Food from Prince Edward County — Weekly Farm Collective',
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/cabbage.png`,
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Prince Edward County, Ontario, Canada',
  },
  sameAs: ['https://cfc.localline.ca'],
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-[#e2d8ca] bg-gradient-to-br from-[#fffdf8] to-[#f2e9db] p-8 shadow-[0_12px_32px_rgba(63,50,40,0.08)] md:p-12">
          <img
            src="/apple.png"
            alt=""
            className="pointer-events-none absolute -right-6 -top-4 hidden h-56 w-auto opacity-60 md:block"
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7b69]">
            County Farm Collective
          </p>
          <h2 className="mb-4 max-w-4xl font-amatic text-6xl font-bold leading-tight text-[#3F3228] md:text-8xl">
            PEC&apos;s harvest, in one place.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-[#5f5244] md:text-lg">
            We make it easier to eat real local food by bringing together
            Prince Edward County growers and makers in one place. Shop exactly
            what you want each week, with no subscriptions, pre-set boxes, or
            ongoing commitments.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://cfc.localline.ca"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-[#f7f4ed] hover:bg-brand-primary-dark"
            >
              Shop this week
            </a>
            <Link
              href="/customers"
              className="inline-flex items-center rounded-full border border-[#c8bca9] bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#3F3228] hover:bg-[#f5efe4]"
            >
              How ordering works
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8b04a]/40 bg-[#fffbf0] px-6 py-4 shadow-[0_4px_16px_rgba(63,50,40,0.06)]">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">🌱</span>
            <p className="text-sm text-[#3F3228]">
              <span className="font-semibold">New to the Collective?</span>{" "}
              Use code{" "}
              <span className="rounded-md border border-[#e8b04a]/60 bg-[#fef3d0] px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-[#3F3228]">
                EATLOCAL
              </span>{" "}
              at checkout for 10% off your first order.
            </p>
          </div>
          <a
            href="https://cfc.localline.ca"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 rounded-full bg-brand-amber px-4 py-2 text-xs font-semibold text-[#3F3228] hover:opacity-90"
          >
            Get Started
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-12">
        <EmailCTA
          heading="Get the weekly harvest update"
          subheading="A short weekly reminder before the order window closes — so you never miss your chance to stock up on the freshest local food from the County."
        />
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-14 md:grid-cols-2">
        <article className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
          <img src="/pea.png" alt="" className="mb-3 h-14 w-auto" />
          <h3 className="mb-2 text-xl font-semibold">For customers</h3>
          <p className="mb-5 text-sm leading-6 text-[#6d5f50]">
            Simple weekly ordering, clear pickup/delivery expectations, and
            access to outstanding County producers.
          </p>
          <Link
            href="/customers"
            className="text-sm font-semibold text-brand-primary hover:underline"
          >
            Learn more →
          </Link>
        </article>

        <article className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
          <img src="/mushroom.png" alt="" className="mb-3 h-14 w-auto" />
          <h3 className="mb-2 text-xl font-semibold">For vendors</h3>
          <p className="mb-5 text-sm leading-6 text-[#6d5f50]">
            Stay focused on production while CFC handles merchandising,
            communication, and weekly order flow.
          </p>
          <Link
            href="/vendors"
            className="text-sm font-semibold text-brand-primary hover:underline"
          >
            Learn more →
          </Link>
        </article>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#3F3228]">
          News &amp; Updates
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
              New Pickup Locations
            </p>
            <h3 className="mb-2 text-base font-semibold text-[#3F3228]">
              3 pickup locations across the County!
            </h3>
            <p className="mb-3 text-sm leading-6 text-[#5f5244]">
              We now have three pickup locations, all on{" "}
              <span className="font-medium text-[#3F3228]">Thursdays until 5pm</span>:
            </p>
            <ul className="space-y-2 text-sm leading-6 text-[#5f5244]">
              <li>
                <span className="font-medium text-[#3F3228]">Penny&apos;s Pantry</span>{" "}
                <span className="text-[#8a7b69]">(12pm – 5pm)</span> —{" "}
                <a
                  href="https://maps.google.com/?q=10+Elizabeth+St,+Picton,+ON+K0K+2T0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F5D50] hover:underline"
                >
                  Picton
                </a>
              </li>
              <li>
                <span className="font-medium text-[#3F3228]">Bloomfield Wellness Club</span>{" "}
                <span className="text-[#8a7b69]">(12pm – 5pm)</span> —{" "}
                <a
                  href="https://maps.google.com/?q=8+Stanley+St+%2315,+Bloomfield,+ON+K0K+1G0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F5D50] hover:underline"
                >
                  Bloomfield
                </a>
              </li>
              <li>
                <span className="font-medium text-[#3F3228]">County Feasts</span>{" "}
                <span className="text-[#8a7b69]">(12:30pm – 5pm)</span> —{" "}
                <a
                  href="https://maps.google.com/?q=305+Main+St,+Wellington,+ON+K0K+3L0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F5D50] hover:underline"
                >
                  Wellington
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
              Drivers Wanted
            </p>
            <h3 className="mb-2 text-base font-semibold text-[#3F3228]">
              We&apos;re looking for more drivers!
            </h3>
            <p className="mb-4 text-sm leading-6 text-[#5f5244]">
              A terrific way to spend a few hours a week driving through
              beautiful Prince Edward County. If you&apos;re interested,
              reach out and we&apos;ll send you all the details.
            </p>
            <a
              href="mailto:eat@countyfarmcollective.com?subject=Driver%20Interest%20—%20County%20Farm%20Collective"
              className="text-sm font-medium text-[#2F5D50] hover:underline"
            >
              Let us know →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
