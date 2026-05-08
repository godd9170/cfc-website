import Link from "next/link";
import EmailCTA from "../../components/EmailCTA";
import { SITE_URL } from "../../lib/site";

export const metadata = {
  title: "About — County Farm Collective",
  description:
    "Meet the team behind County Farm Collective and learn about our mission to make locally grown food from Prince Edward County accessible and affordable for everyone.",
  alternates: { canonical: `${SITE_URL}/about` },
};

function Avatar({ initials, color }) {
  return (
    <div
      className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-[#6d5f50] hover:underline"
      >
        ← Back to Home
      </Link>

      {/* Hero */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-[#e2d8ca] bg-gradient-to-br from-[#fffdf8] to-[#f2e9db] p-8 shadow-[0_12px_32px_rgba(63,50,40,0.08)] md:p-12">
        <img
          src="/beet.png"
          alt=""
          className="pointer-events-none absolute -right-4 -top-2 hidden h-52 w-auto opacity-50 md:block"
        />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7b69]">
          Our story
        </p>
        <h2 className="mb-4 max-w-3xl font-amatic text-6xl font-bold leading-tight text-[#3F3228] md:text-7xl">
          Local food loses on price and convenience. We&apos;re fixing both.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-[#5f5244] md:text-lg">
          Global supply chains beat local farms on cost through scale. Grocery
          stores beat them on convenience through aggregation. Neither advantage
          is permanent — supply chains are getting frailer, and the convenience
          gap exists mostly because no one&apos;s bothered to close it. County
          Farm Collective closes it: one place to see what County farms are
          growing, one weekly order, one pickup. As more growers and households
          join, the price gap closes too — not because anyone&apos;s being
          charitable, but because the system finally has the coordination it
          needed.
        </p>
      </div>

      {/* Problem + Solution */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
          <img src="/apple.png" alt="" className="mb-4 h-12 w-auto" />
          <h3 className="mb-2 text-xl font-semibold text-[#3F3228]">
            The problem with local food
          </h3>
          <p className="text-sm leading-6 text-[#5f5244]">
            Right now, buying local costs more than buying from a grocery store
            stocked by long-haul supply chains. That&apos;s a barrier for
            customers and a ceiling for farmers. Supporting your community
            shouldn&apos;t require paying a premium. The food that travels
            the least should be the freshest and most affordable on the shelf.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
          <img src="/pea.png" alt="" className="mb-4 h-12 w-auto" />
          <h3 className="mb-2 text-xl font-semibold text-[#3F3228]">
            Our just-in-time approach
          </h3>
          <p className="text-sm leading-6 text-[#5f5244]">
            We give farmers real demand signals before they harvest. By
            coordinating orders in advance, growers know exactly what to pick
            and when - eliminating waste, reducing spoilage, and keeping costs
            down. Less guesswork for producers means better prices and fresher
            food for everyone at the table.
          </p>
        </div>
      </div>

      {/* One-stop experience */}
      <div className="mb-10 rounded-2xl border border-[#e2d8ca] bg-[#f8f4ec] p-8">
        <div className="mb-3 flex items-end gap-4">
          <h3 className="text-2xl font-bold tracking-tight text-[#3F3228]">
            One storefront, many producers
          </h3>
          <img src="/cabbage.png" alt="" className="mb-1 h-14 w-auto" />
        </div>
        <p className="mb-4 text-sm leading-6 text-[#5f5244]">
          Whether you&apos;re a household planning weekly meals or a restaurant
          committed to featuring local ingredients on your menu, the Collective
          makes it easy. Shop from a curated selection of Prince Edward County
          growers and makers in a single, coordinated order — no sourcing from
          a dozen different farms, no unpredictable availability.
        </p>
        <ul className="space-y-2 text-sm text-[#5f5244]">
          {[
            "Household groceries from producers you can name",
            "Restaurant-ready volumes with consistent weekly availability",
            "One pickup or delivery, however many farms contributed",
          ].map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0 text-brand-sage">●</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Team */}
      <div className="mb-10">
        <h3 className="mb-1 text-2xl font-bold tracking-tight text-[#3F3228]">
          The team
        </h3>
        <p className="mb-6 text-sm text-[#6d5f50]">
          Two people with complementary obsessions — local food and operational
          efficiency — working to grow something lasting.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <div className="mb-4 flex items-center gap-4">
              <Avatar initials="H" color="#a4b787" />
              <h4 className="text-xl font-semibold text-[#3F3228]">Hank Goddard</h4>
            </div>
            <p className="text-sm leading-6 text-[#5f5244]">
              Hank&apos;s vision was simple and stubborn: there&apos;s no good
              reason locally grown food from Prince Edward County should cost
              more than whatever arrives on a refrigerated truck from hundreds
              of kilometres away. That conviction became the seed of the
              Collective — a belief that the right model could make local the
              obvious choice, not the premium one.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <div className="mb-4 flex items-center gap-4">
              <Avatar initials="M" color="#90b4d0" />
              <h4 className="text-xl font-semibold text-[#3F3228]">Mike Da Silva</h4>
            </div>
            <p className="text-sm leading-6 text-[#5f5244]">
              Mike joined to turn that vision into an operation — building the
              logistics, technology, and processes needed to coordinate farmers,
              orders, and customers at scale. His focus is on the systems that
              make the Collective run smoothly week after week, so that growers
              can stay focused on growing and customers can count on what
              they&apos;ve ordered actually arriving.
            </p>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="mb-10 rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
        <h3 className="mb-2 text-lg font-semibold text-[#3F3228]">
          What&apos;s next for the Collective
        </h3>
        <p className="mb-4 text-sm leading-6 text-[#5f5244]">
          The foundation is in place. Now the work is growth — in all
          directions.
        </p>
        <ul className="space-y-2 text-sm text-[#5f5244]">
          {[
            "Bringing on more local producers to expand variety and volume",
            "Improving delivery and pickup options to reach more customers",
            "Expanding the customer base so local farmers have a market worth growing for",
          ].map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0 text-brand-primary">●</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div id="newsletter">
        <EmailCTA
          heading="Stay in the loop"
          subheading="A short weekly reminder before the order window closes — so you never miss your chance to stock up on the freshest local food from the County."
          compact
        />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="https://cfc.localline.ca"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-[#f7f4ed] hover:bg-brand-primary-dark"
        >
          Shop this week
        </a>
        <Link
          href="/vendors"
          className="rounded-full border border-[#c8bca9] bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#3F3228] hover:bg-[#f5efe4]"
        >
          Meet our vendors
        </Link>
      </div>
    </section>
  );
}
