import Link from "next/link";
import { SITE_URL } from "../../lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with County Farm Collective — whether you want to sell on the platform, suggest a vendor, or have a question about an order.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

const EMAIL = "eat@countyfarmcollective.com";

const reasons = [
  {
    label: "Vendors",
    heading: "Interested in selling with us?",
    body: "Whether you're an established farm or just starting out, we'd love to hear from you. Tell us a bit about yourself and what you grow or make — we'll take it from there.",
    cta: "Start the conversation →",
    subject: "Vendor Inquiry — County Farm Collective",
  },
  {
    label: "Suggestions",
    heading: "Know a producer we should have?",
    body: "If there's a local grower, baker, or maker you think belongs on the platform, let us know. We're always looking to expand the range of what's available each week.",
    cta: "Suggest a vendor →",
    subject: "Vendor Suggestion — County Farm Collective",
  },
  {
    label: "Orders & Platform",
    heading: "Issue with an order or the platform?",
    body: "Something missing, incorrect, or not working as expected? Drop us a line and we'll sort it out quickly. Include your order number if you have it.",
    cta: "Report an issue →",
    subject: "Order Support — County Farm Collective",
  },
  {
    label: "General",
    heading: "Something else on your mind?",
    body: "Questions, feedback, partnership ideas, or just want to say hello — we read everything and respond to all of it.",
    cta: "Send a message →",
    subject: "Hello — County Farm Collective",
  },
];

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-[#6d5f50] hover:underline"
      >
        ← Back to Home
      </Link>

      <div className="mb-3 flex items-end gap-4">
        <h2 className="text-4xl font-bold tracking-tight">Get in touch</h2>
        <img src="/pea.png" alt="" className="mb-1 h-16 w-auto" />
      </div>
      <p className="mb-2 text-[#6d5f50]">
        One email address, every reason to reach out.
      </p>
      <a
        href={`mailto:${EMAIL}`}
        className="mb-10 inline-block text-lg font-semibold text-brand-primary hover:underline"
      >
        {EMAIL}
      </a>

      <div className="grid gap-4 sm:grid-cols-2">
        {reasons.map(({ label, heading, body, cta, subject }) => (
          <div
            key={label}
            className="flex flex-col rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(63,50,40,0.06)]"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7b69]">
              {label}
            </p>
            <h3 className="mb-2 text-base font-semibold text-[#3F3228]">
              {heading}
            </h3>
            <p className="mb-4 grow text-sm leading-6 text-[#5f5244]">{body}</p>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
              className="self-start text-sm font-medium text-[#2F5D50] hover:underline"
            >
              {cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
