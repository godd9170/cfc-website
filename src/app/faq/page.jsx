import Link from "next/link";
import { SITE_URL } from "../../lib/site";

export const metadata = {
  title: "FAQ — County Farm Collective",
  description:
    "Answers to common questions about ordering, pickup, delivery, and joining County Farm Collective.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

function FaqItem({ question, children }) {
  return (
    <details className="group rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] shadow-[0_8px_24px_rgba(63,50,40,0.06)] open:border-[#c8bca9]">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold text-[#3F3228] md:text-base">
          {question}
        </span>
        <span className="mt-0.5 shrink-0 text-[#8a7b69] transition-transform group-open:rotate-45">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </span>
      </summary>
      <div className="px-6 pb-5 text-sm leading-6 text-[#5f5244] [&_a]:font-medium [&_a]:text-[#2F5D50] [&_a]:hover:underline">
        {children}
      </div>
    </details>
  );
}

export default function FaqPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-[#6d5f50] hover:underline">
        ← Back to Home
      </Link>

      <div className="mb-10 flex items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#3F3228]">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-[#6d5f50]">
            Everything you need to know about ordering, pickup, and getting
            involved.
          </p>
        </div>
        <img src="/cabbage.png" alt="" className="mb-1 hidden h-16 w-auto md:block" />
      </div>

      {/* Ordering */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
          Ordering
        </p>
        <div className="space-y-3">
          <FaqItem question="When can I shop?">
            The order window opens every <strong>Sunday at 12:00 PM</strong> and
            closes <strong>Tuesday at 2:00 PM</strong>. That gives you roughly
            two days to browse what County producers have available and place
            your order. See the full{" "}
            <Link href="/customers">weekly schedule</Link> for the complete
            rhythm.
          </FaqItem>

          <FaqItem question="Why does my order say Awaiting approval?">
            Some orders contain items that need a quick confirmation from the
            vendor before they can be finalized. This happens when a product may
            no longer be available, or when it&apos;s sold by weight and needs to
            be weighed first so the vendor can charge you the exact amount. Once
            the vendor confirms, your order status will update and you&apos;ll be
            good to go.
          </FaqItem>

          <FaqItem question="Do I have to order every week?">
            Not at all. There&apos;s no weekly commitment — order when it works
            for you. Whether you&apos;re a one-time shopper, an occasional
            customer, or a weekly regular, all are equally welcome.
          </FaqItem>

          <FaqItem question="Is there a subscription or membership fee?">
            No subscription, no membership fee, no commitment. Shop as much or
            as little as you like — every week is a fresh start. Pickup orders
            have no order minimum. Delivery orders have a small minimum to cover
            logistics.
          </FaqItem>
        </div>
      </div>

      {/* Pickup & Delivery */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
          Pickup &amp; Delivery
        </p>
        <div className="space-y-3">
          <FaqItem question="What day is delivery/pickup?">
            Orders are fulfilled every <strong>Thursday between 12:00 PM and
            5:00 PM</strong>. Whether you choose pickup or delivery, Thursday is
            your day. See the <Link href="/customers">customer page</Link> for
            the full weekly breakdown.
          </FaqItem>

          <FaqItem question="Where and when do I pick up my order?">
            Pickup is in <strong>Picton</strong> every Thursday from 12:00 PM
            to 5:00 PM. We&apos;re actively adding more pickup points across the
            County — if you have a location in mind or want to be notified when
            one opens near you,{" "}
            <Link href="/contact">get in touch</Link>.
          </FaqItem>

          <FaqItem question="How will frozen items be delivered or packaged?">
            Frozen items are packed with insulated materials to keep them at
            safe temperatures through the Thursday delivery window. If you have
            questions about specific products or temperature-sensitive items in
            your order, email us before your order closes and we&apos;ll make
            sure everything arrives in good shape.
          </FaqItem>

          <FaqItem question="What if I can no longer make it during the pickup window?">
            If something comes up and you can&apos;t make it, let us know as
            soon as possible — ideally before Thursday morning. Email{" "}
            <a href="mailto:eat@countyfarmcollective.com?subject=Pickup%20Change%20%E2%80%94%20County%20Farm%20Collective">
              eat@countyfarmcollective.com
            </a>{" "}
            and we&apos;ll do our best to make alternate arrangements.
          </FaqItem>

          <FaqItem question="What if I'm not home during delivery?">
            Include a note in your order with a safe place to leave your items
            — a shaded porch, a cooler by the door, etc. If your situation
            changes after ordering, email{" "}
            <a href="mailto:eat@countyfarmcollective.com?subject=Delivery%20Note%20%E2%80%94%20County%20Farm%20Collective">
              eat@countyfarmcollective.com
            </a>{" "}
            before Thursday morning and we&apos;ll make a note for the driver.
          </FaqItem>
        </div>
      </div>

      {/* Support */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
          Support
        </p>
        <div className="space-y-3">
          <FaqItem question="Who should I contact if there's an issue with my order?">
            Email{" "}
            <a href="mailto:eat@countyfarmcollective.com?subject=Order%20Support%20%E2%80%94%20County%20Farm%20Collective">
              eat@countyfarmcollective.com
            </a>{" "}
            with your order number and a description of the issue — we sort
            things out quickly. You can also use the{" "}
            <Link href="/contact">contact page</Link> to reach us.
          </FaqItem>
        </div>
      </div>

      {/* Vendors */}
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
          Vendors
        </p>
        <div className="space-y-3">
          <FaqItem question="How can I join CFC to offer my products?">
            Send a quick intro to{" "}
            <a href="mailto:eat@countyfarmcollective.com?subject=Vendor%20Inquiry%20%E2%80%94%20County%20Farm%20Collective">
              eat@countyfarmcollective.com
            </a>{" "}
            — tell us a bit about what you grow or make and we&apos;ll take it
            from there. There&apos;s no enrollment fee, no minimum quantities,
            and you set your own prices. Learn more on the{" "}
            <Link href="/vendors">vendor page</Link>.
          </FaqItem>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="rounded-2xl border border-[#e2d8ca] bg-[#f8f4ec] p-6 text-center">
        <p className="mb-1 text-sm font-semibold text-[#3F3228]">
          Still have a question?
        </p>
        <p className="mb-4 text-sm text-[#6d5f50]">
          We read every message and respond to all of them.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-[#f7f4ed] hover:bg-brand-primary-dark"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}
