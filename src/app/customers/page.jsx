import Link from "next/link";
import EmailCTA from "../../components/EmailCTA";
import InfoBlock from "../../components/InfoBlock";
import WeeklySchedule from "../../components/WeeklySchedule";

export const metadata = {
  title: "Customer Information",
  description:
    "How to shop with County Farm Collective — weekly ordering, pickup and delivery schedules, and what to expect from Prince Edward County producers.",
  alternates: { canonical: "/customers" },
};

const img = (src, cls = "mx-auto h-12 w-auto") => (
  <img src={src} alt="" className={cls} />
);

const eventLabel = (label, sub, arrow = false) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <p className="text-xs font-semibold leading-tight">{label}</p>
    {sub && <p className="text-sm font-bold">{sub}</p>}
    {arrow && (
      <svg
        viewBox="0 0 32 16"
        className="mt-1 w-8 opacity-60"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 8 C8 4 16 4 24 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 5 L24 8 L20 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);

const customerDays = [
  {
    day: "Sunday",
    bg: "#bdd5e2",
    dark: false,
    content: eventLabel("Ordering Opens", "12:00 PM", true),
  },
  { day: "Monday", bg: "#7a9e6e", dark: true, content: img("/cabbage.png") },
  {
    day: "Tuesday",
    bg: "#d4b896",
    dark: false,
    content: eventLabel("Ordering Closes", "2pm"),
  },
  { day: "Wednesday", bg: "#c8513b", dark: true, content: img("/pea.png") },
  {
    day: "Thursday",
    bg: "#d4b896",
    dark: false,
    content: eventLabel("Delivery Day!", "12:00 PM – 5:00 PM"),
  },
  { day: "Friday", bg: "#a8c4a0", dark: false, content: img("/leek.png") },
  { day: "Saturday", bg: "#802048", dark: true, content: img("/mushroom.png") },
];

export default function CustomersPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-[#6d5f50] hover:underline"
      >
        ← Back to Home
      </Link>
      <div className="mb-3 flex items-end gap-4">
        <h2 className="text-4xl font-bold tracking-tight">
          Customer Information
        </h2>
        <img src="/leek.png" alt="" className="mb-1 h-16 w-auto" />
      </div>
      <p className="mb-8 max-w-3xl text-[#6d5f50]">
        For households and restaurants who want exceptional local food with a
        predictable weekly routine.
      </p>

      <div className="mb-8 rounded-2xl border border-[#c8e0c0] bg-[#f2f8ef] px-6 py-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4a7a60]">
          Shop on your terms
        </p>
        <p className="text-sm text-[#3d5c3a]">
          No subscription, no membership fee, no commitment. Shop as much or as
          little as you like — every week is a fresh start. Pickup orders have
          no minimum. Delivery orders of $75 or more are free (otherwise a
          modest fee of $3.75) to help cover logistics, but there&apos;s
          nothing else standing between you and great local food.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
          <h3 className="mb-2 text-lg font-semibold">How ordering works</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[#5f5244]">
            <li>Browse weekly availability from County producers.</li>
            <li>Place your order through the CFC storefront.</li>
            <li>Pick up or receive delivery on the weekly schedule.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
          <h3 className="mb-2 text-lg font-semibold">What to expect</h3>
          <p className="text-sm leading-6 text-[#5f5244]">
            Product mix changes with seasonality, quality standards stay high,
            and communications stay clear so you always know what is available
            each week.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-semibold">Weekly rhythm</h3>
        <WeeklySchedule days={customerDays} />
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-semibold">Pickup locations</h3>
        <p className="mb-4 text-sm text-[#6d5f50]">
          All pickup locations are available every Thursday.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">Picton</p>
            <h4 className="mb-1 text-sm font-semibold text-[#3F3228]">Penny&apos;s Pantry</h4>
            <a
              href="https://maps.google.com/?q=10+Elizabeth+St,+Picton,+ON+K0K+2T0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2F5D50] hover:underline"
            >
              10 Elizabeth St, Prince Edward, ON K0K&nbsp;2T0
            </a>
            <p className="mt-2 text-xs text-[#8a7b69]">Thu 12:00 PM – 5:00 PM</p>
          </div>
          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">Bloomfield</p>
            <h4 className="mb-1 text-sm font-semibold text-[#3F3228]">Bloomfield Wellness Club</h4>
            <a
              href="https://maps.google.com/?q=8+Stanley+St+%2315,+Bloomfield,+ON+K0K+1G0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2F5D50] hover:underline"
            >
              8 Stanley St #15, Bloomfield, ON K0K&nbsp;1G0
            </a>
            <p className="mt-2 text-xs text-[#8a7b69]">Thu 12:00 PM – 5:00 PM</p>
          </div>
          <div className="rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(63,50,40,0.06)]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">Wellington</p>
            <h4 className="mb-1 text-sm font-semibold text-[#3F3228]">County Feasts</h4>
            <a
              href="https://maps.google.com/?q=305+Main+St,+Wellington,+ON+K0K+3L0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2F5D50] hover:underline"
            >
              305 Main St, Wellington, ON K0K&nbsp;3L0
            </a>
            <p className="mt-2 text-xs text-[#8a7b69]">Thu 12:30 PM – 5:00 PM</p>
          </div>
        </div>
      </div>

      <div id="newsletter" className="mt-8">
        <EmailCTA
          heading="Weekly newsletter"
          subheading="A short weekly reminder before the order window closes — so you never miss your chance to stock up on the freshest local food from the County."
          compact
        />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <a
          href="https://cfc.localline.ca"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-[#f7f4ed] hover:bg-brand-primary-dark"
        >
          Shop now
        </a>
        <Link
          href="/vendors"
          className="rounded-full border border-[#c8bca9] bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#3F3228] hover:bg-[#f5efe4]"
        >
          Browse vendors
        </Link>
      </div>
    </section>
  );
}
