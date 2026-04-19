export const TEMPORARY_EFFECT_MS = 5000
const AVADA_KEDAVRA_REDIRECT_URL = 'about:blank'

const RANDOM_SECTION_PATHS = ['', 'characters', 'spells', 'houses', 'quidditch', 'game']

function buildRandomRoute({ houseId, spells, locationPath }) {
  const sectionRoutes = RANDOM_SECTION_PATHS.map((path) =>
    path ? `/${houseId}/${path}` : `/${houseId}`,
  )
  const detailRoutes = spells.slice(0, 8).map((spell) => `/${houseId}/spells/${spell.id}`)
  const candidates = [...sectionRoutes, ...detailRoutes].filter((path) => path !== locationPath)

  if (!candidates.length) {
    return `/${houseId}`
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function announceSpellToast({ title, body, duration = 3200 }) {
  if (typeof window === 'undefined') {
    return
  }

  // Pages listen to this event to render the spell result card (bottom-right toast).
  window.dispatchEvent(
    new CustomEvent('wizard:spell-toast', {
      detail: { title, body, duration },
    }),
  )
}

export function executeSpellCast({
  spell,
  navigate,
  locationPath,
  houseId,
  spells,
  activateTemporaryEffect,
  setSpellConfirm,
}) {
  function showSpellResult(title, body = spell.castPreview, duration = 3200) {
    announceSpellToast({ title, body, duration })
  }

  switch (spell.castKey) {
    case 'avada-kedavra':
      setSpellConfirm({
        title: 'Avada Kedavra',
        body: 'Are you sure about casting this spell? Once spoken, some incantations are not easily called back.',
      })
      return

    case 'conjunctivitis-curse':
      window.dispatchEvent(
        new CustomEvent('wizard:conjunctivitis', { detail: { duration: TEMPORARY_EFFECT_MS } }),
      )
      showSpellResult('Conjunctivitis Curse')
      return

    case 'engorgio':
      activateTemporaryEffect?.('engorgio', TEMPORARY_EFFECT_MS)
      showSpellResult('Engorgio')
      return

    case 'wingardium-leviosa':
      activateTemporaryEffect?.('wingardiumLeviosa', TEMPORARY_EFFECT_MS)
      showSpellResult('Wingardium Leviosa')
      return

    case 'evanesco':
      activateTemporaryEffect?.('evanesco', TEMPORARY_EFFECT_MS)
      showSpellResult('Evanesco')
      return

    case 'lumos':
      window.dispatchEvent(
        new CustomEvent('wizard:lumos', {
          detail: { enabled: true, duration: TEMPORARY_EFFECT_MS },
        }),
      )
      showSpellResult('Lumos')
      return

    case 'obliviate':
      window.dispatchEvent(new Event('wizard:obliviate'))
      showSpellResult('Obliviate')
      return

    case 'obscuro':
      // This overlay is meant to fully hide the UI, including the spell toast.
      window.dispatchEvent(new CustomEvent('wizard:obscuro', { detail: { duration: 4200 } }))
      showSpellResult('Obscuro')
      return

    case 'immobulus':
      window.dispatchEvent(
        new CustomEvent('wizard:freeze-snitch', { detail: { duration: TEMPORARY_EFFECT_MS } }),
      )
      showSpellResult('Immobulus')
      return

    case 'homunculus-charm':
      if (typeof window !== 'undefined' && typeof window.open === 'function') {
        window.open('https://www.google.com/maps?q=Izmir%2C%20Turkey', '_blank', 'noopener,noreferrer')
      }
      showSpellResult('Homunculus Charm', 'Shows the caster location.', 4200)
      return

    case 'ascendio':
      window.scrollTo({ top: 0, behavior: 'smooth' })
      showSpellResult('Ascendio')
      return

    case 'incendio':
      activateTemporaryEffect?.('incendio', TEMPORARY_EFFECT_MS)
      showSpellResult('Incendio')
      return

    case 'diffindo':
      activateTemporaryEffect?.('diffindo', TEMPORARY_EFFECT_MS)
      showSpellResult('Diffindo')
      return

    case 'aguamenti':
      activateTemporaryEffect?.('aguamenti', TEMPORARY_EFFECT_MS)
      showSpellResult('Aguamenti')
      return

    case 'apparate':
      showSpellResult('Apparate')
      navigate(buildRandomRoute({ houseId, spells, locationPath }))
      return

    default:
      showSpellResult(spell.name, spell.castPreview || 'This spell has not been wired for casting yet.')
  }
}

export function finalizeAvadaKedavra() {
  window.close()
  window.setTimeout(() => {
    if (!window.closed) {
      window.location.replace(AVADA_KEDAVRA_REDIRECT_URL)
    }
  }, 150)
}
