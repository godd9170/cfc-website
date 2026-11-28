// Pure calculations for the /vision simulators. No React, no formatting.
// `a` is a full assumptions object (see PARAMS in ./config), `modules` maps
// module id → unit count. Annual figures unless the name says otherwise.

import { MODULES, CAPEX_CATEGORIES, ARCHETYPES, WHOLESALE_SEGMENTS, scenarioAssumptions, scenarioModules } from './config.js'

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const WEEKS = 52
const WEEKS_PER_MONTH = WEEKS / 12
const count = (modules, id) => modules[id] || 0
const sumModules = (modules, fn) => MODULES.reduce((s, m) => s + count(modules, m.id) * fn(m), 0)

// ── Capital ─────────────────────────────────────────────────────────────────

export function computeCapex(a, modules) {
  const cats = Object.fromEntries(CAPEX_CATEGORIES.map(c => [c.id, 0]))
  const inBuilding = a.tenure === 'building'
  for (const m of MODULES) {
    const costs = inBuilding && m.lean ? m.lean : m.capex
    for (const [k, v] of Object.entries(costs)) cats[k] += count(modules, m.id) * v
  }
  const moduleCosts = Object.values(cats).reduce((s, v) => s + v, 0)

  const buildingSqft = sumModules(modules, m => m.footprint)
  const containers = sumModules(modules, m => m.containers)
  // In an existing building the "site" is just the leased floor area.
  const siteSqft = inBuilding ? buildingSqft : Math.max(a.minSiteSqft, buildingSqft / Math.max(a.siteCoverage, 0.01))

  cats.land = a.tenure === 'own' ? a.landPurchase : a.leaseholdPrep
  cats.sitePrep = inBuilding ? 0 : siteSqft * a.sitePrepPerSqft
  cats.electricalPlumbing += a.sharedInfrastructure

  // Fees and contingency apply to construction, not to the land itself.
  const construction = moduleCosts + cats.sitePrep + a.sharedInfrastructure
  cats.fees = construction * a.profFeesPct
  cats.contingency = (construction + cats.fees) * a.contingencyPct

  const groups = {
    site: cats.land + cats.sitePrep,
    modules: moduleCosts,
    shared: a.sharedInfrastructure,
    fees: cats.fees,
    contingency: cats.contingency,
  }
  // Total capital investment = site + modules + shared infrastructure + fees + contingency
  const total = Object.values(groups).reduce((s, v) => s + v, 0)
  return { cats, groups, total, buildingSqft, siteSqft, containers, inBuilding }
}

// ── Capacity ────────────────────────────────────────────────────────────────

export function computeCapacity(a, modules) {
  const cap = k => sumModules(modules, m => m.capacity[k] || 0)
  return {
    ordersPerWeek: cap('ordersPerWeek'),
    coldWeekly: cap('coldWeekly'),
    frozenWeekly: cap('frozenWeekly'),
    dryWeekly: cap('dryWeekly'),
    retailAnnual: cap('retailAnnual'),
    growAnnual: cap('growAnnual'),
    pallets: { cold: cap('coldPallets'), frozen: cap('frozenPallets'), dry: cap('dryPallets') },
    kitchenHours: cap('kitchenHours') * a.kitchenHoursPerMonth,
  }
}

// ── Market + operations, without break-even search ──────────────────────────

export function computeCore(a, modules, capex = computeCapex(a, modules), capacity = computeCapacity(a, modules)) {
  // Regional market
  const households = a.population / a.householdSize + (a.newHouseholds || 0)
  const regionalSpend = households * a.weeklySpend * WEEKS
  const addressable = regionalSpend * clamp(a.addressablePct, 0, 1)
  const capture = clamp(a.capturePct, 0, 1) // capture can never exceed the addressable market
  const annualSales = addressable * capture // household GMV
  const weeklyOrders = a.aov > 0 ? annualSales / WEEKS / a.aov : 0

  // Sales mix: retail needs a retail module.
  const hasRetail = count(modules, 'retail') > 0
  const retailMix = hasRetail ? clamp(a.retailMixPct, 0, 1) : 0
  const retailSales = annualSales * retailMix
  const marketplaceSales = annualSales - retailSales
  const marketplaceOrdersWeekly = a.aov > 0 ? marketplaceSales / WEEKS / a.aov : 0

  // Consignment: producers own the stock until it sells; the terminal keeps
  // the consignment rate on every sale, online or walk-in.
  const effectiveCommission = a.consignmentPct
  const marketplaceFees = marketplaceSales * effectiveCommission
  const retailGrossProfit = retailSales * effectiveCommission

  // On-site growing replaces consigned product in the retail market. The
  // terminal keeps the producer's share too, not extra sales, so it is
  // never counted twice. Output beyond retail sales has no channel.
  const grownSold = hasRetail ? Math.min(capacity.growAnnual, retailSales) : 0
  const onsiteMargin = grownSold * (1 - effectiveCommission)

  const retainedTrading = marketplaceFees + retailGrossProfit + onsiteMargin
  const householdPayouts = annualSales - retainedTrading

  // Commercial distribution happens on top of the household market.
  const wholesale = WHOLESALE_SEGMENTS.map(s => {
    const accounts = a[s.accounts] || 0
    const sales = accounts * (a[s.weekly] || 0) * WEEKS
    return { id: s.id, label: s.label, color: s.color, accounts, sales, kept: sales * a.wholesaleMarginPct, ordersWeekly: accounts }
  })
  const wholesaleGmv = wholesale.reduce((s, x) => s + x.sales, 0)
  const wholesaleIncome = wholesaleGmv * a.wholesaleMarginPct
  const wholesaleOrdersWeekly = wholesale.reduce((s, x) => s + x.ordersWeekly, 0)
  const producerPayouts = householdPayouts + (wholesaleGmv - wholesaleIncome)
  const totalGmv = annualSales + wholesaleGmv
  const totalRetained = retainedTrading + wholesaleIncome
  const fulfillmentOrdersWeekly = marketplaceOrdersWeekly + wholesaleOrdersWeekly

  // Sales by customer segment: retail (households) and wholesale (businesses).
  const segments = [
    { id: 'online', group: 'Retail', label: 'Online marketplace', color: '#c8513b', sales: marketplaceSales, kept: marketplaceFees, ordersWeekly: marketplaceOrdersWeekly },
    { id: 'walkin', group: 'Retail', label: 'Walk-in market', color: '#2F5D50', sales: retailSales, kept: retailGrossProfit + onsiteMargin, ordersWeekly: a.aov > 0 ? retailSales / WEEKS / a.aov : 0 },
    ...wholesale.map(x => ({ ...x, group: 'Wholesale' })),
  ]

  // Shared producer services: volume brought by producers, capped by capacity.
  const services = MODULES.filter(m => m.service && count(modules, m.id) > 0).map(m => {
    const capacityWeekly = m.service.perWeek * count(modules, m.id)
    const demandWeekly = a[m.service.volume] || 0
    const weekly = Math.min(demandWeekly, capacityWeekly)
    const monthly = (weekly * WEEKS) / 12
    return {
      id: m.id, unit: m.service.units, demandWeekly, capacityWeekly, weekly,
      feesMonthly: monthly * a[m.service.fee],
      labourMonthly: monthly * (m.service.minutesPerUnit / 60) * a.wageHourly,
    }
  })

  // Monthly income
  const storageRental = a.storageRentableShare * a.storageOccupancy *
    (capacity.pallets.cold * a.storageRateCold + capacity.pallets.frozen * a.storageRateFrozen + capacity.pallets.dry * a.storageRateDry)
  const income = {
    marketplace: marketplaceFees / 12,
    retail: retailGrossProfit / 12,
    onsite: onsiteMargin / 12,
    storage: storageRental,
    wholesale: wholesaleIncome / 12,
    processing: capacity.kitchenHours * a.kitchenRate,
    services: services.reduce((s, x) => s + x.feesMonthly, 0),
  }
  const tradingIncome = income.marketplace + income.retail + income.onsite
  const serviceIncome = income.storage + income.wholesale + income.processing + income.services

  // Monthly operating costs
  const ordersMonthly = (marketplaceOrdersWeekly * WEEKS) / 12
  const wholesaleOrdersMonthly = wholesaleOrdersWeekly * WEEKS_PER_MONTH
  // The pieces behind each cost line, so the page can explain them.
  const costParts = {
    coreHours: a.coreStaffHours,
    moduleHours: sumModules(modules, m => a[`staff_${m.id}`] ?? 0),
    packingHours: (ordersMonthly / WEEKS_PER_MONTH) * (a.packMinutesPerOrder / 60) + wholesaleOrdersWeekly * (a.wholesalePackMinutes / 60),
    serviceHours: services.reduce((s, x) => s + x.weekly * (MODULES.find(m => m.id === x.id).service.minutesPerUnit / 60), 0),
    coreStaff: a.coreStaffHours * a.wageHourly * WEEKS_PER_MONTH,
    moduleStaff: sumModules(modules, m => (a[`staff_${m.id}`] ?? 0) * a.wageHourly * WEEKS_PER_MONTH),
    packing: (ordersMonthly * a.packMinutesPerOrder + wholesaleOrdersMonthly * a.wholesalePackMinutes) / 60 * a.wageHourly,
    serviceStaff: services.reduce((s, x) => s + x.labourMonthly, 0),
    ordersMonthly,
    wholesaleOrdersMonthly,
    deliveriesMonthly: ordersMonthly * a.deliveryShare,
    energyModules: sumModules(modules, m => m.monthly.energy),
    paymentFees: (totalGmv * a.paymentPct) / 12,
  }
  const costs = {
    labour: costParts.coreStaff + costParts.moduleStaff + costParts.packing + costParts.serviceStaff,
    rent: a.tenure === 'own' ? 0 : a.leaseMonthly,
    energy: a.siteBaseEnergyMonthly + sumModules(modules, m => m.monthly.energy),
    water: a.siteBaseWaterMonthly + sumModules(modules, m => m.monthly.water),
    insurance: a.insuranceBaseMonthly + (capex.total * a.insurancePctCapex) / 12,
    delivery: ordersMonthly * a.deliveryShare * (a.deliveryCost - a.deliveryFee) + wholesaleOrdersMonthly * a.deliveryCost,
    software: a.softwareMonthly + (totalGmv * a.paymentPct) / 12,
    maintenance: (capex.total * a.maintenancePctCapex) / 12,
    inventoryLoss: (retailSales * (1 - effectiveCommission) * a.retailShrinkPct + marketplaceSales * a.marketplaceLossPct) / 12,
  }
  const operatingCosts = Object.values(costs).reduce((s, v) => s + v, 0)

  // Monthly operating contribution = trading income + net service income − operating costs
  const surplus = tradingIncome + serviceIncome - operatingCosts

  return {
    households, regionalSpend, addressable, capture, annualSales, weeklyOrders,
    hasRetail, retailSales, marketplaceSales, marketplaceOrdersWeekly, effectiveCommission,
    grownSold, retainedTrading, householdPayouts, producerPayouts, wholesaleGmv, wholesaleIncome, wholesaleOrdersWeekly, totalGmv, totalRetained, fulfillmentOrdersWeekly, segments,
    services, income, tradingIncome, serviceIncome, costs, costParts, operatingCosts, surplus,
  }
}

// Smallest capture at which `pick(core) >= 0`, by bisection. The model is
// monotonic in capture as long as each extra dollar of sales contributes more
// than it costs, so a negative value at 100% capture means "not reachable".
function solveCapture(a, modules, capex, capacity, pick) {
  const at = c => pick(computeCore({ ...a, capturePct: c }, modules, capex, capacity))
  if (at(0) >= 0) return 0
  if (at(1) < 0) return null
  let lo = 0, hi = 1
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (at(mid) >= 0) hi = mid
    else lo = mid
  }
  return hi
}

function breakEvenAt(a, modules, capex, capacity, pick) {
  const capture = solveCapture(a, modules, capex, capacity, pick)
  if (capture == null) return null
  const core = computeCore({ ...a, capturePct: capture }, modules, capex, capacity)
  return { capture, annualSales: core.annualSales, weeklyOrders: core.weeklyOrders }
}

// ── Full model ──────────────────────────────────────────────────────────────

export function computeModel(a, modules) {
  const capex = computeCapex(a, modules)
  const capacity = computeCapacity(a, modules)
  const core = computeCore(a, modules, capex, capacity)

  const breakEven = breakEvenAt(a, modules, capex, capacity, c => c.surplus)

  const flags = computeFlags(a, modules, core, capacity)
  if (breakEven && breakEven.capture > core.capture && breakEven.weeklyOrders * (1 - (core.hasRetail ? a.retailMixPct : 0)) + core.wholesaleOrdersWeekly > capacity.ordersPerWeek) {
    flags.push({ level: 'warn', text: `Break-even needs about ${Math.round(breakEven.weeklyOrders).toLocaleString('en-CA')} orders a week, more than this configuration can fulfill. It would need to grow before it could sustain itself.` })
  }
  return { ...core, capex, capacity, breakEven, flags }
}

export function computeFlags(a, modules, core, capacity) {
  const flags = []
  const warn = text => flags.push({ level: 'warn', text })
  const info = text => flags.push({ level: 'info', text })
  const weeklySales = core.totalGmv / WEEKS
  const r = n => Math.round(n).toLocaleString('en-CA')
  const $ = n => `$${r(n)}`

  if (core.fulfillmentOrdersWeekly > capacity.ordersPerWeek) {
    warn(`Forecast orders (${r(core.marketplaceOrdersWeekly)} online + ${r(core.wholesaleOrdersWeekly)} wholesale a week) exceed fulfillment capacity (${r(capacity.ordersPerWeek)}/week). Add a fulfillment module.`)
  }
  if (core.retailSales > capacity.retailAnnual && capacity.retailAnnual > 0) {
    warn(`Forecast retail sales (${$(core.retailSales)}/yr) exceed retail market capacity (${$(capacity.retailAnnual)}/yr). Add a retail module.`)
  }
  const storage = [
    ['refrigerated', weeklySales * a.coldSharePct, capacity.coldWeekly, 'refrigerated storage'],
    ['frozen', weeklySales * a.frozenSharePct, capacity.frozenWeekly, 'frozen storage'],
    ['dry', weeklySales * a.drySharePct, capacity.dryWeekly, 'dry storage'],
  ]
  for (const [label, need, have, mod] of storage) {
    if (need > have) {
      warn(have === 0
        ? `No ${mod} is configured, but about ${$(need)}/week of sales are ${label === 'dry' ? 'shelf-stable' : label} products.`
        : `Forecast ${label} throughput (${$(need)}/week) exceeds ${mod} capacity (${$(have)}/week).`)
    }
  }
  if (!core.hasRetail && a.retailMixPct > 0) {
    info('No retail module, so all sales are assumed to go through the online marketplace.')
  }
  if (capacity.growAnnual > 0 && !core.hasRetail) {
    warn('Growing modules sell through the retail market. Without one, on-site produce has no sales channel and earns nothing here.')
  } else if (capacity.growAnnual > core.retailSales) {
    info(`On-site growing could produce ${$(capacity.growAnnual)}/yr but retail sales are only ${$(core.retailSales)}/yr; the excess is not counted.`)
  }
  for (const x of core.services) {
    if (x.demandWeekly > x.capacityWeekly) info(`Producers would bring ${r(x.demandWeekly)} ${x.unit}/week to the ${MODULES.find(m => m.id === x.id).name.toLowerCase()}, but it handles ${r(x.capacityWeekly)}; the rest is not counted.`)
  }
  if (!count(modules, 'staff') && a.tenure !== 'building') {
    warn('A new-build site needs staff and sanitation facilities. Add the Staff & sanitation module, or choose an existing building.')
  }
  return flags
}

// ── Helpers for charts, scenario comparison and the network ─────────────────

export function sweepCapture(a, modules, maxCapture, steps = 60) {
  const capex = computeCapex(a, modules)
  const capacity = computeCapacity(a, modules)
  return Array.from({ length: steps + 1 }, (_, i) => {
    const capture = (maxCapture * i) / steps
    return { capture, ...computeCore({ ...a, capturePct: capture }, modules, capex, capacity) }
  })
}

export function terminalPopulation(t, a) {
  return t.archetype === 'pec' ? a.population : (ARCHETYPES.find(x => x.id === t.archetype)?.population ?? 0)
}

// Each region's terminal is either the configuration built above ('current')
// or one of the scenario presets, e.g. every new region opening as a Starter.
export function computeNetwork(a, modules, terminals) {
  const rows = terminals.map(t => {
    const stage = t.archetype === 'pec' ? 'current' : (t.stage ?? 'current')
    const baseA = stage === 'current' ? a : scenarioAssumptions(stage)
    const mods = stage === 'current' ? modules : scenarioModules(stage)
    const population = terminalPopulation(t, a)
    // Planned new households apply to the PEC pilot only.
    const m = computeModel({ ...baseA, population, newHouseholds: t.archetype === 'pec' ? a.newHouseholds : 0 }, mods)
    return { ...t, stage, population, regionalSpend: m.regionalSpend, annualSales: m.annualSales, capex: m.capex.total, surplus: m.surplus }
  })
  return {
    rows,
    population: rows.reduce((s, r) => s + r.population, 0),
    demand: rows.reduce((s, r) => s + r.regionalSpend, 0),
    sales: rows.reduce((s, r) => s + r.annualSales, 0),
    investment: rows.reduce((s, r) => s + r.capex, 0),
  }
}
