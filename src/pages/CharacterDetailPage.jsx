import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import WikiStatePanel from '../components/WikiStatePanel'
import { getCharacterById, getCharactersByHouse } from '../services/hpApi'

function CharacterDetailPage() {
  const { characterId } = useParams()
  const { house, system } = useOutletContext()
  const [character, setCharacter] = useState(null)
  const [relatedCharacters, setRelatedCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCharacter() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const nextCharacter = await getCharacterById(characterId, controller.signal)
        setCharacter(nextCharacter)

        if (nextCharacter.house !== 'Unsorted') {
          const related = await getCharactersByHouse(
            nextCharacter.house.toLowerCase(),
            controller.signal,
          )
          setRelatedCharacters(related.filter((entry) => entry.id !== nextCharacter.id).slice(0, 4))
          return
        }

        setRelatedCharacters([])
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('Character detail could not be loaded.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCharacter()

    return () => {
      controller.abort()
    }
  }, [characterId])

  if (isLoading) {
    return (
      <WikiStatePanel
        body="Loading portrait, biography markers, wand details, and related characters..."
        title="Loading Character Detail"
      />
    )
  }

  if (errorMessage || !character) {
    return (
      <WikiStatePanel
        action={
          <Link className={system.buttonPrimary} to={`/${house.id}/characters`}>
            Back To Characters
          </Link>
        }
        body={errorMessage || 'This character could not be found.'}
        title="Failed To Load Data"
        type="error"
      />
    )
  }

  const identityFields = [
    ['Actor', character.actor],
    ['House', character.house],
    ['Role', character.role],
    ['Species', character.species],
    ['Gender', character.gender],
    ['Ancestry', character.ancestry],
  ]

  const magicFields = [
    ['Patronus', character.patronus],
    ['Wand', character.wand],
    ['Wizard', character.wizard ? 'Yes' : 'No'],
    ['Status', character.alive ? 'Alive' : 'Unknown / deceased'],
    ['Birthday', character.dateOfBirth],
    ['Birth Year', character.yearOfBirth],
    ['Eye Colour', character.eyeColour],
    ['Hair Colour', character.hairColour],
  ]

  return (
    <div className="space-y-6">
      <Link className={system.buttonSecondary} to={`/${house.id}/characters`}>
        Back To Character Archive
      </Link>

      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)]">
        <article className={`${system.card} overflow-hidden p-0`}>
          {character.image ? (
            <img
              alt={character.name}
              className="h-full min-h-[26rem] w-full object-cover"
              src={character.image}
            />
          ) : (
            <div className="grid min-h-[26rem] place-items-center font-display text-5xl text-white/60">
              {character.name.slice(0, 1)}
            </div>
          )}
        </article>

        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`${system.cardBadge} house-name-lock`}>{character.house}</span>
              <span className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-3 py-2 font-ui text-[0.62rem] tracking-[0.12em] text-white/68">
                {character.role}
              </span>
            </div>

            <h2 className="mt-4 whitespace-normal font-display text-4xl leading-none text-white sm:text-[3.4rem]">
              {character.name}
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ['Actor', character.actor],
                ['Species', character.species],
                ['Ancestry', character.ancestry],
                ['Patronus', character.patronus],
                ['Birthday', character.dateOfBirth],
                ['Birth Year', character.yearOfBirth],
                ['Wand', character.wand],
                ['Status', character.alive ? 'Alive' : 'Unknown / deceased'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                >
                  <p className="section-label">{label}</p>
                  <p className="mt-3 font-body text-[1.02rem] leading-relaxed text-white/74">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Identity Record</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">Primary Details</h3>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {identityFields.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                >
                  <p className="section-label">{label}</p>
                  <p className="mt-3 font-body text-[1.02rem] leading-relaxed text-white/74">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Alternate Names</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">Known Aliases</h3>

            {character.alternateNames.length ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {character.alternateNames.map((name) => (
                  <span
                    key={name}
                    className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-4 py-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/74"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-5 font-body text-[1.04rem] leading-relaxed text-white/68">
                No alternate names are listed for this character.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className={`${system.card} overflow-safe`}>
        <div className="relative z-10">
          <p className="section-label">Magical Profile</p>
          <h3 className="mt-2 font-display text-[2rem] text-white">Known Traits</h3>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {magicFields.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
              >
                <p className="section-label">{label}</p>
                <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/72">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${system.card} overflow-safe`}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Related Characters</p>
              <h3 className="mt-2 font-display text-[2rem] text-white">
                {character.house === 'Unsorted' ? 'No House Archive' : `${character.house} Companions`}
              </h3>
            </div>
            {character.house !== 'Unsorted' ? (
              <Link className={system.buttonSecondary} to={`/${house.id}/houses/${character.house.toLowerCase()}`}>
                Open House Page
              </Link>
            ) : null}
          </div>

          {relatedCharacters.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedCharacters.map((entry) => (
                <Link
                  key={entry.id}
                  className="related-character-card overflow-hidden rounded-[1.4rem] border border-white/8 bg-black/18"
                  to={`/${house.id}/characters/${entry.id}`}
                >
                  <div className="related-character-media">
                    {entry.image ? (
                      <img alt={entry.name} className="related-character-image" src={entry.image} />
                    ) : (
                      <div className="grid h-full place-items-center font-display text-4xl text-white/60">
                        {entry.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="character-card-name character-card-name--compact font-display text-[1.2rem] text-white">
                      {entry.name}
                    </p>
                    <p className="mt-2 font-body text-[0.98rem] leading-relaxed text-white/66">
                      {entry.actor}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 font-body text-[1.04rem] leading-relaxed text-white/68">
              No related characters are available for this entry.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default CharacterDetailPage
