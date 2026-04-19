import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import AguamentiOverlay from '../components/AguamentiOverlay'
import IncendioOverlay from '../components/IncendioOverlay'
import WikiSearchBar from '../components/WikiSearchBar'
import WikiStatePanel from '../components/WikiStatePanel'
import { getCastableSpellConfigs } from '../data/castableSpells'
import { getSpells } from '../services/hpApi'
import {
  announceSpellToast,
  executeSpellCast,
  finalizeAvadaKedavra,
  TEMPORARY_EFFECT_MS,
} from '../utils/spellCasting'

const INITIAL_VISIBLE_COUNT = 18

function SpellsPage() {
  const { house, system } = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [spells, setSpells] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [reloadNonce, setReloadNonce] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeEffects, setActiveEffects] = useState({
    engorgio: false,
    evanesco: false,
    wingardiumLeviosa: false,
    incendio: false,
    diffindo: false,
    aguamenti: false,
  })
  const [spellConfirm, setSpellConfirm] = useState(null)
  const deferredQuery = useDeferredValue(query)
  const effectTimeoutsRef = useRef({})

  useEffect(() => {
    const controller = new AbortController()

    async function loadSpells() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getSpells(controller.signal)
        setSpells(data)
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('Spellbook entries could not be loaded.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadSpells()

    return () => {
      controller.abort()
    }
  }, [reloadNonce])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [deferredQuery])

  useEffect(() => {
    const effectTimeouts = effectTimeoutsRef.current
    return () => {
      Object.values(effectTimeouts).forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    }
  }, [])

  const filteredSpells = spells.filter((spell) =>
    deferredQuery ? spell.searchBlob.includes(deferredQuery.trim().toLowerCase()) : true,
  )
  const featuredSpells = useMemo(
    () =>
      getCastableSpellConfigs()
        .map((config) => spells.find((spell) => spell.castKey === config.key))
        .filter(Boolean),
    [spells],
  )
  const visibleSpells = filteredSpells.slice(0, visibleCount)

  useEffect(() => {
    setActiveSlide(0)
  }, [featuredSpells.length])

  useEffect(() => {
    if (!featuredSpells.length) {
      return undefined
    }

    function handleTutorialSpellFocus(event) {
      const spellKey = event.detail?.castKey

      if (!spellKey) {
        return
      }

      const targetIndex = featuredSpells.findIndex((spell) => spell.castKey === spellKey)

      if (targetIndex >= 0) {
        setActiveSlide(targetIndex)
      }
    }

    window.addEventListener('wizard:tutorial-focus-spell', handleTutorialSpellFocus)
    return () => {
      window.removeEventListener('wizard:tutorial-focus-spell', handleTutorialSpellFocus)
    }
  }, [featuredSpells])

  function activateTemporaryEffect(effectKey, duration = TEMPORARY_EFFECT_MS) {
    window.clearTimeout(effectTimeoutsRef.current[effectKey])
    setActiveEffects((current) => ({ ...current, [effectKey]: true }))

    effectTimeoutsRef.current[effectKey] = window.setTimeout(() => {
      setActiveEffects((current) => ({ ...current, [effectKey]: false }))
    }, duration)
  }

  function handleCastSpell(spell) {
    executeSpellCast({
      spell,
      navigate,
      locationPath: location.pathname,
      houseId: house.id,
      spells,
      activateTemporaryEffect,
      setSpellConfirm,
    })
  }

  function handlePrevSlide() {
    setActiveSlide((value) => (value - 1 + featuredSpells.length) % featuredSpells.length)
  }

  function handleNextSlide() {
    setActiveSlide((value) => (value + 1) % featuredSpells.length)
  }

  function handleSelectSlide(index) {
    setActiveSlide(index)
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
      <section className={`${system.card}`} data-tutorial-focus-id="spells-overview">
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className={system.cardBadge}>Spellbook</span>
            <h2 className="spell-cast-title mt-4 font-display text-4xl leading-none text-white sm:text-[3.2rem]">
              Cast Spells
            </h2>
            <p className="mt-4 font-body text-[1.12rem] leading-relaxed text-white/74">
              Browse the spellbook, then cast the spells that are marked castable. The interface
              reacts when the incantation lands.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Total Spells', spells.length || '...'],
              ['Visible', filteredSpells.length || 0],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
              >
                <p className="section-label">{label}</p>
                <p className="mt-3 font-display text-[1.35rem] text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <WikiStatePanel
          body="Loading magical incantations and their known effects..."
          title="Loading Spells"
        />
      ) : errorMessage ? (
        <WikiStatePanel
          action={
            <button className={system.buttonPrimary} onClick={() => setReloadNonce((value) => value + 1)}>
              Retry Spells
            </button>
          }
          body={errorMessage}
          title="Failed To Load Data"
          type="error"
        />
      ) : !filteredSpells.length ? (
        <WikiStatePanel
          body="No spells matched the current search. Try a broader incantation or keyword."
          title="Spellbook Empty"
          type="empty"
        />
      ) : (
        <>
          {featuredSpells.length ? (
            <section
              data-tutorial-focus-id="spells-cast"
              className={`${system.card} spell-carousel-shell overflow-safe${
                activeEffects.engorgio ? ' is-engorgio' : ''
              }${activeEffects.evanesco ? ' is-evanesco' : ''}${
                activeEffects.wingardiumLeviosa ? ' is-wingardium-leviosa' : ''
              }${activeEffects.incendio ? ' is-incendio' : ''}${
                activeEffects.diffindo ? ' is-diffindo' : ''
              }${activeEffects.aguamenti ? ' is-aguamenti' : ''
              }`}
            >
              <div className="relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="section-label">Castable incantations</p>
                    <h3 className="spell-cast-subtitle mt-2 font-display text-[2.35rem] text-white sm:text-[2.8rem]">
                      Live Spellcasting Gallery
                    </h3>
                    <p className="mt-3 font-body text-[1.08rem] leading-relaxed text-white/72">
                      Pick an incantation, cast it, and watch the interface respond.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {featuredSpells.length > 1 ? (
                      <>
                        <button className={system.buttonSecondary} onClick={handlePrevSlide} type="button">
                          Previous
                        </button>
                        <button className={system.buttonSecondary} onClick={handleNextSlide} type="button">
                          Next
                        </button>
                      </>
                    ) : null}
                    {featuredSpells.map((spell, index) => (
                      <button
                        key={spell.id}
                        aria-label={`Open ${spell.name} slide`}
                        className={`spell-carousel-dot ${index === activeSlide ? 'active' : ''}`}
                        onClick={() => handleSelectSlide(index)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <div className="spell-carousel-viewport mt-6">
                  <div
                    className="spell-carousel-track"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {featuredSpells.map((spell, index) => (
                      <article
                        key={spell.id}
                        className={`spell-carousel-slide spell-hero-shell${index === activeSlide ? ' is-active' : ''}`}
                      >
                        <div className="spell-carousel-stage-grid relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
                          <div className="overflow-safe">
                            <div className="flex items-center justify-between gap-4">
                              <span className={system.cardBadge}>Castable spell</span>
                              <span className="ui-nowrap font-ui text-[0.62rem] tracking-[0.12em] text-white/50">
                                Slide {index + 1}
                              </span>
                            </div>
                            <p className="mt-5 font-display text-[2.4rem] leading-none text-white sm:text-[3rem]">
                              {spell.name}
                            </p>
                            <p className="spell-castable-description mt-5 max-w-3xl font-body text-[1.16rem] leading-relaxed text-white/80 sm:text-[1.22rem]">
                              {spell.description}
                            </p>
                          </div>

                          <div className="spell-carousel-panel">
                            <p className="section-label">Spell pulse</p>
                            <div className="mt-4 grid gap-3">
                              {[
                                ['Archive mark', spell.id.slice(0, 8)],
                                ['Movement', index % 2 === 0 ? 'Rising arc' : 'Circular sweep'],
                              ].map(([label, value]) => (
                                <div key={label} className="spell-carousel-stat">
                                  <p className="section-label">{label}</p>
                                  <p className="mt-2 font-body text-[1.02rem] leading-relaxed text-white/76">
                                    {value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="spell-carousel-actions relative z-10 mt-6 flex flex-wrap gap-3">
                          <Link className={system.buttonSecondary} to={`/${house.id}/spells/${spell.id}`}>
                            Open Entry
                          </Link>
                          <button
                            className={system.buttonPrimary}
                            onClick={() => handleCastSpell(spell)}
                            type="button"
                          >
                            Cast Spell
                          </button>
                        </div>

                        {activeEffects.incendio && index === activeSlide ? (
                          <IncendioOverlay duration={TEMPORARY_EFFECT_MS} />
                        ) : null}
                        {activeEffects.aguamenti && index === activeSlide ? (
                          <AguamentiOverlay duration={TEMPORARY_EFFECT_MS} />
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <WikiSearchBar
            filters={
              <div className="flex items-end">
                <button
                  className={system.buttonSecondary}
                  onClick={() => setReloadNonce((value) => value + 1)}
                  type="button"
                >
                  Reload Spellbook
                </button>
              </div>
            }
            hint="Search by incantation or by the effect you remember."
            label="Search spells"
            onChange={setQuery}
            placeholder="Accio, unlocks, water, memory..."
            system={system}
            value={query}
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleSpells.map((spell) => (
              <article
                key={spell.id}
                className={`${system.card} spell-hero-shell overflow-safe${spell.isCastable ? ' is-castable' : ''}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className={system.cardBadge}>Spell</span>
                    <span className="ui-nowrap font-ui text-[0.62rem] tracking-[0.12em] text-white/50">
                      #{spell.name.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-4 font-display text-[1.8rem] text-white">{spell.name}</p>
                  <p
                    className={`mt-4 font-body text-[1.08rem] leading-relaxed text-white/76${
                      spell.isCastable ? ' spell-castable-description' : ''
                    }`}
                  >
                    {spell.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link className={system.buttonSecondary} to={`/${house.id}/spells/${spell.id}`}>
                      Open Entry
                    </Link>
                    {spell.isCastable ? (
                      <button
                        className={system.buttonPrimary}
                        onClick={() => handleCastSpell(spell)}
                        type="button"
                      >
                        Cast Spell
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {visibleCount < filteredSpells.length ? (
            <div className="flex justify-center">
              <button
                className={system.buttonPrimary}
                onClick={() => setVisibleCount((value) => value + INITIAL_VISIBLE_COUNT)}
                type="button"
              >
                Load More Spells
              </button>
            </div>
          ) : null}
        </>
      )}

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

export default SpellsPage
