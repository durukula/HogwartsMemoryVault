export const tileTones = {
  correct: 'tile-correct',
  present: 'tile-present',
  absent: 'tile-absent',
  empty: 'tile-empty',
  typing: 'tile-typing',
}

export const keyTones = {
  idle: 'key-idle',
  correct: 'key-correct',
  present: 'key-present',
  absent: 'key-absent',
  action: 'key-action',
}

export function getKeyTone(label, keys) {
  if (label === 'Enter' || label === 'Back') {
    return 'action'
  }

  if (keys.correct.includes(label)) {
    return 'correct'
  }

  if (keys.present.includes(label)) {
    return 'present'
  }

  if (keys.absent.includes(label)) {
    return 'absent'
  }

  return 'idle'
}
