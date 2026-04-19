export const spellDefinitions = {
  incendio: {
    key: 'incendio',
    label: 'Incendio',
    description: 'Conjures a controlled burst of magical fire.',
    effect: 'fire',
    durationMs: 2600,
  },
}

export const availableSpells = Object.values(spellDefinitions)

export function getSpellDefinition(spellKey) {
  return spellDefinitions[spellKey] ?? spellDefinitions.incendio
}
