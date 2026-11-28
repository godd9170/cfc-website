'use client'

// Shared state for every simulator on /vision: the terminal builder, market
// simulator, operating model and network all read and write one store, so a
// change in one is reflected everywhere. State persists to localStorage and
// can be shared as a ?s= URL. Nothing is sent to a server.

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { ARCHETYPES, DEFAULTS, DEFAULT_MODULES, MAX_TERMINALS, MODULE_BY_ID, PARAMS, SCENARIOS, scenarioAssumptions, scenarioModules } from './model/config.js'
import { clamp, computeModel } from './model/calc.js'

const STORAGE_KEY = 'cfc-vision-scenario-v1'
const STAGES = ['current', ...SCENARIOS.map(s => s.id)]
const DEFAULT_NETWORK = [{ id: 1, archetype: 'pec' }]

const initialState = () => ({
  scenario: 'base',
  customized: false,
  a: { ...DEFAULTS },
  modules: { ...DEFAULT_MODULES },
  network: DEFAULT_NETWORK,
})

function sanitizeParam(key, value) {
  const p = PARAMS[key]
  if (!p) return undefined
  if (p.kind === 'select') return p.options.some(o => o.value === value) ? value : p.default
  const n = Number(value)
  return Number.isFinite(n) ? clamp(n, p.min, p.max) : p.default
}

function sanitizeModule(id, value) {
  const m = MODULE_BY_ID[id]
  const n = Math.round(Number(value))
  return Number.isFinite(n) ? clamp(n, m.min, m.max) : m.default
}

// Accepts a partial, possibly hand-edited snapshot and returns a valid state.
function sanitize(raw) {
  const base = initialState()
  if (!raw || typeof raw !== 'object') return base
  const scenario = SCENARIOS.some(s => s.id === raw.scenario) ? raw.scenario : 'base'
  const a = scenarioAssumptions(scenario)
  for (const [k, v] of Object.entries(raw.a ?? {})) if (k in PARAMS) a[k] = sanitizeParam(k, v)
  const modules = scenarioModules(scenario)
  for (const [k, v] of Object.entries(raw.modules ?? {})) if (MODULE_BY_ID[k]) modules[k] = sanitizeModule(k, v)
  const ids = new Set(ARCHETYPES.map(x => x.id))
  const extra = (Array.isArray(raw.network) ? raw.network : [])
    .filter(t => ids.has(t?.archetype))
    .slice(0, MAX_TERMINALS - 1)
    .map((t, i) => ({ id: i + 2, archetype: t.archetype, stage: STAGES.includes(t.stage) ? t.stage : 'starter' }))
  return { scenario, customized: false, a, modules, network: [DEFAULT_NETWORK[0], ...extra] }
}

// "Customized" means the state no longer matches its scenario preset.
function withCustomized(s) {
  const a = scenarioAssumptions(s.scenario)
  const m = scenarioModules(s.scenario)
  const customized = Object.keys(a).some(k => a[k] !== s.a[k]) || Object.keys(m).some(k => m[k] !== s.modules[k])
  return customized === s.customized ? s : { ...s, customized }
}

const reducer = (s, act) => withCustomized(baseReducer(s, act))

function baseReducer(s, act) {
  switch (act.type) {
    case 'set':
      return { ...s, customized: true, a: { ...s.a, [act.key]: sanitizeParam(act.key, act.value) } }
    case 'module':
      return { ...s, customized: true, modules: { ...s.modules, [act.id]: sanitizeModule(act.id, act.value) } }
    case 'scenario':
      return { ...s, scenario: act.id, customized: false, a: scenarioAssumptions(act.id), modules: scenarioModules(act.id) }
    case 'resetAssumptions':
      return { ...s, customized: false, a: scenarioAssumptions(s.scenario) }
    case 'resetMarket': {
      const preset = scenarioAssumptions(s.scenario)
      const a = { ...s.a }
      for (const k of Object.keys(PARAMS)) if (PARAMS[k].group === 'market') a[k] = preset[k]
      return { ...s, a }
    }
    case 'resetModules':
      return { ...s, modules: scenarioModules(s.scenario) }
    case 'resetAll':
      return initialState()
    case 'addTerminal': {
      if (s.network.length >= MAX_TERMINALS) return s
      const id = Math.max(...s.network.map(t => t.id)) + 1
      return { ...s, network: [...s.network, { id, archetype: act.archetype ?? 'ruralCounty', stage: STAGES.includes(act.stage) ? act.stage : 'starter' }] }
    }
    case 'removeTerminal':
      return { ...s, network: s.network.filter(t => t.id !== act.id || t.archetype === 'pec') }
    case 'terminalArchetype':
      return { ...s, network: s.network.map(t => (t.id === act.id && t.archetype !== 'pec' ? { ...t, archetype: act.archetype } : t)) }
    case 'terminalStage':
      return { ...s, network: s.network.map(t => (t.id === act.id && t.archetype !== 'pec' && STAGES.includes(act.stage) ? { ...t, stage: act.stage } : t)) }
    case 'resetNetwork':
      return { ...s, network: DEFAULT_NETWORK }
    case 'load':
      return sanitize(act.state)
    default:
      return s
  }
}

// Only what differs from the scenario preset goes into a share link.
function encode(s) {
  const preset = scenarioAssumptions(s.scenario)
  const a = Object.fromEntries(Object.entries(s.a).filter(([k, v]) => preset[k] !== v))
  const presetModules = scenarioModules(s.scenario)
  const modules = Object.fromEntries(Object.entries(s.modules).filter(([k, v]) => presetModules[k] !== v))
  const payload = { scenario: s.scenario, customized: s.customized, a, modules, network: s.network.slice(1).map(t => ({ archetype: t.archetype, stage: t.stage })) }
  return btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decode(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(b64))
}

const VisionContext = createContext(null)

export default function VisionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let loaded = null
    try {
      const shared = new URLSearchParams(window.location.search).get('s')
      if (shared) loaded = decode(shared)
    } catch { /* ignore a malformed link */ }
    if (!loaded) {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved) loaded = JSON.parse(saved)
      } catch { /* storage unavailable */ }
    }
    if (loaded) dispatch({ type: 'load', state: loaded })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* storage unavailable */ }
  }, [state, hydrated])

  const model = useMemo(() => computeModel(state.a, state.modules), [state.a, state.modules])

  const shareUrl = useCallback(() => {
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = ''
    url.searchParams.set('s', encode(state))
    return url.toString()
  }, [state])

  const value = useMemo(() => ({ state, dispatch, model, shareUrl }), [state, model, shareUrl])
  return <VisionContext.Provider value={value}>{children}</VisionContext.Provider>
}

export function useVision() {
  const ctx = useContext(VisionContext)
  if (!ctx) throw new Error('useVision must be used inside <VisionProvider>')
  return ctx
}
