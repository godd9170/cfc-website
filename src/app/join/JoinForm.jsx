'use client'
import EmailCTA from '../../components/EmailCTA'
import { trackPixel } from '../../components/MetaPixel'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

// The page plus any UTM params on the URL the visitor landed on
// (e.g. /join?utm_source=facebook&utm_campaign=fall-launch).
function readAttribution() {
  const params = new URLSearchParams(window.location.search)
  const attribution = { page: window.location.pathname }
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) attribution[key] = value
  }
  return attribution
}

// Email signup that saves UTM attribution on the new LocalLine customer and
// reports the lead to Meta Pixel and GA, for new subscribers only (not for
// addresses that are already on the list).
export default function JoinForm(props) {
  function handleSuccess() {
    const attribution = readAttribution()
    trackPixel('Lead', { content_name: 'order_window_reminder' })
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { form: 'order_window_reminder', ...attribution })
    }
  }

  return (
    <EmailCTA
      buttonLabel="Remind me"
      successMessage="We'll email you every Sunday when ordering opens. Don't forget code EATLOCAL for 10% off your first order."
      getAttribution={readAttribution}
      onSuccess={handleSuccess}
      {...props}
    />
  )
}
