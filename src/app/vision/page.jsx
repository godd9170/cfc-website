import Link from 'next/link'
import { SITE_URL } from '../../lib/site'
import VisionProvider from './state'
import TerminalIllustration from './TerminalIllustration'
import NetworkComparison from './NetworkComparison'
import TerminalExplorer from './TerminalExplorer'
import SharedServices from './SharedServices'
import TerminalBuilder from './TerminalBuilder'
import MarketSimulator from './MarketSimulator'
import CustomerSegments from './CustomerSegments'
import ModuleFootprints from './ModuleFootprints'
import OperatingModel from './OperatingModel'
import NetworkScale from './NetworkScale'
import { Disclaimer, ScenarioToolbar } from './ui'
import './vision.css'

// Unlisted long-term vision for Small Regional Food Terminals. Not linked from
// the site's navigation or footer, kept out of the sitemap and search results.
// Unlisted is not private: anyone with the URL can open it. All simulator
// assumptions live in ./model/config.js.

const TITLE = 'The Future of Food is Distributed'
const DESCRIPTION = 'Exploring a new architecture for regional food production, storage and distribution.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: `${SITE_URL}/vision` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/vision` },
  twitter: { title: TITLE, description: DESCRIPTION },
}

const CONTACT_EMAIL = 'eat@countyfarmcollective.com'
const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('The future of regional food — County Farm Collective')}`

function Section({ id, index, eyebrow, title, children, intro, tone = 'plain' }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={tone === 'band' ? 'border-y border-[#e2d8ca] bg-[#efe7d9]/60' : ''}>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-brand-primary/50" />
          {eyebrow}
        </p>
        <h2 id={`${id}-title`} className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#3F3228] md:text-[2.6rem]">{title}</h2>
        {intro && <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-[#5f5244] md:text-lg md:leading-8">{intro}</div>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

export default function VisionPage() {
  return (
    <div className="overflow-x-clip">
      {/* A — Hero */}
      <section aria-labelledby="vision-title" className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:px-6 md:pt-16">
        <div className="vision-rise flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#3F3228] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#3F3228]">A long-term vision by County Farm Collective</span>
          <span className="rounded-full bg-[#e8b04a] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#3F3228]">Conceptual vision · not a committed project</span>
        </div>
        <h1 id="vision-title" className="vision-rise mt-6 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[#3F3228] sm:text-5xl md:text-6xl">
          The future of food is <span className="text-brand-primary">distributed.</span>
        </h1>
        <p className="vision-rise mt-4 max-w-3xl text-lg leading-8 text-[#6d5f50] md:text-xl">{DESCRIPTION}</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div className="space-y-4 text-base leading-7 text-[#5f5244] md:text-lg md:leading-8">
            <p className="font-amatic text-4xl font-bold leading-tight text-[#3F3228] md:text-5xl">What if we built our food infrastructure around the communities that consume it?</p>
            <p>
              County Farm Collective is exploring a long-term vision for a network of small, modular regional food terminals,
              connecting local agricultural production with the universal, recurring demand for food in every community.
            </p>
            <p>
              It begins with a single pilot terminal in Prince Edward County: a working experiment that other agricultural
              regions could learn from and adapt.
            </p>
          </div>
          <Disclaimer />
        </div>

        <figure className="vision-blueprint relative mt-10 overflow-hidden rounded-3xl border border-[#e2d8ca] p-2 shadow-[0_12px_32px_rgba(63,50,40,0.08)] sm:p-6">
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[#3F3228] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fffdf8] sm:left-6 sm:top-6">Conceptual illustration</span>
          <TerminalIllustration labels title="Conceptual illustration of a Small Regional Food Terminal built from shipping containers, with producer receiving, shared storage, order fulfillment, a processing kitchen, a greenhouse, hydroponic growing, a retail market hall, rooftop solar panels and a community courtyard" />
          <figcaption className="px-2 pt-2 text-xs leading-5 text-[#8a7b69] sm:px-0">
            An illustrative Small Regional Food Terminal: modular containers for receiving, storage, fulfillment and processing; a greenhouse and container farm;
            a retail market hall; rooftop solar; and a community courtyard. Not a site plan, design or commitment.
          </figcaption>
        </figure>
      </section>

      <VisionProvider>
        {/* B — Centralized vs distributed */}
        <Section
          id="distributed"
          index="01"
          eyebrow="The premise"
          title="We’ve centralized something inherently distributed"
          tone="band"
          intro={<>
            <p>The industrial economy was built around centralized production and geographically dispersed markets.</p>
            <p>For a factory manufacturing a specialized product, this makes sense. Its customers may be scattered across the world, and economies of scale justify concentrating production in one location.</p>
            <p className="font-semibold text-[#3F3228]">Food is fundamentally different.</p>
            <p>Every household is already in the market. Demand is universal, continuous and geographically distributed. A community doesn’t need to be convinced to consume food; it needs infrastructure that connects its existing demand with an available supply.</p>
            <p>Yet we have largely applied the same centralized industrial architecture to food.</p>
            <p className="font-semibold text-[#3F3228]">What if we designed the system around the geography of consumption instead?</p>
          </>}
        >
          <NetworkComparison />
        </Section>

        {/* D — The SRFT */}
        <Section
          id="terminal"
          index="02"
          eyebrow="The concept"
          title="Introducing the Small Regional Food Terminal"
          intro={<>
            <p>A Small Regional Food Terminal (SRFT) is our proposed concept for a modular physical facility that connects regional food production with regional consumption. Each terminal could support six core functions: <strong className="text-[#3F3228]">aggregate, store, distribute, sell, grow and process.</strong></p>
            <p>The terminal is not intended to replace independent farms. It is intended to provide the shared infrastructure that makes those farms collectively more capable.</p>
          </>}
        >
          <TerminalExplorer />
          <SharedServices />
        </Section>

        {/* E — Builder */}
        <Section
          id="build"
          index="03"
          eyebrow="Build your own food terminal"
          title="Building the terminal"
          tone="band"
          intro={<>
            <p>Using 40-foot shipping containers as conceptual building blocks, a terminal can start small and grow module by module alongside demand. Producers and customers arrive on separate sides of the site, around a shared public courtyard, with space left for future expansion.</p>
            <p>Add or remove modules to see how footprint, capital, operating costs, capacity and revenue streams change. Shipping container construction is a conceptual design choice, not a requirement of the broader SRFT model.</p>
          </>}
        >
          <div className="mb-6"><ScenarioToolbar /></div>
          <TerminalBuilder />
          <div className="mt-12">
            <h3 className="mb-2 text-2xl font-bold text-[#3F3228]">Inside each module</h3>
            <p className="mb-6 max-w-3xl text-base leading-7 text-[#5f5244]">A 40-foot container gives about 300 usable square feet. Here is how each module could use that space, what it costs, and how those costs compare with current market prices.</p>
            <ModuleFootprints />
          </div>
        </Section>

        {/* F — Market */}
        <Section
          id="market"
          index="04"
          eyebrow="Regional market simulator"
          title="The economics of regional food"
          intro={<>
            <p>Every household surrounding a regional food terminal already participates in the food economy. The question is how much of that existing demand can be served through regional production and distribution.</p>
            <p>Unlike many businesses, a food terminal does not need to establish demand for an entirely new product category. It needs to earn a share of existing household and commercial food spending.</p>
          </>}
        >
          <Disclaimer className="mb-6" />
          <MarketSimulator />
          <div className="mt-12">
            <h3 className="mb-2 text-2xl font-bold text-[#3F3228]">Who buys: retail and wholesale</h3>
            <p className="mb-6 max-w-3xl text-base leading-7 text-[#5f5244]">Households buy online or at the market. Restaurants, grocers and institutions buy wholesale, on top of household demand, in larger and steadier orders.</p>
            <CustomerSegments />
          </div>
        </Section>

        {/* G — Operating model */}
        <Section
          id="sustain"
          index="05"
          eyebrow="Operating model"
          title="Can a terminal sustain itself?"
          tone="band"
          intro={<p>This model connects the terminal you configured with the regional market above. Explore how capital investment, market penetration and operating costs together determine whether a terminal could sustain itself. Every assumption is editable.</p>}
        >
          <div className="mb-6 space-y-4">
            <Disclaimer />
            <ScenarioToolbar />
          </div>
          <OperatingModel />
        </Section>

        {/* H — Network */}
        <Section
          id="network"
          index="06"
          eyebrow="Scale the network, not the facility"
          title="A replicable unit of regional food infrastructure"
          intro={<>
            <p>The objective is not to build increasingly enormous food distribution centres, nor to scatter many small ones across a single county. It is to develop a replicable unit of regional food infrastructure: one terminal per agricultural region, sized to that region’s demand, adapted to local conditions and interconnected with neighbouring regions.</p>
            <p>Prince Edward County would have one terminal: the pilot. Its job is to test the model in the open, so that other communities can decide whether, and how, to build their own.</p>
            <p>Each terminal could prioritize its regional producers while exchanging products with other terminals where climate, seasonality or agricultural specialization make sense.</p>
            <p className="font-amatic text-4xl font-bold leading-tight text-[#3F3228] md:text-5xl">Local first. Regional second. Global when necessary.</p>
          </>}
        >
          <NetworkScale />
        </Section>
      </VisionProvider>

      {/* J — Closing */}
      <section aria-labelledby="closing-title" className="bg-[#3F3228] text-[#f6f1e7]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <h2 id="closing-title" className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">A better architecture for food.</h2>
          <div className="mt-8 max-w-3xl space-y-4 text-base leading-7 text-[#e2d8ca] md:text-lg md:leading-8">
            <p>We envision communities with greater capacity to feed themselves, independent producers with access to shared infrastructure, and a food economy that retains more of its value within the regions where food is grown and consumed.</p>
            <p>County Farm Collective is exploring what that future could look like, beginning here in Prince Edward County.</p>
            <p>The ambition is not simply to build a bigger grocery store.</p>
            <p className="text-xl font-semibold text-white md:text-2xl">It is to explore a better architecture for the food system.</p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={CONTACT_HREF} className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-[#fffdf8] shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b04a]">
              Be part of the conversation
            </a>
            <Link href="/contact" className="text-sm font-semibold text-[#e8b04a] hover:underline">Other ways to reach us →</Link>
          </div>
          <p className="mt-12 max-w-3xl border-t border-white/15 pt-6 text-xs leading-5 text-[#c8bca9]">
            This page explores a conceptual long-term vision for County Farm Collective. Proposed facilities, locations, capacities and financial projections are illustrative and subject to feasibility studies, funding, regulatory approvals and further development. They do not represent committed projects or financial forecasts.
          </p>
        </div>
      </section>
    </div>
  )
}
