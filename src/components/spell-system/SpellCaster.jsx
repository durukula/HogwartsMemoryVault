'use client'

import { useEffect, useRef, useState } from 'react'
import SpellEffectOverlay from './SpellEffectOverlay'
import { availableSpells, getSpellDefinition } from './spellDefinitions'

function SpellCaster() {
  const [selectedSpellKey, setSelectedSpellKey] = useState('incendio')
  const [activeSpellKey, setActiveSpellKey] = useState(null)
  const timeoutRef = useRef(null)

  const selectedSpell = getSpellDefinition(selectedSpellKey)
  const activeSpell = activeSpellKey ? getSpellDefinition(activeSpellKey) : null

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleCastSpell() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    setActiveSpellKey(selectedSpellKey)

    timeoutRef.current = window.setTimeout(() => {
      setActiveSpellKey(null)
    }, selectedSpell.durationMs)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-black/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.16),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-200/70">Spell System</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Cast a magical effect</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Select a spell, then trigger its effect. The current implementation ships with
            Incendio and keeps the logic reusable for future spells.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-200">Selected spell</span>
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white outline-none transition focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/30"
              onChange={(event) => setSelectedSpellKey(event.target.value)}
              value={selectedSpellKey}
            >
              {availableSpells.map((spell) => (
                <option key={spell.key} value={spell.key}>
                  {spell.label}
                </option>
              ))}
            </select>
          </label>

          <button
            className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            onClick={handleCastSpell}
            type="button"
          >
            Cast Spell
          </button>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04),_transparent_48%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Spell Chamber</p>
              <p className="text-2xl font-semibold text-white">{selectedSpell.label}</p>
              <p className="max-w-xl text-sm leading-6 text-slate-300">{selectedSpell.description}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
              The active spell effect appears in the center, fades in, and disappears automatically.
            </div>
          </div>

          <SpellEffectOverlay spell={activeSpell} />
        </div>
      </div>
    </section>
  )
}

export default SpellCaster
