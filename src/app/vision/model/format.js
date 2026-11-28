const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 })
const cadCompact = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol', notation: 'compact', maximumFractionDigits: 1 })
const num = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 })

export const fmtCad = n => cad.format(Math.round(n))
export const fmtCadCompact = n => (Math.abs(n) < 10000 ? cad.format(Math.round(n)) : cadCompact.format(n))
export const fmtNum = n => num.format(Math.round(n))
export const fmtPct = (n, digits) => {
  const v = n * 100
  const d = digits ?? (v !== 0 && Math.abs(v) < 10 && !Number.isInteger(Math.round(v * 100) / 100) ? 1 : 0)
  return `${v.toFixed(d).replace(/\.0+$/, '')}%`
}
export const fmtSqft = n => `${num.format(Math.round(n))} sq ft`
export const fmtAcres = sqft => `${(sqft / 43560).toFixed(2)} acres`

// Format a value according to its PARAMS kind.
export function fmtParam(p, v) {
  switch (p.kind) {
    case 'cad': return `${v < 100 && !Number.isInteger(v) ? `$${v.toFixed(2)}` : fmtCad(v)}${p.unit ?? ''}`
    case 'pct': return fmtPct(v, p.step < 0.01 ? 1 : 0)
    case 'decimal': return v.toFixed(1)
    case 'minutes': return `${v} min`
    case 'years': return `${v} yr`
    case 'count': return `${fmtNum(v)}${p.unit ? ` ${p.unit}` : ''}`
    default: return String(v)
  }
}
