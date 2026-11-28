'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { GLOSSARY, PARAMS, SCENARIOS } from './model/config.js'
import { fmtParam } from './model/format.js'
import { useVision } from './state'

export const DISCLAIMER =
  'This page explores a conceptual long-term vision for County Farm Collective. Proposed facilities, locations, capacities and financial projections are illustrative and subject to feasibility studies, funding, regulatory approvals and further development. They do not represent committed projects or financial forecasts.'

export function Disclaimer({ className = '' }) {
  return (
    <aside className={`flex gap-3 rounded-2xl border border-[#e8b04a]/60 bg-[#fdf3dc] p-4 text-sm leading-6 text-[#5f4a2a] ${className}`} aria-label="Disclaimer">
      <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 5.5v6M10 13.8v.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <p>{DISCLAIMER}</p>
    </aside>
  )
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

// Inline "?" button that explains a financial term on hover, focus or tap.
export function Term({ k, children }) {
  const g = GLOSSARY[k]
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  if (!g) return children ?? null
  return (
    <span ref={ref} className="relative inline-flex items-baseline gap-1">
      {children ?? g.term}
      <button
        type="button"
        className="relative top-[1px] inline-flex h-4 w-4 shrink-0 items-center justify-center self-center rounded-full border border-current text-[10px] font-bold leading-none text-[#8a7b69] transition hover:text-brand-primary focus-visible:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        aria-label={`What is ${g.term.toLowerCase()}?`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="absolute left-1/2 top-full z-40 mt-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-xl border border-[#e2d8ca] bg-[#3F3228] p-3 text-left text-xs font-normal normal-case leading-5 tracking-normal text-[#f6f1e7] shadow-lg"
        >
          <strong className="mb-1 block font-semibold text-white">{g.term}</strong>
          {g.def}
        </span>
      )}
    </span>
  )
}

// Converts between stored values (fractions) and what people type (percent).
const toInput = (p, v) => (p.kind === 'pct' ? +(v * 100).toFixed(2) : v)
const fromInput = (p, v) => (p.kind === 'pct' ? v / 100 : v)

function NumberBox({ k, p, value, dispatch, labelId }) {
  const [draft, setDraft] = useState(null)
  const commit = () => {
    if (draft == null) return
    const n = parseFloat(draft)
    if (Number.isFinite(n)) dispatch({ type: 'set', key: k, value: fromInput(p, n) })
    setDraft(null)
  }
  return (
    <span className="inline-flex items-center rounded-lg border border-[#d9cdbb] bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
      {p.kind === 'cad' && <span className="pl-2 text-xs text-[#8a7b69]">$</span>}
      <input
        type="number"
        inputMode="decimal"
        aria-labelledby={labelId}
        className="w-20 bg-transparent px-2 py-1 text-right text-sm tabular-nums text-[#3F3228] outline-none"
        value={draft ?? toInput(p, value)}
        min={toInput(p, p.min)}
        max={toInput(p, p.max)}
        step={toInput(p, p.step)}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit() }}
      />
      {p.kind === 'pct' && <span className="pr-2 text-xs text-[#8a7b69]">%</span>}
    </span>
  )
}

// A labelled range slider plus a precise number box for one assumption.
export function ParamSlider({ k }) {
  const { state, dispatch } = useVision()
  const p = PARAMS[k]
  const value = state.a[k]
  const labelId = useId()
  const helpId = useId()
  const fill = ((value - p.min) / (p.max - p.min)) * 100
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span id={labelId} className="text-sm font-medium text-[#3F3228]">
          {p.term ? <Term k={p.term}>{p.label}</Term> : p.label}
        </span>
        <NumberBox k={k} p={p} value={value} dispatch={dispatch} labelId={labelId} />
      </div>
      <input
        type="range"
        aria-labelledby={labelId}
        aria-describedby={p.help ? helpId : undefined}
        aria-valuetext={fmtParam(p, value)}
        min={p.min}
        max={p.max}
        step={p.step}
        value={value}
        onChange={e => dispatch({ type: 'set', key: k, value: Number(e.target.value) })}
        className="vision-range mt-2 w-full"
        style={{ '--fill': `${fill}%` }}
      />
      {p.help && <p id={helpId} className="mt-1 text-xs leading-5 text-[#8a7b69]">{p.help}</p>}
    </div>
  )
}

// Small labelled input used inside the cost breakdown.
export function InlineParam({ k, label }) {
  const { state, dispatch } = useVision()
  const p = PARAMS[k]
  const labelId = useId()
  if (!p) return null
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-[#f6f1e7] py-1 pl-2.5 pr-1">
      <span id={labelId} className="text-xs text-[#5f5244]">{label ?? p.label}</span>
      <NumberBox k={k} p={p} value={state.a[k]} dispatch={dispatch} labelId={labelId} />
      {p.kind === 'minutes' && <span className="pr-1.5 text-xs text-[#8a7b69]">min</span>}
      {p.kind === 'cad' && p.unit && <span className="pr-1.5 text-xs text-[#8a7b69]">{p.unit}</span>}
    </span>
  )
}

// Compact field for the full assumptions editor.
export function ParamField({ k }) {
  const { state, dispatch } = useVision()
  const p = PARAMS[k]
  const labelId = useId()
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#efe6d8] py-2 last:border-0">
      <span id={labelId} className="text-sm text-[#3F3228]">
        {p.term ? <Term k={p.term}>{p.label}</Term> : p.label}
        {p.unit && p.kind !== 'count' && <span className="ml-1 text-xs text-[#8a7b69]">{p.unit}</span>}
        {p.help && <span className="block text-xs leading-5 text-[#8a7b69]">{p.help}</span>}
      </span>
      {p.kind === 'select' ? (
        <select
          aria-labelledby={labelId}
          value={state.a[k]}
          onChange={e => dispatch({ type: 'set', key: k, value: e.target.value })}
          className="rounded-lg border border-[#d9cdbb] bg-white px-2 py-1 text-sm text-[#3F3228] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          {p.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <NumberBox k={k} p={p} value={state.a[k]} dispatch={dispatch} labelId={labelId} />
      )}
    </div>
  )
}

export function Stat({ label, term, value, sub, tone = 'default', big = false }) {
  const toneClass = {
    default: 'text-[#3F3228]',
    good: 'text-[#2F5D50]',
    bad: 'text-brand-primary-dark',
    muted: 'text-[#8a7b69]',
  }[tone]
  return (
    <div className="rounded-xl border border-[#e2d8ca] bg-[#fffdf8] p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7b69]">
        {term ? <Term k={term}>{label}</Term> : label}
      </dt>
      <dd className={`mt-1 font-semibold tabular-nums ${big ? 'text-3xl' : 'text-2xl'} ${toneClass}`}>{value}</dd>
      {sub && <dd className="mt-1 text-xs leading-5 text-[#8a7b69]">{sub}</dd>}
    </div>
  )
}

export function Flags({ flags, className = '' }) {
  if (!flags.length) return null
  return (
    <ul className={`space-y-2 ${className}`} aria-label="Capacity and configuration warnings">
      {flags.map(f => (
        <li key={f.text} className={`flex gap-2 rounded-lg border px-3 py-2 text-sm leading-5 ${f.level === 'info' ? 'border-[#e2d8ca] bg-[#f3ecdf] text-[#5f5244]' : 'border-brand-primary/30 bg-[#fbeae5] text-[#7a2f22]'}`}>
          <span aria-hidden="true" className="font-bold">{f.level === 'info' ? 'i' : '!'}</span>
          {f.text}
        </li>
      ))}
    </ul>
  )
}

export function SegmentedControl({ label, options, value, onChange, size = 'md' }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-[#e2d8ca] bg-[#f3ecdf] p-1">
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary ${size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'} ${active ? 'bg-[#3F3228] text-[#f6f1e7] shadow-sm' : 'text-[#5f5244] hover:bg-white'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// Scenario presets, reset and share — shown above each modelling section.
export function ScenarioToolbar() {
  const { state, dispatch, shareUrl } = useVision()
  const [copied, setCopied] = useState(false)
  const scenario = SCENARIOS.find(s => s.id === state.scenario)

  async function share() {
    const url = shareUrl()
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link to share your scenario:', url)
    }
    window.history.replaceState(null, '', url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e2d8ca] bg-[#fffdf8] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="pl-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7b69]">Scenario</span>
        <SegmentedControl
          label="Illustrative scenario"
          size="sm"
          options={SCENARIOS.map(s => ({ value: s.id, label: s.label }))}
          value={state.scenario}
          onChange={id => dispatch({ type: 'scenario', id })}
        />
        <span className="text-xs text-[#8a7b69]">
          {state.customized ? <><strong className="font-semibold text-brand-primary">Customized</strong> from {scenario?.label}</> : scenario?.blurb}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => dispatch({ type: 'resetAll' })} className="rounded-full border border-[#d9cdbb] px-3 py-1.5 text-xs font-semibold text-[#5f5244] transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary">
          Reset everything to defaults
        </button>
        <button type="button" onClick={share} className="rounded-full bg-[#2F5D50] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#244a40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5D50]">
          <span aria-live="polite">{copied ? 'Link copied' : 'Copy shareable link'}</span>
        </button>
      </div>
    </div>
  )
}
