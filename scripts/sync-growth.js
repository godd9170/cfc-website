#!/usr/bin/env node
// Builds the year-over-year growth snapshot behind the unlisted /growth page.
// Pulls every placed order from LocalLine (drafts and cancellations excluded),
// aggregates by fulfillment year, and writes src/data/growth.json. Only
// aggregate numbers and vendor names are written: no customer data.
//
// Usage: node scripts/sync-growth.js [YYYY-MM-DD]   (cutoff, defaults to today)

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

try {
  readFileSync(resolve(root, '.env.local'), 'utf8')
    .split('\n')
    .forEach(line => {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    })
} catch {
  console.error('Could not read .env.local — make sure it exists')
  process.exit(1)
}

const BASE = 'https://localline.ca/api/backoffice/v2'
const PLACED = ['OPEN', 'CLOSED', 'NEEDS_APPROVAL']
const cutoff = process.argv[2] ?? new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })

let token
async function auth() {
  const res = await fetch(`${BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.LOCALLINE_USERNAME,
      password: process.env.LOCALLINE_PASSWORD,
    }),
  })
  if (!res.ok) throw new Error(`Auth failed: ${res.statusText}`)
  token = (await res.json()).access
}

// Access tokens are short-lived, so re-authenticate on 401 mid-pagination.
async function fetchAll(path) {
  const results = []
  let cursor = `${BASE}${path}`
  while (cursor) {
    const res = await fetch(cursor, { headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 401) { await auth(); continue }
    if (!res.ok) throw new Error(`GET ${cursor} failed: ${res.status}`)
    const data = await res.json()
    results.push(...data.results)
    cursor = data.next ?? null
  }
  return results
}

await auth()
const orders = []
for (const status of PLACED) {
  // page_size above 100 makes the orders endpoint 500.
  orders.push(...(await fetchAll(`/orders/?status=${status}&page_size=100`)))
}

const { vendorMap } = await import(pathToFileURL(resolve(root, 'src/data/vendors.js')).href)
const registryName = new Map(vendorMap.map(v => [v.id, v.name]))
// Some producers have more than one LocalLine vendor id (re-created or
// renamed accounts), so vendors are counted by display name, not id. The
// aliases also tidy names for print.
const ALIASES = {
  'Paper Kite Farm': 'Paper Kite',
  'Edwin County farms': 'Edwin County Farms',
  'Lambs Quarters': "Lamb's Quarters Farm",
  'OnceUponA Farm': 'Once Upon a Farm',
  'Sheep on 7': 'Sheep on 7 Sourdough',
}
const vendorName = (id, fallback) => {
  const name = registryName.get(id) ?? fallback ?? `Vendor ${id}`
  return ALIASES[name] ?? name
}

const years = {}
for (const o of orders) {
  const date = o.fulfillment?.fulfillment_date
  if (!date || date > cutoff) continue
  const y = date.slice(0, 4)
  const m = Number(date.slice(5, 7))
  const s = (years[y] ??= {
    orders: 0, sales: 0, producerPayout: 0, units: 0,
    customers: new Set(), vendors: new Set(), products: new Set(),
    ordersByCustomer: {}, months: {}, firstDate: date, lastDate: date,
    fulfillment: { delivery: 0, pickup: 0 },
  })
  const month = (s.months[m] ??= { sales: 0, orders: 0 })

  s.orders++
  s.sales += o.subtotal
  month.sales += o.subtotal
  month.orders++
  if (date < s.firstDate) s.firstDate = date
  if (date > s.lastDate) s.lastDate = date
  s.fulfillment[o.fulfillment.fulfillment_strategy_type === 'pickup' ? 'pickup' : 'delivery']++

  const cid = o.customer?.id
  if (cid) {
    s.customers.add(cid)
    s.ordersByCustomer[cid] = (s.ordersByCustomer[cid] ?? 0) + 1
  }

  for (const e of o.order_entries) {
    // Producer payout = the producer's own price, before the Collective's markup.
    s.producerPayout += (e.package_unit_price ?? e.price_per_unit) * (e.quantity_to_charge ?? e.unit_quantity)
    s.units += e.unit_quantity
    s.products.add(e.product)
    if (e.vendor_id) s.vendors.add(vendorName(e.vendor_id, e.vendor_name))
  }
}

const yearKeys = Object.keys(years).sort()
const round = n => Math.round(n)

const out = {
  generatedAt: new Date().toISOString(),
  cutoff,
  years: Object.fromEntries(yearKeys.map((y, i) => {
    const s = years[y]
    const prev = i > 0 ? years[yearKeys[i - 1]] : null
    return [y, {
      orders: s.orders,
      sales: round(s.sales),
      producerPayout: round(s.producerPayout),
      units: round(s.units),
      customers: s.customers.size,
      repeatCustomers: Object.values(s.ordersByCustomer).filter(n => n > 1).length,
      returningFromPriorYear: prev ? [...s.customers].filter(c => prev.customers.has(c)).length : null,
      vendors: s.vendors.size,
      products: s.products.size,
      firstDate: s.firstDate,
      lastDate: s.lastDate,
      fulfillment: s.fulfillment,
      months: Object.fromEntries(
        Object.entries(s.months).map(([m, v]) => [m, { sales: round(v.sales), orders: v.orders }]),
      ),
      vendorNames: [...s.vendors].sort((a, b) => a.localeCompare(b)),
      newVendorNames: prev
        ? [...s.vendors].filter(v => !prev.vendors.has(v)).sort((a, b) => a.localeCompare(b))
        : [],
    }]
  })),
}

writeFileSync(resolve(root, 'src/data/growth.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`Wrote src/data/growth.json (${orders.length} placed orders, cutoff ${cutoff})`)
for (const y of yearKeys) {
  const s = out.years[y]
  console.log(`  ${y}: $${s.sales} sales · ${s.orders} orders · ${s.customers} customers · ${s.vendors} vendors · ${s.products} products`)
}
