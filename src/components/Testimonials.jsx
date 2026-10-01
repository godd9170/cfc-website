import { testimonials } from '../data/testimonials'

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function TestimonialCard({ name, quote, location, featured = false }) {
  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] shadow-[0_8px_24px_rgba(63,50,40,0.06)] ${
        featured ? 'p-8 md:p-10' : 'p-6'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-6 right-4 font-amatic font-bold leading-none text-[#e2d8ca] ${
          featured ? 'text-[10rem]' : 'text-[7rem]'
        }`}
      >
        &rdquo;
      </span>
      <blockquote
        className={`relative text-[#3F3228] ${
          featured
            ? 'text-lg leading-8 md:text-xl md:leading-9'
            : 'text-base leading-7'
        }`}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="relative mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#d9cebf] bg-[#f3ece1] text-xs font-semibold tracking-wide text-[#6d5f50]">
          {initialsOf(name)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-[#3F3228]">{name}</span>
          <span className="block text-xs text-[#8a7b69]">
            {location || 'County Farm Collective customer'}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials({
  heading = 'What our customers say',
  items = testimonials,
}) {
  if (!items.length) return null

  const featured = items.length === 1

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-14">
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-[#3F3228]">
        {heading}
      </h2>
      {featured ? (
        <TestimonialCard {...items[0]} featured />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      )}
    </section>
  )
}
