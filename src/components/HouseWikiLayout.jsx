import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  getHouseAccentPillClass,
  getHouseGridOverlay,
  getHouseMistOrbs,
  getHouseSwitchClass,
  getHouseSwitchCopyClass,
  getHouseSwitchNameClass,
  getHouseSwitchTagClass,
  getHouseSwitcherPanelClass,
  getHouseSwitcherPanelOverlay,
  getSnitchToastClass,
  getHouseVaultInvocationClass,
  getHouseVaultLegendClass,
  houseDesignSystems,
} from '../design-system/houseDesignSystems'
import { houses } from '../data/houses'
import { houseLore } from '../data/houseLore'
import snitchImage from '../assets/snitch.png'
import sortingHatImage from '../assets/sorting-hat.png'
import { hasTutorialBeenDismissed, rememberTutorialDismissed } from '../utils/portalAccess'
import HouseCrest from './HouseCrest'

const sectionLinks = [
  { label: 'Home', path: '' },
  { label: 'Characters', path: 'characters' },
  { label: 'Spells', path: 'spells' },
  { label: 'Houses', path: 'houses' },
  { label: 'Quidditch', path: 'quidditch' },
  { label: 'Game', path: 'game' },
]

const vaultInvocations = {
  slytherin: 'Dungeon archive of inherited secrets',
  gryffindor: 'Torchlit record of daring legends',
  ravenclaw: 'Observatory archive for midnight revelations',
  hufflepuff: 'Golden cellar chronicle of steadfast hearts',
}

const snitchRewards = {
  slytherin: [
    'Golden Snitch captured. Slytherin vault marks rise by 15.',
    'A glint from the lake. The Snitch grants Slytherin 15 quiet points.',
    'The Snitch chose ambition. House tally increased.',
  ],
  gryffindor: [
    'Brave catch. Gryffindor claims 15 shining house points.',
    'The Snitch darts into your hand. Gryffindor gains a burst of glory.',
    'A lion-hearted grab. The scoreboard lights in scarlet and gold.',
  ],
  ravenclaw: [
    'Sharp eyes win it. Ravenclaw archives another 15 points.',
    'The Snitch yields to insight. Ravenclaw gains a measured advantage.',
    'An elegant catch. Bronze and blue signals flare across the vault.',
  ],
  hufflepuff: [
    'Steady hands caught it. Hufflepuff earns 15 warm points.',
    'The Snitch lands softly. Hufflepuff rises with patient momentum.',
    'A bright golden catch. The house hourglass glows for Hufflepuff.',
  ],
}

function GoldenSnitch({ className = '', onClick, style }) {
  return (
    <button
      aria-label="Catch the Golden Snitch"
      className={`golden-snitch-button ${className}`.trim()}
      onClick={onClick}
      style={style}
      type="button"
    >
      <img alt="" aria-hidden="true" className="golden-snitch-image" src={snitchImage} />
    </button>
  )
}

function buildHouseHref(nextHouseId, pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const tail = segments.slice(1)
  return `/${nextHouseId}${tail.length ? `/${tail.join('/')}` : ''}`
}

function HouseWikiLayout() {
  const { houseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const house = houses.find((entry) => entry.id === houseId)
  const fallbackHouse = houses.find((entry) => entry.id === 'gryffindor') ?? houses[0]
  const activeHouse = house ?? fallbackHouse
  const snitchEscapeRef = useRef({ lastAt: 0, timer: 0 })
  const tutorialFocusRef = useRef(null)
  const [snitchState, setSnitchState] = useState({
    visible: true,
    top: 24,
    left: 76,
    reward: '',
    catches: 0,
    catchable: false,
  })
  const [isSnitchFrozen, setIsSnitchFrozen] = useState(false)
  const [isSnitchHidden, setIsSnitchHidden] = useState(false)
  const [isSnitchBlurred, setIsSnitchBlurred] = useState(false)
  const [activeSpellToast, setActiveSpellToast] = useState(null)
  const [activeScreenEffects, setActiveScreenEffects] = useState({
    conjunctivitis: false,
    obscuro: false,
  })
  const [tutorialStepIndex, setTutorialStepIndex] = useState(-1)
  const [tutorialFocusRect, setTutorialFocusRect] = useState(null)
  const [isTutorialDismissed, setIsTutorialDismissed] = useState(() => hasTutorialBeenDismissed())
  const [isTutorialEnabled, setIsTutorialEnabled] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return !window.matchMedia('(max-width: 1024px)').matches
  })
  const [housePoints, setHousePoints] = useState(() =>
    Object.fromEntries(houses.map((entry) => [entry.id, 0])),
  )
  const rewardMessages = useMemo(
    () => snitchRewards[activeHouse.id] ?? snitchRewards.slytherin,
    [activeHouse.id],
  )
  const mistOrbs = useMemo(() => getHouseMistOrbs(activeHouse.id), [activeHouse.id])
  const gridOverlay = useMemo(() => getHouseGridOverlay(activeHouse.id), [activeHouse.id])
  const switcherPanelOverlay = useMemo(
    () => getHouseSwitcherPanelOverlay(activeHouse.id),
    [activeHouse.id],
  )
  const orderedHouses = useMemo(() => {
    const next = [...houses]
    next.sort((a, b) => (a.id === 'gryffindor' ? -1 : b.id === 'gryffindor' ? 1 : 0))
    return next
  }, [])
  const tutorialSteps = useMemo(
    () => [
      {
        id: 'nav-spells',
        focusId: 'nav-spells',
        path: `/${activeHouse.id}/spells`,
        manualNav: true,
        title: 'Open Spells',
        body: 'To start spellcasting, click Spells in the navbar.',
      },
      {
        id: 'spells-overview',
        focusId: 'spells-overview',
        path: `/${activeHouse.id}/spells`,
        title: 'Cast Spells',
        body:
          'Pay attention. This page is not just a library — some incantations can be cast. When you cast one, the site answers back. Try Lumos first and watch the UI react.',
      },
      {
        id: 'spells-cast',
        focusId: 'spells-cast',
        path: `/${activeHouse.id}/spells`,
        title: 'Try Lumos',
        body:
          'Find a castable spell and press Cast Spell. Lumos is the clean example: it lights the interface for a short time. Do it once, then explore the others.',
      },
      {
        id: 'nav-game',
        focusId: 'nav-game',
        path: `/${activeHouse.id}/game`,
        manualNav: true,
        title: 'Open Game',
        body: 'Now click Game in the navbar to enter the portrait round.',
      },
      {
        id: 'game-start',
        focusId: 'game-start',
        path: `/${activeHouse.id}/game`,
        title: 'Start The Round',
        body:
          'This is the start state. Press Start Game to preview what the round looks like, then keep an eye on the timer.',
      },
      {
        id: 'game-timer',
        focusId: 'game-timer',
        path: `/${activeHouse.id}/game`,
        title: 'Watch The Timer',
        body:
          'Keep your eye on the timer tile. Time pressure controls the round, so answer quickly after pressing Start Game.',
      },
    ],
    [activeHouse.id],
  )
  const isTutorialActive = tutorialStepIndex >= 0 && isTutorialEnabled && !isTutorialDismissed

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  useEffect(() => {
    const spawnTimeoutId = window.setTimeout(() => {
      setSnitchState((previous) => ({
        ...previous,
        visible: true,
        catchable: false,
        top: 12 + Math.floor(Math.random() * 64),
        left: 6 + Math.floor(Math.random() * 84),
      }))
    }, 0)

    const intervalId = window.setInterval(() => {
      setSnitchState((previous) => {
        if (!previous.visible || previous.catchable || isSnitchFrozen) {
          return previous
        }

        return {
          ...previous,
          top: clamp(previous.top + (Math.random() - 0.5) * 10, 10, 90),
          left: clamp(previous.left + (Math.random() - 0.5) * 14, 6, 94),
        }
      })
    }, 1900)

    return () => {
      window.clearTimeout(spawnTimeoutId)
      window.clearInterval(intervalId)
    }
  }, [activeHouse.id, isSnitchFrozen])

  useEffect(() => {
    let timeoutId
    const intervalId = window.setInterval(() => {
      if (Math.random() > 0.22) {
        return
      }

      setSnitchState((previous) => ({
        ...previous,
        visible: true,
        catchable: true,
      }))

      timeoutId = window.setTimeout(() => {
        setSnitchState((previous) => ({
          ...previous,
          catchable: false,
          top: 12 + Math.floor(Math.random() * 64),
          left: 6 + Math.floor(Math.random() * 84),
        }))
      }, 1200)
    }, 4600)

    return () => {
      window.clearInterval(intervalId)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [activeHouse.id])

  useEffect(() => {
    function handleWandMove(event) {
      const now = performance.now()
      const touch = event.touches?.[0]
      const cursorX = event.detail?.x ?? touch?.clientX ?? event.clientX
      const cursorY = event.detail?.y ?? touch?.clientY ?? event.clientY

      if (typeof cursorX !== 'number' || typeof cursorY !== 'number') {
        return
      }

      setSnitchState((previous) => {
        if (!previous.visible || isSnitchFrozen) {
          return previous
        }

        if (now - snitchEscapeRef.current.lastAt < 70) {
          return previous
        }

        if (snitchEscapeRef.current.timer) {
          return previous
        }

        const viewportWidth = window.innerWidth || 1
        const viewportHeight = window.innerHeight || 1
        const snitchX = (previous.left / 100) * viewportWidth
        const snitchY = (previous.top / 100) * viewportHeight
        const dx = snitchX - cursorX
        const dy = snitchY - cursorY
        const distance = Math.hypot(dx, dy)

        if (distance > 520) {
          return previous
        }

        snitchEscapeRef.current.lastAt = now

        const directionX = dx / (distance || 1)
        const directionY = dy / (distance || 1)
        const push = 420 + Math.random() * 320
        const nextX = snitchX + directionX * push + (Math.random() - 0.5) * 220
        const nextY = snitchY + directionY * push + (Math.random() - 0.5) * 170
        const nextTop = clamp((nextY / viewportHeight) * 100, 10, 90)
        const nextLeft = clamp((nextX / viewportWidth) * 100, 6, 94)
        const escapeDelay = 70 + Math.floor(Math.random() * 140)

        snitchEscapeRef.current.timer = window.setTimeout(() => {
          snitchEscapeRef.current.timer = 0

          setSnitchState((current) => {
            if (!current.visible || isSnitchFrozen) {
              return current
            }

            return {
              ...current,
              top: nextTop,
              left: nextLeft,
            }
          })
        }, escapeDelay)

        return previous
      })
    }

    window.addEventListener('wizard:cursor-move', handleWandMove)
    window.addEventListener('mousemove', handleWandMove, { passive: true })
    window.addEventListener('pointermove', handleWandMove, { passive: true })
    window.addEventListener('touchmove', handleWandMove, { passive: true })
    const snitchEscape = snitchEscapeRef.current
    return () => {
      window.removeEventListener('wizard:cursor-move', handleWandMove)
      window.removeEventListener('mousemove', handleWandMove)
      window.removeEventListener('pointermove', handleWandMove)
      window.removeEventListener('touchmove', handleWandMove)
      window.clearTimeout(snitchEscape.timer)
      snitchEscape.timer = 0
    }
  }, [isSnitchFrozen])

  useEffect(() => {
    let timeoutId = 0

    function handleFreezeSnitch(event) {
      const duration = event.detail?.duration ?? 5000
      setIsSnitchFrozen(true)
      window.clearTimeout(snitchEscapeRef.current.timer)
      snitchEscapeRef.current.timer = 0
      setSnitchState((previous) => ({
        ...previous,
        visible: true,
        catchable: true,
        top: 50,
        left: 50,
        reward: '',
      }))

      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        setIsSnitchFrozen(false)
      }, duration)
    }

    window.addEventListener('wizard:freeze-snitch', handleFreezeSnitch)

    return () => {
      window.removeEventListener('wizard:freeze-snitch', handleFreezeSnitch)
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    let timeoutId = 0

    function handleConjunctivitis(event) {
      const duration = event.detail?.duration ?? 5000
      setIsSnitchBlurred(true)
      setActiveScreenEffects((previous) => ({ ...previous, conjunctivitis: true }))
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        setIsSnitchBlurred(false)
        setActiveScreenEffects((previous) => ({ ...previous, conjunctivitis: false }))
      }, duration)
    }

    window.addEventListener('wizard:conjunctivitis', handleConjunctivitis)

    return () => {
      window.removeEventListener('wizard:conjunctivitis', handleConjunctivitis)
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    let timeoutId = 0

    function handleObscuro(event) {
      const duration = event.detail?.duration ?? 5000
      setIsSnitchHidden(true)
      setActiveScreenEffects((previous) => ({ ...previous, obscuro: true }))
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        setIsSnitchHidden(false)
        setActiveScreenEffects((previous) => ({ ...previous, obscuro: false }))
      }, duration)
    }

    window.addEventListener('wizard:obscuro', handleObscuro)

    return () => {
      window.removeEventListener('wizard:obscuro', handleObscuro)
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!snitchState.reward) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSnitchState((previous) => ({ ...previous, reward: '' }))
    }, 4200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [snitchState.reward])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 1024px)')

    const timeoutId = window.setTimeout(() => {
      const enabled = !mediaQuery.matches
      setIsTutorialEnabled(enabled)

      if (enabled && !isTutorialDismissed) {
        setTutorialStepIndex(0)
      } else {
        setTutorialStepIndex(-1)
      }
    }, 0)

    function handleMediaChange(event) {
      const enabled = !event.matches
      setIsTutorialEnabled(enabled)
      if (!enabled || isTutorialDismissed) {
        setTutorialStepIndex(-1)
        return
      }

      setTutorialStepIndex(0)
    }

    mediaQuery.addEventListener?.('change', handleMediaChange)
    mediaQuery.addListener?.(handleMediaChange)

    return () => {
      window.clearTimeout(timeoutId)
      mediaQuery.removeEventListener?.('change', handleMediaChange)
      mediaQuery.removeListener?.(handleMediaChange)
    }
  }, [isTutorialDismissed])

  useEffect(() => {
    if (!isTutorialActive) {
      tutorialFocusRef.current?.classList.remove('is-tutorial-focus')
      tutorialFocusRef.current = null
      const timeoutId = window.setTimeout(() => {
        setTutorialFocusRect(null)
      }, 0)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    const currentStep = tutorialSteps[tutorialStepIndex]

    if (!currentStep) {
      return undefined
    }

    if (location.pathname !== currentStep.path) {
      if (!currentStep.manualNav) {
        navigate(currentStep.path)
        return undefined
      }
    }

    let timeoutId = 0
    let attempts = 0

    function focusCurrentStep() {
      const element = document.querySelector(`[data-tutorial-focus-id="${currentStep.focusId}"]`)

      if (!element) {
        if (attempts < 20) {
          attempts += 1
          timeoutId = window.setTimeout(focusCurrentStep, 120)
        }
        return
      }

      tutorialFocusRef.current?.classList.remove('is-tutorial-focus')
      element.classList.add('is-tutorial-focus')
      tutorialFocusRef.current = element

      if (currentStep.id === 'spells-cast') {
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('wizard:tutorial-focus-spell', {
              detail: { castKey: 'lumos' },
            }),
          )
        }, 140)
      }

      function ensureInView(target) {
        const rect = target.getBoundingClientRect()
        const viewportHeight = window.innerHeight || 1
        const margin = 16

        if (rect.top < margin) {
          window.scrollBy({ top: rect.top - margin })
          return
        }

        if (rect.bottom > viewportHeight - margin) {
          window.scrollBy({ top: rect.bottom - (viewportHeight - margin) })
        }
      }

      const navbarTarget =
        currentStep.focusId === 'nav-spells' || currentStep.focusId === 'nav-game'
          ? document.querySelector('[data-tutorial-focus-id="navbar"]')
          : null

      ensureInView(navbarTarget ?? element)
      window.setTimeout(() => {
        const rect = element.getBoundingClientRect()
        const padding = 14
        setTutorialFocusRect({
          top: Math.max(rect.top - padding, 12),
          left: Math.max(rect.left - padding, 12),
          right: Math.min(rect.right + padding, window.innerWidth - 12),
          bottom: Math.min(rect.bottom + padding, window.innerHeight - 12),
        })
      }, 260)
    }

    timeoutId = window.setTimeout(focusCurrentStep, 80)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isTutorialActive, location.pathname, navigate, tutorialStepIndex, tutorialSteps])

  useEffect(() => {
    if (!isTutorialActive || !tutorialFocusRef.current) {
      return undefined
    }

    function syncTutorialFocusRect() {
      const element = tutorialFocusRef.current

      if (!element) {
        return
      }

      const rect = element.getBoundingClientRect()
      const padding = 14
      setTutorialFocusRect({
        top: Math.max(rect.top - padding, 12),
        left: Math.max(rect.left - padding, 12),
        right: Math.min(rect.right + padding, window.innerWidth - 12),
        bottom: Math.min(rect.bottom + padding, window.innerHeight - 12),
      })
    }

    syncTutorialFocusRect()
    window.addEventListener('resize', syncTutorialFocusRect)
    window.addEventListener('scroll', syncTutorialFocusRect, true)

    return () => {
      window.removeEventListener('resize', syncTutorialFocusRect)
      window.removeEventListener('scroll', syncTutorialFocusRect, true)
    }
  }, [isTutorialActive, tutorialStepIndex, location.pathname])

  function handleTutorialNext() {
    if (tutorialStepIndex >= tutorialSteps.length - 1) {
      rememberTutorialDismissed()
      setIsTutorialDismissed(true)
      setTutorialStepIndex(-1)
      navigate(`/${activeHouse.id}`)
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 0)
      return
    }

    setTutorialStepIndex((current) => current + 1)
  }

  function handleTutorialBack() {
    setTutorialStepIndex((current) => Math.max(current - 1, 0))
  }

  function handleTutorialSkip() {
    rememberTutorialDismissed()
    setIsTutorialDismissed(true)
    setTutorialStepIndex(-1)
  }

  useEffect(() => {
    function handleSpellToast(event) {
      const nextToast = event.detail

      if (!nextToast?.title) {
        return
      }

      setActiveSpellToast(nextToast)
    }

    window.addEventListener('wizard:spell-toast', handleSpellToast)

    return () => {
      window.removeEventListener('wizard:spell-toast', handleSpellToast)
    }
  }, [])

  useEffect(() => {
    if (!activeSpellToast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setActiveSpellToast(null)
    }, activeSpellToast.duration ?? 3600)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeSpellToast])

  function handleSnitchCatch() {
    if (!isSnitchFrozen && !snitchState.catchable && Math.random() > 0.1) {
      setSnitchState((previous) => ({
        ...previous,
        visible: true,
        catchable: false,
        top: 12 + Math.floor(Math.random() * 64),
        left: 6 + Math.floor(Math.random() * 84),
      }))
      return
    }

    const nextReward = rewardMessages[Math.floor(Math.random() * rewardMessages.length)]
    const pointsAwarded = 15

    setHousePoints((previous) => ({
      ...previous,
      [activeHouse.id]: (previous[activeHouse.id] ?? 0) + pointsAwarded,
    }))

    setSnitchState((previous) => ({
      ...previous,
      visible: true,
      catchable: isSnitchFrozen,
      top: isSnitchFrozen ? 50 : 12 + Math.floor(Math.random() * 64),
      left: isSnitchFrozen ? 50 : 6 + Math.floor(Math.random() * 84),
      reward: nextReward,
      catches: previous.catches + 1,
    }))
  }

  if (!house) {
    return <Navigate replace to="/gryffindor" />
  }

  const system = houseDesignSystems[house.id] ?? houseDesignSystems.slytherin
  const lore = houseLore[house.id]
  const vaultInvocation = vaultInvocations[house.id] ?? 'Archive of Hogwarts memory'
  const vaultTitleClass =
    house.id === 'slytherin'
      ? 'vault-title vault-title--slytherin text-3xl sm:text-[2.5rem]'
      : 'vault-title text-4xl sm:text-[3.1rem] lg:text-[3.4rem]'
  const activeTutorialStepId = tutorialSteps[tutorialStepIndex]?.id

  return (
    <div
      className={`house-stage house-${house.id} relative min-h-screen overflow-hidden text-white${
        isTutorialActive ? ' sorting-hat-tutorial-active' : ''
      }`}
      style={house.theme}
    >
      <div className="pointer-events-none absolute inset-0">
        {mistOrbs.map((orb, index) => (
          <div key={`${activeHouse.id}-orb-${index}`} className={orb.className} style={orb.style} />
        ))}
        <div className={gridOverlay.className} style={gridOverlay.style} />
      </div>

      <div className="pointer-events-none fixed inset-0 z-20">
        {snitchState.visible && !isSnitchHidden ? (
          <GoldenSnitch
            className={`${isSnitchBlurred ? 'is-conjunctivitis ' : ''}${isSnitchFrozen ? 'is-frozen' : ''}`.trim()}
            onClick={handleSnitchCatch}
            style={{ top: `${snitchState.top}%`, left: `${snitchState.left}%` }}
          />
        ) : null}
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <section
          className={getHouseSwitcherPanelClass(activeHouse.id, 'mb-6 p-4 sm:p-5 lg:p-6')}
          data-tutorial-focus-id="house-switcher"
        >
          <div className={switcherPanelOverlay.className} style={switcherPanelOverlay.style} />

          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="section-label">House Navigation</p>
              <p className={getHouseVaultInvocationClass(activeHouse.id)}>
                {vaultInvocation}
              </p>
              <h1 className={`mt-2 font-display text-white ${vaultTitleClass} vault-title--${house.id}`}>
                Hogwarts Memory Vault
              </h1>
              <p className="ui-nowrap mt-2 font-ui text-[0.74rem] tracking-[0.12em] text-white/42">
                Founded by {lore.founder}
              </p>
              <p className={getHouseVaultLegendClass(activeHouse.id)}>
                {lore.spotlight}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <div
                className={getHouseAccentPillClass(
                  activeHouse.id,
                  'ui-nowrap px-4 py-2 font-ui text-[0.68rem] tracking-[0.12em]',
                )}
              >
                {house.name} active
              </div>
              <div
                className={getHouseAccentPillClass(
                  activeHouse.id,
                  'ui-nowrap px-4 py-2 font-ui text-[0.68rem] tracking-[0.12em]',
                )}
              >
                Points: {housePoints[activeHouse.id] ?? 0}
              </div>
              <div
                className={getHouseAccentPillClass(
                  activeHouse.id,
                  'ui-nowrap px-4 py-2 font-ui text-[0.68rem] tracking-[0.12em]',
                )}
              >
                Snitches caught: {snitchState.catches}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {orderedHouses.map((entry) => {
              const isActive = entry.id === house.id

              return (
                <NavLink
                  key={entry.id}
                  className={getHouseSwitchClass(entry.id, isActive)}
                  style={entry.theme}
                  to={buildHouseHref(entry.id, location.pathname)}
                >
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <HouseCrest house={entry.id} className="h-12 w-10 shrink-0" />
                      <div>
                        <p className={getHouseSwitchNameClass(entry.id, 'ui-nowrap')}>{entry.name}</p>
                        <p className={getHouseSwitchCopyClass(entry.id)}>{entry.switcherText}</p>
                      </div>
                    </div>
                    <span className={getHouseSwitchTagClass(entry.id)}>
                      {entry.trait}
                    </span>
                  </div>
                </NavLink>
              )
            })}
          </div>
        </section>

        {snitchState.reward ? (
          <div className={getSnitchToastClass('mb-6')}>
            <p className="section-label">Golden Snitch</p>
            <p className="mt-2 font-body text-[1.06rem] leading-relaxed text-white/84">
              {snitchState.reward}
            </p>
          </div>
        ) : null}

        <section className={`${system.navbar} mb-6`} data-tutorial-focus-id="navbar">
          <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="section-label">{house.heroBadge}</p>
              <p className="ui-nowrap mt-2 font-display text-2xl text-white sm:text-[2.2rem]">
                {house.brand} Wiki Deck
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {sectionLinks.map((link) => {
                const to = link.path ? `/${house.id}/${link.path}` : `/${house.id}`
                const tutorialFocusId =
                  link.path === 'spells' ? 'nav-spells' : link.path === 'game' ? 'nav-game' : undefined
                const isTutorialBlinkTarget =
                  (activeTutorialStepId === 'nav-spells' && link.path === 'spells') ||
                  (activeTutorialStepId === 'nav-game' && link.path === 'game')

                return (
                  <NavLink
                    key={link.label}
                    className={({ isActive }) =>
                      `${isActive ? system.navItemActive : system.navItem}${
                        link.path === 'spells' ? ' spell-nav-sigil' : ''
                      }${isTutorialBlinkTarget ? ' tutorial-nav-blink' : ''}`
                    }
                    data-tutorial-focus-id={tutorialFocusId}
                    end={!link.path}
                    to={to}
                  >
                    {link.label}
                  </NavLink>
                )
              })}
              <span className={system.navbarBadge}>{house.trait} mode</span>
            </div>
          </div>
        </section>

        <Outlet context={{ house, system }} />
      </div>

      {activeSpellToast && !activeScreenEffects.obscuro ? (
        <div
          className={`spell-cast-toast spell-cast-toast--loud rounded-[1.5rem] px-5 py-4${
            activeScreenEffects.conjunctivitis ? ' is-under-spell-screen' : ''
          }`}
        >
          <p className="section-label">Spell cast</p>
          <p className="mt-2 font-display text-[1.6rem] text-white">{activeSpellToast.title}</p>
          <div className="spell-cast-toast-detail">
            <p className="section-label">Cast effect</p>
            <p className="mt-2 font-body text-[1.02rem] leading-relaxed text-white/88">
              {activeSpellToast.body}
            </p>
          </div>
        </div>
      ) : null}

      {activeScreenEffects.conjunctivitis ? <div className="spell-screen-overlay spell-screen-overlay--blur" /> : null}

      {activeScreenEffects.obscuro ? <div className="spell-screen-overlay spell-screen-overlay--black" /> : null}

      {isTutorialActive ? (
        <>
          {tutorialFocusRect ? (
            <>
              <div
                className="sorting-hat-backdrop-segment"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${tutorialFocusRect.top}px`,
                }}
              />
              <div
                className="sorting-hat-backdrop-segment"
                style={{
                  top: `${tutorialFocusRect.top}px`,
                  left: 0,
                  width: `${tutorialFocusRect.left}px`,
                  height: `${Math.max(tutorialFocusRect.bottom - tutorialFocusRect.top, 0)}px`,
                }}
              />
              <div
                className="sorting-hat-backdrop-segment"
                style={{
                  top: `${tutorialFocusRect.top}px`,
                  left: `${tutorialFocusRect.right}px`,
                  right: 0,
                  height: `${Math.max(tutorialFocusRect.bottom - tutorialFocusRect.top, 0)}px`,
                }}
              />
              <div
                className="sorting-hat-backdrop-segment"
                style={{
                  top: `${tutorialFocusRect.bottom}px`,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </>
          ) : (
            <div className="sorting-hat-backdrop-segment" style={{ inset: 0 }} />
          )}
          <div
            className="sorting-hat-guide"
            role="dialog"
            aria-live="polite"
            aria-modal="true"
          >
            <img alt="" aria-hidden="true" className="sorting-hat-guide-image" src={sortingHatImage} />
            <div className="sorting-hat-guide-bubble">
              <p className="section-label">Sorting Hat Tutorial</p>
              <p className="sorting-hat-title mt-3 font-display text-[1.8rem] text-white">
                {tutorialSteps[tutorialStepIndex]?.title}
              </p>
              <p className="sorting-hat-body mt-3 font-body text-[1.05rem] leading-relaxed text-white/80">
                {tutorialSteps[tutorialStepIndex]?.body}
              </p>
              <div className="sorting-hat-actions mt-5 flex flex-wrap gap-3">
                <button
                  className={system.buttonSecondary}
                  onClick={handleTutorialSkip}
                  type="button"
                >
                  Skip
                </button>
                {tutorialStepIndex > 0 ? (
                  <button
                    className={system.buttonSecondary}
                    onClick={handleTutorialBack}
                    type="button"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  className={system.buttonPrimary}
                  onClick={handleTutorialNext}
                  type="button"
                >
                  {tutorialStepIndex === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default HouseWikiLayout
