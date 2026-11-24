'use client'
import { useEffect, useState } from 'react'

// Weekly ordering window, in Prince Edward County local time:
// Sunday 12:00pm → Tuesday 2:00pm.
const TIME_ZONE = 'America/Toronto'
const MINUTES_PER_DAY = 24 * 60
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY
const OPEN_AT = 0 * MINUTES_PER_DAY + 12 * 60 // Sunday 12:00
const CLOSE_AT = 2 * MINUTES_PER_DAY + 14 * 60 // Tuesday 14:00

export const OPENS_LABEL = 'Sunday at noon'
export const CLOSES_LABEL = 'Tuesday at 2pm'
export const SHOP_URL = 'https://cfc.localline.ca'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Minutes (fractional) since Sunday 00:00 in Toronto time.
function weekMinutes(now) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return (
    WEEKDAYS.indexOf(parts.weekday) * MINUTES_PER_DAY +
    Number(parts.hour) * 60 +
    Number(parts.minute) +
    Number(parts.second) / 60
  )
}

// How far through the week (Sunday 00:00 → Saturday 24:00, Toronto time)
// we are, from 0 to 1.
export function getWeekProgress(now = new Date()) {
  return weekMinutes(now) / MINUTES_PER_WEEK
}

export function getOrderWindow(now = new Date()) {
  const m = weekMinutes(now)
  const isOpen = m >= OPEN_AT && m < CLOSE_AT
  const minutesLeft = isOpen
    ? CLOSE_AT - m
    : (OPEN_AT - m + MINUTES_PER_WEEK) % MINUTES_PER_WEEK
  return { isOpen, minutesLeft }
}

// "1 day 4 hrs", "3 hrs 12 min", "8 min"
export function formatDuration(minutes) {
  const total = Math.max(1, Math.ceil(minutes))
  const days = Math.floor(total / MINUTES_PER_DAY)
  const hours = Math.floor((total % MINUTES_PER_DAY) / 60)
  const mins = total % 60
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
  if (days > 0) return hours > 0 ? `${plural(days, 'day')} ${plural(hours, 'hr')}` : plural(days, 'day')
  if (hours > 0) return mins > 0 ? `${plural(hours, 'hr')} ${mins} min` : plural(hours, 'hr')
  return `${mins} min`
}

// Returns null until mounted (so prerendered HTML never bakes in a stale
// status), then re-checks every 30 seconds so the page flips on its own.
export function useOrderWindow() {
  const [state, setState] = useState(null)
  useEffect(() => {
    const tick = () => setState(getOrderWindow())
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])
  return state
}
