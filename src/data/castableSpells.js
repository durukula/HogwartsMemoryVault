const castableSpellConfigs = [
  {
    key: 'avada-kedavra',
    name: 'Avada Kedavra',
    description: 'The Killing Curse, infamous for ending life instantly with no known counter-curse.',
    castPreview: 'Attempts to close the site immediately.',
  },
  {
    key: 'lumos',
    name: 'Lumos',
    description: 'A wand-lighting charm that creates a beam of light at the tip of the wand.',
    castPreview: 'Ignites a glowing light at the tip of the cursor wand.',
  },
  {
    key: 'conjunctivitis-curse',
    name: 'Conjunctivitis Curse',
    description: 'A curse that attacks the eyes and leaves its target disoriented and overwhelmed.',
    castPreview: 'Covers the page with a giant blur effect for 5 seconds.',
  },
  {
    key: 'engorgio',
    name: 'Engorgio',
    description: 'The Engorgement Charm causes the target to swell and grow larger over time.',
    castPreview: 'Makes the Enchanted Carousel card grow for 5 seconds.',
  },
  {
    key: 'wingardium-leviosa',
    name: 'Wingardium Leviosa',
    description: 'The Levitation Charm makes an object rise and drift through the air under magical control.',
    castPreview: 'Lifts the active spell card into the air for 5 seconds.',
  },
  {
    key: 'evanesco',
    name: 'Evanesco',
    description: 'A vanishing spell used to make an object disappear from sight.',
    castPreview: 'Makes the Enchanted Carousel card disappear for 5 seconds.',
  },
  {
    key: 'obscuro',
    name: 'Obscuro',
    description: 'A blindfolding spell that blocks sight by covering the eyes in darkness.',
    castPreview: 'Turns the page black for 5 seconds.',
  },
  {
    key: 'immobulus',
    name: 'Immobulus',
    description: 'A freezing charm that stops a target in place.',
    castPreview: 'Freezes the Golden Snitch in place for 5 seconds.',
    aliases: ['immobilus'],
  },
  {
    key: 'homunculus-charm',
    name: 'Homunculus Charm',
    description: 'A revealing charm associated with tracking movement and magical presence.',
    castPreview: 'Shows the caster location.',
    aliases: ['homonculus charm'],
  },
  {
    key: 'ascendio',
    name: 'Ascendio',
    description: 'An upward-driving charm used to launch the caster or target quickly skyward.',
    castPreview: 'Scrolls the page straight to the top.',
  },
  {
    key: 'incendio',
    name: 'Incendio',
    description: 'A fire-making charm that sends controlled flame from the wand.',
    castPreview: 'Ignites a controlled fiery glow around the active spell card for 5 seconds.',
  },
  {
    key: 'diffindo',
    name: 'Diffindo',
    description: 'The Severing Charm cuts or splits a target with fast, precise force.',
    castPreview: 'Slices through the active spell card with a dramatic split effect for 5 seconds.',
  },
  {
    key: 'aguamenti',
    name: 'Aguamenti',
    description: 'A water-conjuring charm that produces a directed stream or surge of clean water.',
    castPreview: 'Fills the active spell card with a rising magical water surge for 5 seconds.',
  },
  {
    key: 'apparate',
    name: 'Apparate',
    description: 'A branch of magical travel that lets a wizard vanish from one place and appear in another.',
    castPreview: 'Routes to a random page somewhere in the site.',
  },
  {
    key: 'obliviate',
    name: 'Obliviate',
    description: 'A memory charm used to erase or alter recollections.',
    castPreview: 'Sends the user back to the Muggle page and requires Revelio again.',
  },
]

const castableSpellMap = new Map(
  castableSpellConfigs.flatMap((config) => {
    const entries = [[config.name.trim().toLowerCase(), config]]
    if (Array.isArray(config.aliases)) {
      config.aliases
        .map((alias) => alias.trim().toLowerCase())
        .filter(Boolean)
        .forEach((alias) => entries.push([alias, config]))
    }
    return entries
  }),
)

function toSpellId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function toSearchBlob(name, description, castPreview) {
  return `${name} ${description} ${castPreview}`.toLowerCase()
}

export function getCastableSpellConfigs() {
  return castableSpellConfigs
}

export function enrichSpellWithCastableConfig(spell) {
  const config = castableSpellMap.get(spell.name.trim().toLowerCase())

  if (!config) {
    return {
      ...spell,
      isCastable: false,
      castKey: '',
      castPreview: '',
    }
  }

  return {
    ...spell,
    isCastable: true,
    castKey: config.key,
    castPreview: config.castPreview,
  }
}

export function mergeCastableSpells(spells) {
  const byName = new Map(
    spells.map((spell) => [spell.name.trim().toLowerCase(), enrichSpellWithCastableConfig(spell)]),
  )

  castableSpellConfigs.forEach((config) => {
    const lookupKey = config.name.trim().toLowerCase()

    if (byName.has(lookupKey)) {
      return
    }

    byName.set(lookupKey, {
      id: toSpellId(config.name),
      name: config.name,
      description: config.description,
      searchBlob: toSearchBlob(config.name, config.description, config.castPreview),
      isCastable: true,
      castKey: config.key,
      castPreview: config.castPreview,
    })
  })

  return Array.from(byName.values())
}
