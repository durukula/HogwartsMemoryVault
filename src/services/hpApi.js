import { mergeCastableSpells } from '../data/castableSpells'

const API_BASE_URL = 'https://hp-api.onrender.com/api'

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeText(value, fallback = 'Unknown') {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed || fallback
}

function formatWand(wand) {
  if (!wand || typeof wand !== 'object') {
    return 'Unknown wand'
  }

  const parts = [wand.wood, wand.core, wand.length ? `${wand.length}"` : '']
    .filter(Boolean)
    .map((part) => String(part).trim())

  return parts.length ? parts.join(' · ') : 'Unknown wand'
}

async function request(path, signal) {
  // Main public API integration: all list/detail pages pull their core content from this HP API.
  const response = await fetch(`${API_BASE_URL}${path}`, { signal })

  if (!response.ok) {
    // Pages convert this into user-facing “Failed to load…” states via try/catch.
    throw new Error(`HP API returned ${response.status}`)
  }

  return response.json()
}

function takeFirstRecord(payload) {
  return Array.isArray(payload) ? payload[0] ?? null : payload
}

export function normalizeCharacter(character) {
  const name = normalizeText(character?.name)
  const alternateNames = ensureArray(character?.alternate_names).filter(Boolean)
  const house = normalizeText(character?.house, 'Unsorted')
  const actor = normalizeText(character?.actor, 'Unknown actor')
  const role = character?.hogwartsStaff
    ? 'Staff'
    : character?.hogwartsStudent
      ? 'Student'
      : 'Wizarding world'

  return {
    id: character?.id ?? name,
    name,
    image: typeof character?.image === 'string' ? character.image.trim() : '',
    house,
    role,
    actor,
    species: normalizeText(character?.species, 'Unknown species'),
    ancestry: normalizeText(character?.ancestry, 'Unknown ancestry'),
    patronus: normalizeText(character?.patronus, 'Unknown patronus'),
    dateOfBirth: normalizeText(character?.dateOfBirth, 'Unknown birthday'),
    yearOfBirth: character?.yearOfBirth ?? 'Unknown year',
    alive: Boolean(character?.alive),
    wizard: Boolean(character?.wizard),
    gender: normalizeText(character?.gender, 'Unknown gender'),
    eyeColour: normalizeText(character?.eyeColour, 'Unknown eye colour'),
    hairColour: normalizeText(character?.hairColour, 'Unknown hair colour'),
    wand: formatWand(character?.wand),
    alternateNames,
    hogwartsStudent: Boolean(character?.hogwartsStudent),
    hogwartsStaff: Boolean(character?.hogwartsStaff),
    searchBlob: [
      name,
      actor,
      house,
      normalizeText(character?.species, ''),
      normalizeText(character?.ancestry, ''),
      alternateNames.join(' '),
    ]
      .join(' ')
      .toLowerCase(),
  }
}

export function normalizeSpell(spell) {
  const name = normalizeText(spell?.name)
  const description = normalizeText(spell?.description, 'No description available.')

  return {
    id: spell?.id ?? name,
    name,
    description,
    searchBlob: `${name} ${description}`.toLowerCase(),
  }
}

export async function getCharacters(signal) {
  const data = await request('/characters', signal)
  return data.map(normalizeCharacter)
}

export async function getCharacterById(id, signal) {
  const data = takeFirstRecord(await request(`/character/${id}`, signal))

  if (!data) {
    throw new Error('Character not found')
  }

  return normalizeCharacter(data)
}

export async function getCharactersByHouse(houseId, signal) {
  const data = await request(`/characters/house/${houseId}`, signal)
  return data.map(normalizeCharacter)
}

export async function getStudents(signal) {
  const data = await request('/characters/students', signal)
  return data.map(normalizeCharacter)
}

export async function getStaff(signal) {
  const data = await request('/characters/staff', signal)
  return data.map(normalizeCharacter)
}

export async function getSpells(signal) {
  const data = await request('/spells', signal)
  return mergeCastableSpells(data.map(normalizeSpell))
}
