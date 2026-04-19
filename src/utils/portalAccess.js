const PORTAL_ACCESS_KEY = 'harry-potter.portal-access'
const TUTORIAL_DISMISSED_KEY = 'harry-potter.tutorial-dismissed'

let isObliviateLockActive = false

function getStorage(storageType) {
  if (typeof window === 'undefined') {
    return null
  }

  return storageType === 'session' ? window.sessionStorage : window.localStorage
}

function readStoredFlag(key, storageType = 'local') {
  const storage = getStorage(storageType)

  if (!storage) {
    return false
  }

  try {
    return storage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function writeStoredFlag(key, value, storageType = 'local') {
  const storage = getStorage(storageType)

  if (!storage) {
    return
  }

  try {
    if (value) {
      storage.setItem(key, 'true')
      return
    }

    storage.removeItem(key)
  } catch {
    // Ignore storage failures and fall back to the current in-memory session.
  }
}

export function hasPortalAccess() {
  writeStoredFlag(PORTAL_ACCESS_KEY, false, 'local')
  return readStoredFlag(PORTAL_ACCESS_KEY, 'session')
}

export function rememberPortalAccess({ dismissTutorial = false } = {}) {
  writeStoredFlag(PORTAL_ACCESS_KEY, false, 'local')
  writeStoredFlag(PORTAL_ACCESS_KEY, true, 'session')

  if (dismissTutorial) {
    rememberTutorialDismissed()
  }
}

export function clearPortalAccess() {
  writeStoredFlag(PORTAL_ACCESS_KEY, false, 'session')
  writeStoredFlag(PORTAL_ACCESS_KEY, false, 'local')
}

export function hasTutorialBeenDismissed() {
  return readStoredFlag(TUTORIAL_DISMISSED_KEY)
}

export function rememberTutorialDismissed() {
  writeStoredFlag(TUTORIAL_DISMISSED_KEY, true)
}

export function clearTutorialDismissed() {
  writeStoredFlag(TUTORIAL_DISMISSED_KEY, false)
}

export function triggerObliviateLock() {
  isObliviateLockActive = true
  clearPortalAccess()
  clearTutorialDismissed()
}

export function hasObliviateLock() {
  return isObliviateLockActive
}

export function clearObliviateLock() {
  isObliviateLockActive = false
}
