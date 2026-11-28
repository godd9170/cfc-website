// Every assumption behind the /vision simulators lives here, separate from
// the presentation components. All figures are ILLUSTRATIVE placeholders in
// CAD, chosen to make the model's behaviour legible. They are not CFC
// financial data, verified construction quotations or forecasts. Each one is
// editable on the page.

export const CONTAINER_SQFT = 320 // one 40' × 8' shipping container

// ── The six terminal functions (Section D) ──────────────────────────────────

export const FUNCTIONS = [
  { id: 'aggregate', label: 'Aggregate', color: '#e8b04a', summary: 'Bring together products from independent regional producers.' },
  { id: 'store', label: 'Store', color: '#5f8fb4', summary: 'Provide shared cold, frozen and dry storage.' },
  { id: 'distribute', label: 'Distribute', color: '#c8513b', summary: 'Coordinate household, retail and restaurant fulfillment.' },
  { id: 'sell', label: 'Sell', color: '#2F5D50', summary: 'Operate both physical and digital marketplaces.' },
  { id: 'grow', label: 'Grow', color: '#7d9a5b', summary: 'Produce complementary foods through modular agriculture.' },
  { id: 'process', label: 'Process', color: '#802048', summary: 'Enable future value-added production and preservation.' },
]

// ── Capital cost categories (Section G) ─────────────────────────────────────

export const CAPEX_CATEGORIES = [
  { id: 'land', label: 'Land purchase or lease setup' },
  { id: 'containers', label: 'Container acquisition' },
  { id: 'structural', label: 'Structural modifications & interior fit-out' },
  { id: 'refrigeration', label: 'Refrigeration and freezer systems' },
  { id: 'electricalPlumbing', label: 'Electrical and plumbing' },
  { id: 'retailFitout', label: 'Retail fit-out' },
  { id: 'growing', label: 'Growing equipment' },
  { id: 'processing', label: 'Kitchen & processing equipment' },
  { id: 'sitePrep', label: 'Site preparation' },
  { id: 'fees', label: 'Professional fees and permits' },
  { id: 'contingency', label: 'Contingency' },
]

// ── Modules (Section E) ─────────────────────────────────────────────────────
// capex: one-time cost per unit, by category.
// monthly: fixed monthly energy per unit.
// staffHours: paid staff hours per week per unit (editable on the page).
// capacity: what one unit adds. Throughputs are $ of product per week.
// lean: capex per unit when set up inside an existing leased building with
// used containers and equipment (the "Existing building" site approach).
// Modules without `lean` cost the same either way.

// Shared container cost building blocks (CAD). A used 40′ high cube sells for
// roughly CA$1.7–4.5k in Canada; delivery by tilt-deck or crane plus simple
// footings typically adds about as much again. Used working reefers are
// roughly US$6.7–8k before delivery. See BENCHMARK_SOURCES.
const SHELL = 4000 // used 40′ high cube
const PLACE = 3500 // delivery, crane or tilt-deck placement, footings
const BOX = SHELL + PLACE
const REEFER = 12500 // used working 40′ reefer, delivered (lean approach)

export const BENCHMARK_SOURCES = {
  shell: { label: 'Container xChange: shipping container prices in Canada', url: 'https://www.container-xchange.com/blog/shipping-container-price-canada' },
  ontario: { label: 'Ontario Construction News: container pricing in Canada, 2026', url: 'https://ontarioconstructionnews.com/shipping-container-pricing-in-canada-a-2026-guide-for-construction-professionals' },
  reefer: { label: 'Container xChange: 40ft reefer prices', url: 'https://www.container-xchange.com/blog/40ft-reefer-container' },
  reeferDealer: { label: 'Conexwest: 40ft refrigerated containers', url: 'https://www.conexwest.com/cold-storage-and-freezers/40-refrigerated-containers' },
  mods: { label: 'Conexwest: what container modifications cost', url: 'https://www.conexwest.com/blog/much-cost-modify-shipping-container-2025-real-numbers-breakdown' },
  retail: { label: 'ThisDay: container retail store costs', url: 'https://www.thisdaylive.com/2025/10/01/shipping-container-retail-stores-a-smart-choice' },
  freightFarms: { label: 'Freight Farms: pricing', url: 'https://freightfarms.com/pricing' },
  usedFarm: { label: 'iGrow Pre-Owned: used 2023 Greenery S', url: 'https://igrowpreowned.squarespace.com/inventory/p/freight-farms-missouri' },
  kitchen: { label: 'Conexwest: container kitchen costs', url: 'https://www.conexwest.com/blog/shipping-container-kitchens-traditional-kitchens-pros-cons-costs' },
  egg: { label: 'Farms.com: used egg washer and grader listing', url: 'https://www.farms.com/classifieds/livestock-poultry-pets/poultry/egg-washer-and-grader-like-new-for-sale-390686.aspx' },
  mill: { label: 'Meadow Mills 12″ commercial stone mill listing', url: 'https://restaurantandmore.com/product/meadow-mills-12-stone-burr-standard-commercial-mill/' },
}

const SHELL_CHECK = { item: 'Used 40′ container shell', market: 'CA$1,700–4,500 before delivery', modelled: `$${SHELL.toLocaleString('en-CA')} + $${PLACE.toLocaleString('en-CA')} delivery, placement & footings`, sources: ['shell', 'ontario'] }
const CONVERSION_CHECK = { item: 'Basic conversion (insulation, openings, electrical)', market: 'US$10,000–35,000 per container', modelled: 'See structural and electrical lines', sources: ['mods', 'retail'] }

// layout: interior plan in feet (L along the container, W across), with
// items placed in that space. kind sets the fill colour.
const door = (x, w = 3, label = 'Door') => ({ x, y: 0, w, h: 8, label, kind: 'door' })

export const MODULES = [
  {
    id: 'receiving', name: 'Producer receiving', short: 'Receiving', fn: 'aggregate', color: '#e8b04a',
    min: 0, max: 2, default: 1, containers: 1, footprint: CONTAINER_SQFT,
    description: 'A covered dock where producers drop off pre-ordered product to be checked in, weighed and labelled.',
    capex: { containers: BOX, structural: 22000, electricalPlumbing: 8000 }, // roll-up door with framing, insulation, heat, ramp
    lean: { structural: 3000 }, // scale, tables and a marked drop-off bay
    staffHours: 3, monthly: { energy: 200 },
    capacity: {},
    streams: [],
    layout: { L: 40, W: 8, items: [
      { x: 0, y: 0, w: 8, h: 8, label: 'Roll-up door & ramp', kind: 'door' },
      { x: 9, y: 0.4, w: 5, h: 3, label: 'Floor scale', kind: 'equip' },
      { x: 9, y: 4.6, w: 5, h: 3, label: 'Check-in desk', kind: 'work' },
      { x: 15.5, y: 0.4, w: 24, h: 3.4, label: 'Inbound staging · 6 pallets', kind: 'storage' },
      { x: 15.5, y: 4.2, w: 24, h: 3.4, label: 'Crates, totes & returns', kind: 'storage' },
    ] },
    checks: [SHELL_CHECK, CONVERSION_CHECK],
  },
  {
    id: 'fulfillment', name: 'Order aggregation & fulfillment', short: 'Fulfillment', fn: 'distribute', color: '#c8513b',
    min: 1, max: 3, default: 2, containers: 1, footprint: CONTAINER_SQFT,
    description: 'Packing stations and staging racks where each household or restaurant order is assembled from many producers.',
    capex: { containers: BOX, structural: 28000, electricalPlumbing: 9000 }, // food-grade washable interior, heat, racking, packing tables
    lean: { structural: 6000, electricalPlumbing: 1500 }, // racking and packing stations on the building floor
    monthly: { energy: 250 },
    capacity: { ordersPerWeek: 250 },
    streams: ['marketplace', 'wholesale'],
    layout: { L: 40, W: 8, items: [
      door(0, 3.5),
      { x: 4, y: 0.3, w: 21, h: 2.6, label: 'Packing tables · 3 stations', kind: 'work' },
      { x: 4, y: 5.1, w: 21, h: 2.6, label: 'Order totes on racks', kind: 'storage' },
      { x: 26, y: 0.3, w: 13.7, h: 7.4, label: 'Staged orders for pickup & delivery', kind: 'storage' },
    ] },
    checks: [SHELL_CHECK, CONVERSION_CHECK],
  },
  {
    id: 'cold', name: 'Refrigerated storage', short: 'Cold', fn: 'store', color: '#90b4d0',
    min: 0, max: 3, default: 2, containers: 1, footprint: CONTAINER_SQFT,
    description: 'Shared walk-in cooling for produce, dairy and meat, held at 1–4 °C.',
    capex: { containers: BOX, structural: 18000, refrigeration: 16000, electricalPlumbing: 7000 }, // insulated panel liner, cooler door, condensing unit
    lean: { containers: REEFER, refrigeration: 2500, electricalPlumbing: 3000 }, // used working reefer, serviced
    monthly: { energy: 550 },
    capacity: { coldWeekly: 14000, coldPallets: 16 },
    streams: ['storage'],
    layout: { L: 40, W: 8, items: [
      door(0, 3, 'Insulated door'),
      { x: 3.5, y: 0.3, w: 31, h: 3.6, label: '8 pallet bays × 2 high = 16 positions', kind: 'cold' },
      { x: 3.5, y: 6, w: 31, h: 1.7, label: 'Crate shelving', kind: 'cold' },
      { x: 35, y: 0, w: 5, h: 8, label: 'Cooling unit', kind: 'mech' },
    ] },
    checks: [SHELL_CHECK, { item: 'Used working 40′ reefer (the leaner route)', market: '~US$6,700–8,000 (≈ CA$9,000–11,000) before delivery', modelled: `$${REEFER.toLocaleString('en-CA')} delivered, in the existing-building approach`, sources: ['reefer', 'reeferDealer'] }],
  },
  {
    id: 'frozen', name: 'Frozen storage', short: 'Frozen', fn: 'store', color: '#5f8fb4',
    min: 0, max: 2, default: 1, containers: 1, footprint: CONTAINER_SQFT,
    description: 'Shared −18 °C storage for meat, prepared foods and preserved harvest.',
    capex: { containers: BOX, structural: 22000, refrigeration: 22000, electricalPlumbing: 8000 }, // thicker panels, heated door frame, low-temp unit
    lean: { containers: REEFER, refrigeration: 3000, electricalPlumbing: 3000 }, // used reefer set to −18 °C
    monthly: { energy: 850 },
    capacity: { frozenWeekly: 6000, frozenPallets: 14 },
    streams: ['storage'],
    layout: { L: 40, W: 8, items: [
      door(0, 3, 'Freezer door'),
      { x: 3.5, y: 0.3, w: 28, h: 3.6, label: '7 pallet bays × 2 high = 14 positions', kind: 'frozen' },
      { x: 3.5, y: 6, w: 28, h: 1.7, label: 'Case shelving', kind: 'frozen' },
      { x: 32, y: 0, w: 8, h: 8, label: 'Low-temp unit', kind: 'mech' },
    ] },
    checks: [SHELL_CHECK, { item: 'Used working 40′ reefer (runs to −25 °C)', market: '~US$6,700–8,000 (≈ CA$9,000–11,000) before delivery', modelled: `$${REEFER.toLocaleString('en-CA')} delivered, in the existing-building approach`, sources: ['reefer', 'reeferDealer'] }],
  },
  {
    id: 'dry', name: 'Dry storage', short: 'Dry', fn: 'store', color: '#d9c29a',
    min: 0, max: 2, default: 1, containers: 1, footprint: CONTAINER_SQFT,
    description: 'Racked, pest-proof storage for grains, flour, preserves, coffee and packaging.',
    capex: { containers: BOX, structural: 10000, electricalPlumbing: 3000 }, // insulation against freezing and condensation, racking, vents
    lean: { containers: SHELL + 1500, structural: 2500 }, // used dry container with shelving
    monthly: { energy: 120 },
    capacity: { dryWeekly: 15000, dryPallets: 20 },
    streams: ['storage'],
    layout: { L: 40, W: 8, items: [
      door(0, 3),
      { x: 3.5, y: 0.3, w: 36, h: 3.6, label: '9 pallet bays × 2 high', kind: 'dry' },
      { x: 3.5, y: 5.6, w: 36, h: 2.1, label: 'Shelving · 2 pallets’ worth', kind: 'dry' },
    ] },
    checks: [SHELL_CHECK],
  },
  {
    id: 'combined', name: 'Combined storage (frozen · chilled · dry)', short: 'Combined', fn: 'store', color: '#90b4d0',
    min: 0, max: 2, default: 0, containers: 1, footprint: CONTAINER_SQFT,
    // Drawn as three compartments on the site plan; lengths in feet.
    segments: [{ ft: 12, color: '#5f8fb4', label: 'Frz' }, { ft: 16, color: '#90b4d0', label: 'Chilled' }, { ft: 12, color: '#d9c29a', label: 'Dry' }],
    description: 'One insulated container partitioned into a frozen compartment, a chilled compartment and an unrefrigerated dry end. A low-cost way to start, with less capacity than separate units.',
    capex: { containers: BOX, structural: 24000, refrigeration: 28000, electricalPlumbing: 8000 },
    lean: { containers: REEFER, structural: 4000, refrigeration: 10000, electricalPlumbing: 3000 }, // used reefer, bulkheads, second evaporator
    monthly: { energy: 700 },
    capacity: { coldWeekly: 7000, frozenWeekly: 3000, dryWeekly: 6000, coldPallets: 6, frozenPallets: 5, dryPallets: 6 },
    streams: ['storage'],
    layout: { L: 40, W: 8, items: [
      { x: 0, y: 0, w: 12, h: 8, label: 'Dry · door end · 6 positions', kind: 'dry' },
      { x: 12, y: 0, w: 0.5, h: 8, label: '', kind: 'wall' },
      { x: 12.5, y: 0, w: 15.5, h: 8, label: 'Chilled 1–4 °C · 6 positions', kind: 'cold' },
      { x: 28, y: 0, w: 0.5, h: 8, label: '', kind: 'wall' },
      { x: 28.5, y: 0, w: 7.5, h: 8, label: 'Frozen · 5', kind: 'frozen' },
      { x: 36, y: 0, w: 4, h: 8, label: 'Unit', kind: 'mech' },
    ] },
    checks: [SHELL_CHECK, { item: 'Used working 40′ reefer as the base', market: '~US$6,700–8,000 before delivery', modelled: `$${REEFER.toLocaleString('en-CA')} delivered, plus bulkheads and a second evaporator`, sources: ['reefer'] }],
  },
  {
    id: 'retail', name: 'Retail market', short: 'Retail', fn: 'sell', color: '#2F5D50',
    min: 0, max: 2, default: 1, containers: 2, footprint: CONTAINER_SQFT * 2,
    description: 'A small market hall built from two joined containers, with display coolers, shelving and a checkout.',
    capex: { containers: BOX * 2, structural: 70000, refrigeration: 18000, electricalPlumbing: 22000, retailFitout: 45000 }, // joined boxes, storefront glazing, accessible entry
    staffHours: 20, monthly: { energy: 700 },
    capacity: { retailAnnual: 600000 },
    streams: ['retail'],
    layout: { L: 40, W: 16, items: [
      { x: 0, y: 0, w: 28, h: 2.6, label: 'Display coolers', kind: 'cold' },
      { x: 4, y: 5, w: 18, h: 2.4, label: 'Shelving island', kind: 'dry' },
      { x: 10, y: 9.4, w: 14, h: 2.6, label: 'Produce tables', kind: 'public' },
      { x: 1, y: 11, w: 7, h: 4, label: 'Checkout', kind: 'work' },
      { x: 26, y: 13, w: 10, h: 3, label: 'Glazed entrance', kind: 'door' },
      { x: 30, y: 0, w: 10, h: 9, label: 'Back stock & cooler', kind: 'storage' },
    ] },
    checks: [SHELL_CHECK, { item: 'Turnkey container shop or café', market: '~US$90–200 per sq ft finished (≈ CA$125–275); modifications alone US$10–35k per box', modelled: '≈ CA$265 per sq ft', sources: ['retail', 'mods'] }],
  },
  {
    id: 'hydroponic', name: 'Hydroponic growing', short: 'Hydroponic', fn: 'grow', color: '#a4b787',
    min: 0, max: 3, default: 1, containers: 1, footprint: CONTAINER_SQFT,
    description: 'A turnkey climate-controlled container farm producing greens and herbs year-round, sold through the retail market.',
    capex: { containers: PLACE, electricalPlumbing: 10000, growing: 205000 }, // turnkey farm (container included), freight, hookups
    staffHours: 6, monthly: { energy: 1500 },
    capacity: { growAnnual: 65000 },
    streams: ['onsite'],
    layout: { L: 40, W: 8, items: [
      { x: 0, y: 0, w: 7, h: 8, label: 'Seeding & nursery', kind: 'work' },
      { x: 7.5, y: 0.3, w: 28, h: 2.4, label: 'Vertical grow walls', kind: 'grow' },
      { x: 7.5, y: 5.3, w: 28, h: 2.4, label: 'Vertical grow walls', kind: 'grow' },
      { x: 36, y: 0, w: 4, h: 8, label: 'Climate', kind: 'mech' },
    ] },
    checks: [{ item: 'Turnkey 40′ container farm (e.g. Freight Farms Greenery S)', market: '~US$149,000 new, ~US$138,500 used (≈ CA$190–205k) plus freight', modelled: 'CA$205,000 + placement and hookups', sources: ['freightFarms', 'usedFarm'] }, { item: 'Do-it-yourself container farm', market: 'Roughly US$15,000–100,000, highly variable', modelled: 'Not modelled; a cheaper route if CFC builds its own', sources: [] }],
  },
  {
    id: 'staff', name: 'Staff & sanitation', short: 'Staff', fn: null, color: '#8a7b69',
    min: 0, max: 1, default: 1, containers: 1, footprint: CONTAINER_SQFT,
    description: 'Accessible washrooms, handwashing, a break room and an office. Needed on a new-build site; an existing building usually has its own.',
    capex: { containers: BOX, structural: 30000, electricalPlumbing: 45000 }, // barrier-free washroom, finishes, water heater, sewer or septic share, HVAC
    monthly: { energy: 200 },
    capacity: {},
    streams: [],
    layout: { L: 40, W: 8, items: [
      { x: 0, y: 0, w: 9, h: 8, label: 'Accessible washroom', kind: 'work' },
      { x: 9.5, y: 0, w: 6, h: 8, label: 'Washroom', kind: 'work' },
      { x: 16, y: 0, w: 6, h: 8, label: 'Handwash & lockers', kind: 'equip' },
      { x: 22.5, y: 0, w: 9, h: 8, label: 'Break room', kind: 'public' },
      { x: 32, y: 0, w: 8, h: 8, label: 'Office', kind: 'work' },
    ] },
    checks: [SHELL_CHECK, CONVERSION_CHECK],
  },
  {
    id: 'kitchen', name: 'Commercial processing kitchen', short: 'Kitchen', fn: 'process', color: '#802048',
    min: 0, max: 2, default: 0, containers: 1, footprint: CONTAINER_SQFT,
    description: 'An inspected kitchen that producers can rent by the hour for preserving, baking and value-added products.',
    capex: { containers: BOX, structural: 35000, electricalPlumbing: 35000, processing: 75000 }, // food-grade finishes, grease interceptor, hood and fire suppression, equipment
    staffHours: 2, monthly: { energy: 500 },
    capacity: { kitchenHours: 1 }, // multiplied by the kitchen-hours assumption
    streams: ['processing'],
    layout: { L: 40, W: 8, items: [
      door(0, 3),
      { x: 3.5, y: 0.3, w: 14, h: 2.6, label: 'Range & ovens under hood', kind: 'equip' },
      { x: 18, y: 0.3, w: 8, h: 2.6, label: '3-bay sink', kind: 'equip' },
      { x: 3.5, y: 5.1, w: 16, h: 2.6, label: 'Stainless prep tables', kind: 'work' },
      { x: 20, y: 5.1, w: 6, h: 2.6, label: 'Handwash', kind: 'equip' },
      { x: 27, y: 0, w: 7, h: 8, label: 'Reach-in coolers', kind: 'cold' },
      { x: 34.5, y: 0, w: 5.5, h: 8, label: 'Dry goods', kind: 'dry' },
    ] },
    checks: [SHELL_CHECK, { item: 'Container kitchen builds', market: 'US$20,000–50,000 quoted by vendors, often before hood, fire suppression and utility hookups', modelled: 'Higher, to include those and inspection-ready finishes', sources: ['kitchen'] }],
  },
  {
    id: 'greenhouse', name: 'Greenhouse', short: 'Greenhouse', fn: 'grow', color: '#c5d4a8',
    min: 0, max: 2, default: 0, containers: 0, footprint: 30 * 48,
    description: 'A 30′ × 48′ four-season greenhouse extending the local growing season, sold through the retail market.',
    capex: { structural: 25000, electricalPlumbing: 15000, growing: 70000 },
    staffHours: 8, monthly: { energy: 1300 },
    capacity: { growAnnual: 55000 },
    streams: ['onsite'],
    layout: { L: 48, W: 30, items: [
      door(0, 4),
      { x: 5, y: 2, w: 40, h: 5, label: 'Growing bed', kind: 'grow' },
      { x: 5, y: 9.5, w: 40, h: 5, label: 'Growing bed', kind: 'grow' },
      { x: 5, y: 17, w: 40, h: 5, label: 'Growing bed', kind: 'grow' },
      { x: 5, y: 24, w: 30, h: 4, label: 'Propagation benches', kind: 'work' },
      { x: 37, y: 24, w: 10, h: 5, label: 'Heater & fans', kind: 'mech' },
    ] },
    checks: [{ item: 'Not independently benchmarked', market: 'Get local greenhouse quotes', modelled: 'Structure, heating and benches', sources: [] }],
  },

  // Shared producer services. `service` describes the per-unit fee model:
  // producers bring volume (an assumption), the module caps it, and each unit
  // carries a fee and some staff time.
  {
    id: 'eggGrading', name: 'Egg grading station', short: 'Egg grading', fn: 'process', color: '#f0d9a0',
    min: 0, max: 1, default: 0, containers: 1, footprint: CONTAINER_SQFT,
    description: 'Shared washing, candling, grading and cold holding, so small flocks can sell graded eggs to stores and restaurants, not only at the farm gate.',
    capex: { containers: BOX, structural: 22000, refrigeration: 12000, electricalPlumbing: 8000, processing: 35000 },
    lean: { structural: 4000, refrigeration: 8000, electricalPlumbing: 3000, processing: 35000 },
    monthly: { energy: 250 },
    capacity: {},
    service: { unit: 'dozen', units: 'dozen', perWeek: 1500, minutesPerUnit: 0.5, volume: 'eggDozensPerWeek', fee: 'eggGradingFee' },
    streams: ['services'],
    layout: { L: 40, W: 8, items: [
      door(0, 3),
      { x: 3.5, y: 0.3, w: 7, h: 3, label: 'Intake & washer', kind: 'equip' },
      { x: 11, y: 0.3, w: 6, h: 3, label: 'Candler', kind: 'equip' },
      { x: 17.5, y: 0.3, w: 8, h: 3, label: 'Grader', kind: 'equip' },
      { x: 3.5, y: 5, w: 22, h: 2.7, label: 'Packing table & labels', kind: 'work' },
      { x: 26.5, y: 0, w: 13.5, h: 8, label: 'Egg cooler · graded stock', kind: 'cold' },
    ] },
    checks: [SHELL_CHECK, { item: 'Washer, candler and grader', market: '~US$20,000 for a used combined unit (3,200–5,000 eggs/hr)', modelled: 'CA$35,000 with packing table, scale and labelling', sources: ['egg'] }],
  },
  {
    id: 'grainMill', name: 'Grain mill', short: 'Grain mill', fn: 'process', color: '#c9a66b',
    min: 0, max: 1, default: 0, containers: 1, footprint: CONTAINER_SQFT,
    description: 'A stone mill with grain cleaning and sifting, turning regional wheat, rye, spelt and corn into flour, meal and cereal for bakers and households.',
    capex: { containers: BOX, structural: 18000, electricalPlumbing: 9000, processing: 38000 }, // food-grade finish, dust control; mill, cleaner, sifter, bagging
    lean: { structural: 3000, electricalPlumbing: 5000, processing: 38000 },
    monthly: { energy: 300 },
    capacity: {},
    service: { unit: 'kg', units: 'kg', perWeek: 1500, minutesPerUnit: 0.05, volume: 'grainKgPerWeek', fee: 'millingFeePerKg' },
    streams: ['services'],
    layout: { L: 40, W: 8, items: [
      door(0, 3),
      { x: 3.5, y: 0.3, w: 8, h: 3.4, label: 'Grain intake & cleaner', kind: 'equip' },
      { x: 12, y: 0.3, w: 6, h: 3.4, label: 'Stone mill', kind: 'equip' },
      { x: 18.5, y: 0.3, w: 6, h: 3.4, label: 'Sifter', kind: 'equip' },
      { x: 25, y: 0.3, w: 7, h: 3.4, label: 'Bagging & scale', kind: 'work' },
      { x: 3.5, y: 5, w: 28.5, h: 2.7, label: 'Grain & flour storage (pallets)', kind: 'dry' },
      { x: 32.5, y: 0, w: 7.5, h: 8, label: 'Dust collection', kind: 'mech' },
    ] },
    checks: [SHELL_CHECK, { item: 'Commercial stone mill', market: '~US$7,400–7,600 for a 12″ stone-burr mill (110–190 lb/hr); US$2,000–15,000+ across models', modelled: 'CA$38,000 for mill, cleaner, sifter, dust collection and bagging', sources: ['mill'] }],
  },
  {
    id: 'butchery', name: 'Cut-and-wrap butchery', short: 'Butchery', fn: 'process', color: '#b5655a',
    min: 0, max: 1, default: 0, containers: 1, footprint: CONTAINER_SQFT,
    description: 'A refrigerated cutting room where carcasses from licensed abattoirs are cut, packaged and labelled to each producer’s order. Not a slaughter facility.',
    capex: { containers: BOX, structural: 28000, refrigeration: 22000, electricalPlumbing: 15000, processing: 30000 }, // carcass cooler with rail, chilled cutting room
    lean: { structural: 8000, refrigeration: 15000, electricalPlumbing: 8000, processing: 30000 },
    monthly: { energy: 600 },
    capacity: {},
    service: { unit: 'carcass', units: 'carcasses', perWeek: 10, minutesPerUnit: 150, volume: 'carcassesPerWeek', fee: 'butcheryFee' },
    streams: ['services'],
    layout: { L: 40, W: 8, items: [
      door(0, 3),
      { x: 3.5, y: 0.3, w: 9, h: 3, label: 'Band saw & grinder', kind: 'equip' },
      { x: 3.5, y: 5, w: 12, h: 2.7, label: 'Cutting tables', kind: 'work' },
      { x: 13, y: 0.3, w: 9, h: 3, label: 'Vacuum packer & labels', kind: 'equip' },
      { x: 16, y: 5, w: 6, h: 2.7, label: 'Handwash', kind: 'equip' },
      { x: 22.5, y: 0, w: 0.5, h: 8, label: '', kind: 'wall' },
      { x: 23, y: 0, w: 17, h: 8, label: 'Carcass cooler on rail', kind: 'cold' },
    ] },
    checks: [SHELL_CHECK, CONVERSION_CHECK],
  },
]

export const MODULE_BY_ID = Object.fromEntries(MODULES.map(m => [m.id, m]))
export const DEFAULT_MODULES = Object.fromEntries(MODULES.map(m => [m.id, m.default]))

// ── Customer segments ───────────────────────────────────────────────────────
// Retail = households (online marketplace and walk-in market).
// Wholesale = businesses, modelled as accounts × average weekly order.

export const WHOLESALE_SEGMENTS = [
  { id: 'restaurants', label: 'Restaurants & cafés', accounts: 'restaurantAccounts', weekly: 'restaurantWeekly', color: '#802048' },
  { id: 'grocers', label: 'Grocers & retailers', accounts: 'grocerAccounts', weekly: 'grocerWeekly', color: '#c48a1f' },
  { id: 'institutions', label: 'Institutions', accounts: 'institutionAccounts', weekly: 'institutionWeekly', color: '#5f8fb4' },
]

// ── Income streams (labels shared by the builder and the operating model) ──

export const STREAMS = {
  marketplace: 'Consignment: online sales',
  retail: 'Consignment: walk-in market',
  storage: 'Storage rental',
  wholesale: 'Wholesale margin (restaurants, grocers, institutions)',
  onsite: 'On-site food production',
  processing: 'Processing services (kitchen rental)',
  services: 'Shared producer services',
}

// ── Editable assumptions ────────────────────────────────────────────────────
// kind: count | cad | pct | decimal | minutes | years | select
// Percentages are stored as fractions (0.04 = 4%).

export const PARAM_GROUPS = [
  { id: 'market', label: 'Regional market' },
  { id: 'wholesale', label: 'Wholesale customers' },
  { id: 'labour', label: 'Labour' },
  { id: 'delivery', label: 'Delivery & transportation' },
  { id: 'overheads', label: 'Utilities, insurance & overheads' },
  { id: 'site', label: 'Site & capital' },
  { id: 'income', label: 'Service income' },
  { id: 'services', label: 'Shared producer services' },
  { id: 'capacity', label: 'Storage throughput mix' },
]

export const PARAMS = {
  // Regional market (Section F)
  population: { group: 'market', label: 'Regional population', kind: 'count', min: 2000, max: 250000, step: 500, default: 25700, help: 'Roughly Prince Edward County’s 2021 Census population.' },
  householdSize: { group: 'market', label: 'Average household size', kind: 'decimal', min: 1.5, max: 3.5, step: 0.1, default: 2.2, help: 'People per household.' },
  newHouseholds: { group: 'market', label: 'New households nearby', kind: 'count', min: 0, max: 7500, step: 50, default: 0, help: 'Homes in planned developments, such as the residential phases proposed at Base31. Each one adds recurring weekly demand.' },
  weeklySpend: { group: 'market', label: 'Weekly household food spending', kind: 'cad', min: 100, max: 400, step: 5, default: 230, help: 'Groceries and food purchased for home, per household per week.' },
  addressablePct: { group: 'market', label: 'Addressable by regional producers', kind: 'pct', min: 0.05, max: 1, step: 0.01, default: 0.3, term: 'addressable', help: 'Share of food spending regional producers could plausibly supply.' },
  capturePct: { group: 'market', label: 'Market capture', kind: 'pct', min: 0, max: 0.3, step: 0.0025, default: 0.04, term: 'capture', help: 'Share of the addressable market the terminal earns. Never more than the addressable market.' },
  aov: { group: 'market', label: 'Average order value', kind: 'cad', min: 30, max: 200, step: 5, default: 75, term: 'aov' },
  consignmentPct: { group: 'market', label: 'Consignment rate', kind: 'pct', min: 0, max: 0.5, step: 0.01, default: 0.2, term: 'consignment', help: 'Share of each sale the terminal keeps. Producers consign their products and receive the rest when they sell, online or walk-in.' },
  retailMixPct: { group: 'market', label: 'Retail share of sales', kind: 'pct', min: 0, max: 0.8, step: 0.05, default: 0.3, help: 'Walk-in retail sales, the rest through the online marketplace. Needs a retail module.' },

  // Wholesale customers (Section F): businesses buying on top of household demand
  restaurantAccounts: { group: 'wholesale', label: 'Restaurant accounts', kind: 'count', min: 0, max: 60, step: 1, default: 8, help: 'Restaurants, cafés and winery kitchens ordering weekly.' },
  restaurantWeekly: { group: 'wholesale', label: 'Restaurant weekly order', kind: 'cad', min: 50, max: 3000, step: 25, default: 300 },
  grocerAccounts: { group: 'wholesale', label: 'Grocer accounts', kind: 'count', min: 0, max: 20, step: 1, default: 2, help: 'Independent grocers, general stores and farm stands stocking regional product.' },
  grocerWeekly: { group: 'wholesale', label: 'Grocer weekly order', kind: 'cad', min: 50, max: 5000, step: 25, default: 400 },
  institutionAccounts: { group: 'wholesale', label: 'Institution accounts', kind: 'count', min: 0, max: 10, step: 1, default: 0, help: 'Schools, long-term care and hospitals. Procurement takes time, so none by default.' },
  institutionWeekly: { group: 'wholesale', label: 'Institution weekly order', kind: 'cad', min: 100, max: 10000, step: 50, default: 800 },
  wholesaleMarginPct: { group: 'wholesale', label: 'Terminal margin on wholesale', kind: 'pct', min: 0, max: 0.3, step: 0.01, default: 0.12, help: 'Share of each wholesale sale the terminal keeps; the rest goes to producers.' },
  wholesalePackMinutes: { group: 'wholesale', label: 'Packing time per wholesale order', kind: 'minutes', min: 0, max: 60, step: 1, default: 15, help: 'Wholesale orders are larger; each is delivered.' },

  // Labour
  coreStaffHours: { group: 'labour', label: 'Core operations hours', kind: 'count', min: 0, max: 200, step: 1, default: 10, unit: 'hr/wk', help: 'The standing work that does not grow with each order: scheduling producer drop-offs, keeping the online store and inventory current, answering customers and bookkeeping. Packing, module staff and drivers are counted separately.' },
  wageHourly: { group: 'labour', label: 'Loaded hourly wage', kind: 'cad', min: 15, max: 50, step: 0.5, default: 25, unit: '/hr' },
  packMinutesPerOrder: { group: 'labour', label: 'Packing time per online order', kind: 'minutes', min: 0, max: 30, step: 0.5, default: 6, help: 'Variable labour for each marketplace order.' },

  // Delivery
  deliveryShare: { group: 'delivery', label: 'Online orders delivered', kind: 'pct', min: 0, max: 1, step: 0.05, default: 0.5, help: 'The rest are picked up.' },
  driverHourly: { group: 'delivery', label: 'Driver pay per hour', kind: 'cad', min: 0, max: 40, step: 0.5, default: 18, unit: '/hr', help: 'Contract drivers, paid gig-style for time on route.' },
  driverKmRate: { group: 'delivery', label: 'Driver pay per km', kind: 'cad', min: 0, max: 1, step: 0.01, default: 0.2, unit: '/km', help: 'Mileage paid to the driver, who uses their own vehicle.' },
  stopsPerHour: { group: 'delivery', label: 'Stops per driver hour', kind: 'decimal', min: 1, max: 15, step: 0.5, default: 4, help: 'Including driving between stops and back to the terminal. Rural routes are slower.' },
  kmPerStop: { group: 'delivery', label: 'Route km per stop', kind: 'count', min: 0, max: 50, step: 1, default: 12, unit: 'km', help: 'Total route distance, including the return trip, divided by stops.' },
  deliveryFee: { group: 'delivery', label: 'Delivery fee recovered', kind: 'cad', min: 0, max: 20, step: 0.25, default: 4, help: 'Charged to the customer per delivered order.' },

  // Overheads
  softwareMonthly: { group: 'overheads', label: 'Software', kind: 'cad', min: 0, max: 5000, step: 50, default: 100, unit: '/mo' },
  paymentPct: { group: 'overheads', label: 'Payment processing', kind: 'pct', min: 0, max: 0.05, step: 0.001, default: 0.029, help: 'Share of everything sold.' },
  siteBaseEnergyMonthly: { group: 'overheads', label: 'Site electricity & heating (base)', kind: 'cad', min: 0, max: 3000, step: 50, default: 300, unit: '/mo', help: 'Lighting and common areas, on top of each module’s own use.' },
  waterMonthly: { group: 'overheads', label: 'Water & sewer', kind: 'cad', min: 0, max: 2000, step: 10, default: 150, unit: '/mo', help: 'The whole site: washrooms, cleaning, and the kitchen or growing if built.' },
  insuranceBaseMonthly: { group: 'overheads', label: 'Liability insurance', kind: 'cad', min: 0, max: 3000, step: 50, default: 400, unit: '/mo' },
  insurancePctCapex: { group: 'overheads', label: 'Equipment & contents insurance (of capital, per year)', kind: 'pct', min: 0, max: 0.03, step: 0.001, default: 0.004, help: 'Building insurance is usually the facility owner’s under a lease.' },
  maintenancePctCapex: { group: 'overheads', label: 'Day-to-day maintenance (of capital, per year)', kind: 'pct', min: 0, max: 0.05, step: 0.001, default: 0.008, help: 'Major repairs are usually the facility owner’s under a lease.' },
  retailShrinkPct: { group: 'overheads', label: 'Retail inventory loss', kind: 'pct', min: 0, max: 0.15, step: 0.005, default: 0.04, help: 'Share of retail stock (at cost) lost to spoilage.' },
  marketplaceLossPct: { group: 'overheads', label: 'Marketplace inventory loss', kind: 'pct', min: 0, max: 0.05, step: 0.001, default: 0.005, help: 'Low, because producers harvest against confirmed orders.' },

  // Site & capital
  tenure: { group: 'site', label: 'Site approach', kind: 'select', options: [{ value: 'lease', label: 'Lease land, build new' }, { value: 'own', label: 'Buy land, build new' }, { value: 'building', label: 'Lease space in an existing building' }], default: 'lease', help: 'An existing building skips site preparation and uses used containers and equipment where possible.' },
  leaseMonthly: { group: 'site', label: 'Facility lease', kind: 'cad', min: 0, max: 30000, step: 100, default: 2500, unit: '/mo', help: 'Paid to whoever provides the facilities. Not used when buying land.' },
  leaseholdPrep: { group: 'site', label: 'Lease setup', kind: 'cad', min: 0, max: 300000, step: 1000, default: 15000, help: 'Legal and setup costs for a lease. Base31 owns the land and buildings, so no land purchase or transfer is assumed; grading and paving are under site preparation.' },
  landPurchase: { group: 'site', label: 'Land purchase', kind: 'cad', min: 0, max: 2000000, step: 10000, default: 275000, help: 'Only when buying.' },
  sitePrepPerSqft: { group: 'site', label: 'Site preparation per sq ft', kind: 'cad', min: 0, max: 30, step: 0.5, default: 6, help: 'Grading, gravel, paving and landscaping across the whole site.' },
  siteCoverage: { group: 'site', label: 'Building coverage of site', kind: 'pct', min: 0.1, max: 0.6, step: 0.01, default: 0.3, help: 'Buildings as a share of total site area; the rest is circulation, parking and courtyard.' },
  minSiteSqft: { group: 'site', label: 'Minimum site area', kind: 'count', min: 0, max: 80000, step: 1000, default: 15000, unit: 'sq ft' },
  sharedInfrastructure: { group: 'site', label: 'Shared infrastructure', kind: 'cad', min: 0, max: 500000, step: 1000, default: 110000, help: 'Electrical service upgrade, water and septic or municipal servicing. In an existing building, mainly power for refrigeration.' },
  profFeesPct: { group: 'site', label: 'Professional fees & permits', kind: 'pct', min: 0, max: 0.25, step: 0.01, default: 0.1, help: 'Share of construction costs (excluding land).' },
  contingencyPct: { group: 'site', label: 'Contingency', kind: 'pct', min: 0, max: 0.4, step: 0.01, default: 0.15, term: 'contingency' },

  // Service income
  storageRentableShare: { group: 'income', label: 'Storage offered for rent', kind: 'pct', min: 0, max: 0.8, step: 0.05, default: 0.3, help: 'Share of pallet positions rented to producers and restaurants.' },
  storageOccupancy: { group: 'income', label: 'Rented storage occupancy', kind: 'pct', min: 0, max: 1, step: 0.05, default: 0.7 },
  storageRateCold: { group: 'income', label: 'Cold storage rent per pallet', kind: 'cad', min: 0, max: 200, step: 5, default: 45, unit: '/mo' },
  storageRateFrozen: { group: 'income', label: 'Frozen storage rent per pallet', kind: 'cad', min: 0, max: 200, step: 5, default: 60, unit: '/mo' },
  storageRateDry: { group: 'income', label: 'Dry storage rent per pallet', kind: 'cad', min: 0, max: 200, step: 5, default: 25, unit: '/mo' },
  kitchenHoursPerMonth: { group: 'income', label: 'Kitchen hours rented per kitchen', kind: 'count', min: 0, max: 400, step: 5, default: 60, unit: 'hr/mo' },
  kitchenRate: { group: 'income', label: 'Kitchen rental rate', kind: 'cad', min: 0, max: 100, step: 1, default: 35, unit: '/hr' },

  // Shared producer services (only count when the module is built)
  eggDozensPerWeek: { group: 'services', label: 'Eggs brought for grading', kind: 'count', min: 0, max: 5000, step: 50, default: 800, unit: 'dozen/wk' },
  eggGradingFee: { group: 'services', label: 'Grading fee per dozen', kind: 'cad', min: 0, max: 2, step: 0.05, default: 0.5 },
  grainKgPerWeek: { group: 'services', label: 'Grain brought for milling', kind: 'count', min: 0, max: 5000, step: 50, default: 600, unit: 'kg/wk' },
  millingFeePerKg: { group: 'services', label: 'Milling fee per kg', kind: 'cad', min: 0, max: 3, step: 0.05, default: 0.6 },
  carcassesPerWeek: { group: 'services', label: 'Carcasses brought for cut-and-wrap', kind: 'count', min: 0, max: 30, step: 1, default: 5, unit: '/wk', help: 'Hogs, lambs and goats; beef sides count as more than one.' },
  butcheryFee: { group: 'services', label: 'Cut-and-wrap fee per carcass', kind: 'cad', min: 0, max: 500, step: 5, default: 160 },

  // Storage throughput mix (for capacity flags)
  coldSharePct: { group: 'capacity', label: 'Sales needing refrigeration', kind: 'pct', min: 0, max: 1, step: 0.05, default: 0.5 },
  frozenSharePct: { group: 'capacity', label: 'Sales needing freezing', kind: 'pct', min: 0, max: 1, step: 0.05, default: 0.1 },
  drySharePct: { group: 'capacity', label: 'Shelf-stable sales', kind: 'pct', min: 0, max: 1, step: 0.05, default: 0.4 },

}

// One editable staffing assumption per module that needs staff.
for (const m of MODULES) {
  if (m.staffHours) {
    PARAMS[`staff_${m.id}`] = { group: 'labour', label: `${m.name} staffing`, kind: 'count', min: 0, max: 120, step: 1, default: m.staffHours, unit: 'hr/wk each' }
  }
}

export const DEFAULTS = Object.fromEntries(Object.entries(PARAMS).map(([k, p]) => [k, p.default]))

// ── Illustrative scenarios ──────────────────────────────────────────────────

export const SCENARIOS = [
  {
    id: 'starter', label: 'Starter',
    blurb: 'A first permanent home: one combined frozen, chilled and dry storage container in leased space in an existing building.',
    modules: { receiving: 0, fulfillment: 1, cold: 0, frozen: 0, dry: 0, combined: 1, retail: 0, hydroponic: 0, staff: 0 },
    overrides: {
      tenure: 'building', leaseMonthly: 1500, leaseholdPrep: 0, sharedInfrastructure: 12000, profFeesPct: 0.05,
      capturePct: 0.006, siteBaseEnergyMonthly: 150, insuranceBaseMonthly: 250,
      restaurantAccounts: 4, grocerAccounts: 1, minSiteSqft: 0,
    },
  },
  {
    id: 'conservative', label: 'Conservative',
    blurb: 'A smaller first build, slow uptake, thinner margins, higher contingency.',
    modules: { fulfillment: 1, cold: 1, hydroponic: 0 },
    overrides: { capturePct: 0.02, weeklySpend: 210, addressablePct: 0.25, aov: 65, storageOccupancy: 0.5, restaurantAccounts: 5, grocerAccounts: 1, contingencyPct: 0.2 },
  },
  { id: 'base', label: 'Base', blurb: 'The default illustrative terminal and assumptions.', modules: {}, overrides: {} },
  {
    id: 'optimistic', label: 'Optimistic',
    blurb: 'A larger terminal sized to stronger uptake and healthy commercial demand.',
    // The smallest build that clears every capacity flag at this demand.
    modules: { fulfillment: 3, cold: 3, frozen: 2, dry: 2, combined: 1, retail: 2, kitchen: 1 },
    overrides: { capturePct: 0.07, weeklySpend: 250, addressablePct: 0.35, aov: 85, storageOccupancy: 0.85, restaurantAccounts: 15, restaurantWeekly: 350, grocerAccounts: 4, institutionAccounts: 1, contingencyPct: 0.1 },
  },
]

export const scenarioAssumptions = id => ({ ...DEFAULTS, ...(SCENARIOS.find(s => s.id === id)?.overrides ?? {}) })
// Each scenario also implies a terminal size, so switching scenarios changes the site plan too.
export const scenarioModules = id => ({ ...DEFAULT_MODULES, ...(SCENARIOS.find(s => s.id === id)?.modules ?? {}) })

// ── Network (Section H) ─────────────────────────────────────────────────────
// One terminal per region. PEC is the pilot; the others are generic region
// archetypes and none refers to a real or planned location.

export const ARCHETYPES = [
  { id: 'smallTown', label: 'Small agricultural region', population: 12000 },
  { id: 'ruralCounty', label: 'Rural county', population: 30000 },
  { id: 'regionalCentre', label: 'Regional centre & farmland', population: 65000 },
]

export const MAX_TERMINALS = 9

// ── Glossary (tooltips) ─────────────────────────────────────────────────────

export const GLOSSARY = {
  gmv: { term: 'Gross merchandise value (GMV)', def: 'The total value of food sold through the terminal, before producers are paid. It is not the terminal’s revenue.' },
  addressable: { term: 'Addressable market', def: 'The part of regional food spending that regional producers could realistically supply: fresh produce, meat, dairy, eggs, baked goods and preserves, but not bananas or coffee beans.' },
  capture: { term: 'Market capture', def: 'The share of the addressable market the terminal actually earns. It can never exceed the addressable market itself.' },
  aov: { term: 'Average order value', def: 'The average amount a customer spends per order. Used to turn sales into an equivalent number of weekly orders.' },
  consignment: { term: 'Consignment', def: 'Producers place their products with the terminal and keep ownership until they sell. When an item sells, online or in the market, the terminal keeps the consignment rate and pays the producer the rest. There are no marketplace fees and no wholesale buying of stock.' },
  retained: { term: 'Retained revenue', def: 'The money the terminal keeps after producers are paid: its consignment share of online and walk-in sales, the wholesale margin and the full value of food it grows itself.' },
  payouts: { term: 'Producer payouts', def: 'Money paid to regional producers for the food sold through the terminal.' },
  capex: { term: 'Capital to provide', def: 'One-time cost to set up the facilities: site, containers, equipment, fees and contingency. The approach assumed here is that partners provide the facilities and CFC leases them, so this is what partners or funders would need to put in, not CFC debt.' },
  opex: { term: 'Operating costs', def: 'Recurring monthly costs of running the terminal: staff, rent, utilities, insurance, delivery, software and losses.' },
  surplus: { term: 'Operating surplus', def: 'Monthly income minus monthly operating costs, including the facility lease. Negative means a deficit.' },
  breakEven: { term: 'Break-even sales volume', def: 'The annual household sales at which income covers operating costs, holding the sales mix and every other assumption constant. Found by searching the model, so it accounts for variable costs and fixed overhead.' },
  contingency: { term: 'Contingency', def: 'An allowance for costs that are unknown at the concept stage, applied as a share of construction costs.' },
  throughput: { term: 'Throughput', def: 'The value of product a module can comfortably handle each week.' },
}
