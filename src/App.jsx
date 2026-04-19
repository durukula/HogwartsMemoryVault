import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HouseWikiLayout from './components/HouseWikiLayout'
import MuggleGate from './components/MuggleGate'
import CharacterDetailPage from './pages/CharacterDetailPage'
import CharactersPage from './pages/CharactersPage'
import GamePage from './pages/GamePage'
import HomePage from './pages/HomePage'
import HouseDetailPage from './pages/HouseDetailPage'
import HousesPage from './pages/HousesPage'
import QuidditchDetailPage from './pages/QuidditchDetailPage'
import QuidditchPage from './pages/QuidditchPage'
import SpellDetailPage from './pages/SpellDetailPage'
import SpellsPage from './pages/SpellsPage'
import {
  clearTutorialDismissed,
  hasPortalAccess,
  rememberPortalAccess,
  triggerObliviateLock,
} from './utils/portalAccess'

const WIZARD_CURSOR_REMOTE_SRC = 'https://www.rw-designer.com/cursor-extern.php?id=26747'
const WIZARD_CURSOR_FALLBACK_SRC = '/cursor-wand.svg'

function App() {
  const [isPortalRevealed, setIsPortalRevealed] = useState(() => hasPortalAccess())
  const [wizardCursorSrc, setWizardCursorSrc] = useState(WIZARD_CURSOR_REMOTE_SRC)
  const [isLumosActive, setIsLumosActive] = useState(false)
  const lumosTimeoutRef = useRef(0)
  const [wizardCursorState, setWizardCursorState] = useState({
    x: -100,
    y: -100,
    visible: false,
    pressed: false,
  })

  useEffect(() => {
    document.body.dataset.cursorMode = isPortalRevealed ? 'wizard' : 'muggle'

    return () => {
      delete document.body.dataset.cursorMode
    }
  }, [isPortalRevealed])

  useEffect(() => {
    function handleLumos(event) {
      const shouldEnable = event.detail?.enabled !== false
      const duration = event.detail?.duration ?? 5000

      window.clearTimeout(lumosTimeoutRef.current)

      if (!shouldEnable) {
        setIsLumosActive(false)
        return
      }

      setIsLumosActive(true)
      lumosTimeoutRef.current = window.setTimeout(() => {
        setIsLumosActive(false)
      }, duration)
    }

    function handleObliviate() {
      window.clearTimeout(lumosTimeoutRef.current)
      setIsLumosActive(false)
      triggerObliviateLock()
      setIsPortalRevealed(false)
    }

    window.addEventListener('wizard:lumos', handleLumos)
    window.addEventListener('wizard:obliviate', handleObliviate)

    return () => {
      window.clearTimeout(lumosTimeoutRef.current)
      window.removeEventListener('wizard:lumos', handleLumos)
      window.removeEventListener('wizard:obliviate', handleObliviate)
    }
  }, [])

  useEffect(() => {
    if (!isPortalRevealed) {
      const timeoutId = window.setTimeout(() => {
        setWizardCursorState((current) =>
          current.visible || current.pressed ? { ...current, visible: false, pressed: false } : current,
        )
      }, 0)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    if (window.matchMedia('(pointer: coarse)').matches) {
      return undefined
    }

    function updateWizardCursor(event, pressed) {
      const clientX = event.clientX
      const clientY = event.clientY

      if (typeof clientX === 'number' && typeof clientY === 'number') {
        window.dispatchEvent(
          new CustomEvent('wizard:cursor-move', {
            detail: { x: clientX, y: clientY },
          }),
        )
      }

      if (event.pointerType === 'touch') {
        return
      }

      setWizardCursorState({
        x: clientX - 3,
        y: clientY - 2,
        visible: true,
        pressed,
      })
    }

    function handlePointerMove(event) {
      updateWizardCursor(event, wizardCursorState.pressed)
    }

    function handlePointerDown(event) {
      updateWizardCursor(event, true)
    }

    function handlePointerUp(event) {
      updateWizardCursor(event, false)
    }

    function handlePointerLeave() {
      setWizardCursorState((current) =>
        current.visible || current.pressed ? { ...current, visible: false, pressed: false } : current,
      )
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerLeave)
    window.addEventListener('blur', handlePointerLeave)
    document.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      document.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [isPortalRevealed, wizardCursorState.pressed])

  function handleRevealPortal() {
    if (typeof window !== 'undefined' && !window.matchMedia('(max-width: 1024px)').matches) {
      clearTutorialDismissed()
    }

    rememberPortalAccess()
    setIsPortalRevealed(true)
  }

  if (!isPortalRevealed) {
    return <MuggleGate onReveal={handleRevealPortal} />
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`wizard-cursor${wizardCursorState.visible ? ' is-visible' : ''}${wizardCursorState.pressed ? ' is-pressed' : ''}${isLumosActive ? ' is-lumos' : ''}`}
        style={{ transform: `translate3d(${wizardCursorState.x}px, ${wizardCursorState.y}px, 0)` }}
      >
        <img
          src={wizardCursorSrc}
          alt=""
          draggable="false"
          onError={() => setWizardCursorSrc(WIZARD_CURSOR_FALLBACK_SRC)}
        />
      </div>

      <Routes>
        <Route element={<HouseWikiLayout />} path="/:houseId">
          <Route element={<HomePage />} index />
          <Route element={<CharactersPage />} path="characters" />
          <Route element={<CharacterDetailPage />} path="characters/:characterId" />
          <Route element={<SpellsPage />} path="spells" />
          <Route element={<SpellDetailPage />} path="spells/:spellId" />
          <Route element={<HousesPage />} path="houses" />
          <Route element={<HouseDetailPage />} path="houses/:targetHouseId" />
          <Route element={<QuidditchPage />} path="quidditch" />
          <Route element={<QuidditchDetailPage />} path="quidditch/:featureSlug" />
          <Route element={<GamePage />} path="game" />
        </Route>
        <Route element={<Navigate replace to="/gryffindor" />} path="/" />
        <Route element={<Navigate replace to="/gryffindor" />} path="*" />
      </Routes>
    </>
  )
}

export default App
