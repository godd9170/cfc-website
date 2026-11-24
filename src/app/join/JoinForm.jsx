'use client'
import EmailCTA from '../../components/EmailCTA'
import { trackPixel } from '../../components/MetaPixel'

// Email signup that reports a Meta Pixel "Lead" for new subscribers only
// (not for addresses that are already on the list).
export default function JoinForm(props) {
  return (
    <EmailCTA
      buttonLabel="Remind me"
      successMessage="We'll email you every Sunday when ordering opens. Don't forget code EATLOCAL for 10% off your first order."
      onSuccess={() => trackPixel('Lead', { content_name: 'order_window_reminder' })}
      {...props}
    />
  )
}
