import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import AguamentiOverlay from '../components/AguamentiOverlay'
import IncendioOverlay from '../components/IncendioOverlay'
import WikiStatePanel from '../components/WikiStatePanel'
import { getSpells } from '../services/hpApi'
import {
  announceSpellToast,
  executeSpellCast,
  finalizeAvadaKedavra,
  TEMPORARY_EFFECT_MS,
} from '../utils/spellCasting'

const RELATED_SLIDER_INTERVAL_MS = 4600

function buildSpellMotif(name, description) {
  const words = `${name} ${description}`
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z]/gi, ''))
    .filter((word) => word.length > 4)

  return words.slice(0, 3).length ? words.slice(0, 3) : ['Arcane', 'Wizardry', 'Magic']
}

function buildSpellGlyph(name) {
  return name
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z]/gi, '').slice(0, 1).toUpperCase())
    .filter(Boolean)
    .slice(0, 3)
    .join(' • ')
}

function buildSpellCadence(name, description) {
  const text = `${name} ${description}`.toLowerCase()

  if (/(fire|flame|burn|explode|blast|thunder|storm)/.test(text)) {
    return 'Volcanic release'
  }

  if (/(shield|protect|guard|defend|patronus)/.test(text)) {
    return 'Protective ward'
  }

  if (/(levitate|float|hover|wingardium|lift)/.test(text)) {
    return 'Rising arc'
  }

  if (/(light|lumos|glow|shine)/.test(text)) {
    return 'Lantern flare'
  }

  if (/(unlock|open|reveal|secreto|alohomora)/.test(text)) {
    return 'Revealing twist'
  }

  return 'Ceremonial sweep'
}

function SpellDetailPage() {
  const { spellId } = useParams()
  const { house, system } = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [spell, setSpell] = useState(null)
  const [allSpells, setAllSpells] = useState([])
  const [relatedSpells, setRelatedSpells] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeRelatedSlide, setActiveRelatedSlide] = useState(0)
  const [activeEffects, setActiveEffects] = useState({
    engorgio: false,
    evanesco: false,
    wingardiumLeviosa: false,
    incendio: false,
    diffindo: false,
    aguamenti: false,
  })
  const [spellConfirm, setSpellConfirm] = useState(null)
  const effectTimeoutsRef = useRef({})

  useEffect(() => {
    const controller = new AbortController()

    async function loadSpell() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const spells = await getSpells(controller.signal)
        const nextSpell = spells.find((entry) => entry.id === spellId)

        if (!nextSpell) {
          throw new Error('Spell not found')
        }

        setAllSpells(spells)
        setSpell(nextSpell)
        setRelatedSpells(
          spells
            .filter((entry) => entry.id !== nextSpell.id && entry.name.startsWith(nextSpell.name[0]))
            .slice(0, 4),
        )
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('Spell detail could not be loaded.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadSpell()

    return () => {
      controller.abort()
    }
  }, [spellId])

  useEffect(() => {
    setActiveRelatedSlide(0)
  }, [spellId, relatedSpells.length])

  useEffect(() => {
    if (relatedSpells.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveRelatedSlide((value) => (value + 1) % relatedSpells.length)
    }, RELATED_SLIDER_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [relatedSpells.length])

  useEffect(() => {
    const effectTimeouts = effectTimeoutsRef.current
    return () => {
      Object.values(effectTimeouts).forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    }
  }, [])

  if (isLoading) {
    return (
      <WikiStatePanel
        body="Loading spell entry..."
        title="Loading Spell"
      />
    )
  }

  if (errorMessage || !spell) {
    return (
      <WikiStatePanel
        action={
          <Link className={system.buttonPrimary} to={`/${house.id}/spells`}>
            Back To Spells
          </Link>
        }
        body={errorMessage || 'This spell could not be found.'}
        title="Failed To Load Data"
        type="error"
      />
    )
  }

  const motifs = buildSpellMotif(spell.name, spell.description)
  const glyph = buildSpellGlyph(spell.name)
  const cadence = buildSpellCadence(spell.name, spell.description)

  function activateTemporaryEffect(effectKey, duration = TEMPORARY_EFFECT_MS) {
    window.clearTimeout(effectTimeoutsRef.current[effectKey])
    setActiveEffects((current) => ({ ...current, [effectKey]: true }))

    effectTimeoutsRef.current[effectKey] = window.setTimeout(() => {
      setActiveEffects((current) => ({ ...current, [effectKey]: false }))
    }, duration)
  }

  function handleCastSpell() {
    executeSpellCast({
      spell,
      navigate,
      locationPath: location.pathname,
      houseId: house.id,
      spells: allSpells,
      activateTemporaryEffect,
      setSpellConfirm,
    })
  }

  function confirmAvadaKedavra() {
    setSpellConfirm(null)
    announceSpellToast({
      title: 'Avada Kedavra',
      body: 'Attempts to close the site immediately.',
      duration: 900,
    })
    window.setTimeout(() => {
      finalizeAvadaKedavra()
    }, 260)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link className={system.buttonSecondary} to={`/${house.id}/spells`}>
          Back To Spellbook
        </Link>
        {spell.isCastable ? (
          <button className={system.buttonPrimary} onClick={handleCastSpell} type="button">
            Cast Spell
          </button>
        ) : null}
      </div>

      <section
        className={`${system.card} spell-hero-shell overflow-safe${
          activeEffects.engorgio ? ' is-engorgio' : ''
        }${activeEffects.evanesco ? ' is-evanesco' : ''}${
          activeEffects.wingardiumLeviosa ? ' is-wingardium-leviosa' : ''
        }${activeEffects.incendio ? ' is-incendio' : ''}${
          activeEffects.diffindo ? ' is-diffindo' : ''
        }${activeEffects.aguamenti ? ' is-aguamenti' : ''
        }`}
      >
        {activeEffects.incendio ? <IncendioOverlay duration={TEMPORARY_EFFECT_MS} /> : null}
        {activeEffects.aguamenti ? <AguamentiOverlay duration={TEMPORARY_EFFECT_MS} /> : null}

        <div className="spell-folio-stage spell-folio-stage--wide">
          <div className="spell-folio-shell">
            <div className="spell-folio-tab">Spell folio</div>

            <div className="spell-folio-grid">
              <div className="spell-folio-page spell-folio-page--notes spell-folio-page--ledger">
                <div className="spell-folio-sheet-grid">
                  <div className="overflow-safe">
                    <p className="section-label text-[#91a6c7]">Spell entry</p>
                    <div className="spell-folio-note spell-folio-note--headline mt-4">
                      <p className="spell-folio-mark">{glyph || 'ARC'}</p>
                      <p className="spell-folio-title">{spell.name}</p>
                      <p className={`spell-folio-subtitle${spell.isCastable ? ' spell-castable-description' : ''}`}>
                        {spell.description}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {motifs.map((motif) => (
                        <div key={motif} className="spell-folio-note">
                          <p className="section-label text-[#91a6c7]">Motif</p>
                          <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/78">
                            {motif}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        ['Cadence', cadence],
                        ['Spell mark', spell.id.slice(0, 8)],
                        ['Incantation', spell.name],
                        ['Effect', spell.description],
                      ].map(([label, value]) => (
                        <div key={label} className="spell-folio-note">
                          <p className="section-label text-[#91a6c7]">{label}</p>
                          <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/76">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-safe">
                    <p className="section-label text-[#91a6c7]">Margin observations</p>

                    <div className="mt-4 grid gap-3">
                      {[
                        `Incantation: ${spell.name}`,
                        `Effect: ${spell.description}`,
                        `Cadence: ${cadence}`,
                      ].map((item) => (
                        <div key={item} className="spell-folio-note">
                          <p className="font-body text-[1rem] leading-relaxed text-white/76">{item}</p>
                        </div>
                      ))}
                    </div>

                    <div className="spell-folio-path">
                      <div className="spell-folio-path-line"></div>
                      <span className="spell-folio-path-point spell-folio-path-point--one"></span>
                      <span className="spell-folio-path-point spell-folio-path-point--two"></span>
                      <span className="spell-folio-path-point spell-folio-path-point--three"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Spell record</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">At A Glance</h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['Incantation', spell.name],
                ['Spell mark', spell.id.slice(0, 8)],
                ['Cadence', cadence],
                ['Record', 'Standard spell entry'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                >
                  <p className="section-label">{label}</p>
                  <p className="mt-3 font-body text-[1.04rem] leading-relaxed text-white/76">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Notes</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">Additional Record</h3>

            <div className="mt-5 grid gap-3">
              {[
                'No expanded notes are available for this entry.',
                'Spell entries may vary by textbook edition and instructor.',
                'Use caution when practicing unfamiliar magic.',
              ].map((item) => (
                <div
                  key={item}
                  className="spell-imprint-card rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                >
                  <p className="font-body text-[1.04rem] leading-relaxed text-white/74">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className={`${system.card} overflow-safe`}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Related Spells</p>
              <h3 className="mt-2 font-display text-[2rem] text-white">Similar Incantations</h3>
            </div>
              {relatedSpells.length > 1 ? (
                <div className="flex items-center gap-2">
                  {relatedSpells.map((entry, index) => (
                    <button
                      key={entry.id}
                      aria-label={`Open ${entry.name} related slide`}
                      className={`spell-carousel-dot ${index === activeRelatedSlide ? 'active' : ''}`}
                      onClick={() => setActiveRelatedSlide(index)}
                      type="button"
                    />
                  ))}
                </div>
              ) : null}
            </div>

          {relatedSpells.length ? (
            <div className="spell-carousel-viewport mt-5">
              <div
                className="spell-carousel-track"
                style={{ transform: `translateX(-${activeRelatedSlide * 100}%)` }}
              >
                {relatedSpells.map((entry, index) => (
                  <Link
                    key={entry.id}
                    className="spell-carousel-slide spell-related-slide rounded-[inherit] border border-white/8 bg-black/18 px-4 py-5 transition-transform duration-300 hover:-translate-y-1"
                    to={`/${house.id}/spells/${entry.id}`}
                  >
                    <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
                      <div className="overflow-safe">
                        <p className="font-display text-[1.85rem] text-white">{entry.name}</p>
                        <p className="mt-3 font-body text-[1.06rem] leading-relaxed text-white/72">
                          {entry.description}
                        </p>
                      </div>

                      <div className="spell-carousel-panel">
                        <p className="section-label">Reference</p>
                        <div className="mt-4 grid gap-3">
                          {[
                            ['Slide', `${index + 1} / ${relatedSpells.length}`],
                            ['Record mark', entry.id.slice(0, 8)],
                          ].map(([label, value]) => (
                            <div key={label} className="spell-carousel-stat">
                              <p className="section-label">{label}</p>
                              <p className="mt-2 font-body text-[0.98rem] leading-relaxed text-white/74">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-5 font-body text-[1.04rem] leading-relaxed text-white/68">
              No similar incantation group is available for this spell.
            </p>
          )}
        </div>
      </section>

      {spellConfirm ? (
        <div className="spell-screen-overlay spell-screen-overlay--interactive">
          <div className="spell-screen-card">
            <p className="section-label">Restricted incantation</p>
            <p className="mt-3 font-display text-[2rem] text-white">{spellConfirm.title}</p>
            <p className="mt-3 font-body text-[1.05rem] leading-relaxed text-white/78">
              {spellConfirm.body}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className={system.buttonSecondary} onClick={() => setSpellConfirm(null)} type="button">
                Cancel
              </button>
              <button className={system.buttonPrimary} onClick={confirmAvadaKedavra} type="button">
                Cast Anyway
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default SpellDetailPage
