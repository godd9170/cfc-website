'use server'
import { createCustomer, LocalLineError } from './localline'

const ATTRIBUTION_KEYS = ['page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

// Turns client-supplied attribution into a short note for the LocalLine
// customer record, e.g. "Signup: page=/join · utm_source=facebook".
// Only known keys are kept, and values are trimmed and length-capped.
function attributionNote(attribution) {
  if (!attribution || typeof attribution !== 'object') return undefined
  const parts = ATTRIBUTION_KEYS.flatMap((key) => {
    const value = attribution[key]
    if (typeof value !== 'string') return []
    const clean = value.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 100)
    return clean ? [`${key}=${clean}`] : []
  })
  return parts.length ? `Signup: ${parts.join(' · ')}` : undefined
}

export async function subscribe({ email, firstName, attribution }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Valid email required' }
  }
  try {
    await createCustomer({ email, firstName, note: attributionNote(attribution) })
    return { ok: true }
  } catch (err) {
    if (err instanceof LocalLineError && err.code === 'ALREADY_EXISTS') {
      return { error: 'already_exists' }
    }
    console.error('subscribe error:', err)
    return { error: 'Something went wrong' }
  }
}
