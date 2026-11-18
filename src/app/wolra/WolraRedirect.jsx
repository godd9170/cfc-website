'use client'

import { useEffect } from 'react'

export const STORE_URL = 'https://cfc.localline.ca/resto'

// Max time to wait for GA before redirecting anyway (e.g. ad blockers).
const FALLBACK_MS = 2000

export default function WolraRedirect() {
  useEffect(() => {
    let done = false
    const go = () => {
      if (done) return
      done = true
      window.location.replace(STORE_URL)
    }

    const fallback = setTimeout(go, FALLBACK_MS)

    // The layout's gtag-init script loads afterInteractive, so it may not be
    // defined yet when this effect runs — wait for it, then log the redirect
    // and navigate once GA confirms the hit was sent.
    const poll = setInterval(() => {
      if (typeof window.gtag !== 'function') return
      clearInterval(poll)
      window.gtag('event', 'wolra_redirect', {
        destination: STORE_URL,
        transport_type: 'beacon',
        event_callback: go,
      })
    }, 50)

    return () => {
      clearTimeout(fallback)
      clearInterval(poll)
    }
  }, [])

  return null
}
