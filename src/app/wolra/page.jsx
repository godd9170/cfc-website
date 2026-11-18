import WolraRedirect, { STORE_URL } from './WolraRedirect'

// Tracked redirect: renders inside the root layout (which loads GA) so the
// visit is recorded before the client sends the visitor on to the store.
export const metadata = {
  title: 'Redirecting to the store',
  robots: { index: false, follow: false },
}

export default function WolraPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <WolraRedirect />
      <h1 className="text-2xl text-[#3F3228]">Taking you to the store…</h1>
      <p className="mt-4 text-[#6b5d4f]">
        If you aren&apos;t redirected,{' '}
        <a href={STORE_URL} className="text-brand-primary underline">
          continue to the County Farm Collective store
        </a>
        .
      </p>
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${STORE_URL}`} />
      </noscript>
    </section>
  )
}
