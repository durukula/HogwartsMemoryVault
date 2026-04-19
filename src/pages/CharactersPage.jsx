import { useDeferredValue, useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import WikiSearchBar from '../components/WikiSearchBar'
import WikiStatePanel from '../components/WikiStatePanel'
import { getCharacters } from '../services/hpApi'

const INITIAL_VISIBLE_COUNT = 12

function CharactersPage() {
  const { house, system } = useOutletContext()
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [houseFilter, setHouseFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [reloadNonce, setReloadNonce] = useState(0)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCharacters() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getCharacters(controller.signal)
        setCharacters(data)
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('Character directory could not be loaded.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCharacters()

    return () => {
      controller.abort()
    }
  }, [reloadNonce])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [deferredQuery, houseFilter, roleFilter])

  const houseOptions = ['all', ...new Set(characters.map((character) => character.house))]
  const filteredCharacters = characters.filter((character) => {
    const matchesQuery = deferredQuery
      ? character.searchBlob.includes(deferredQuery.trim().toLowerCase())
      : true
    const matchesHouse = houseFilter === 'all' ? true : character.house === houseFilter
    const matchesRole =
      roleFilter === 'all'
        ? true
        : roleFilter === 'student'
          ? character.hogwartsStudent
          : roleFilter === 'staff'
            ? character.hogwartsStaff
            : !character.hogwartsStudent && !character.hogwartsStaff

    return matchesQuery && matchesHouse && matchesRole
  })
  const visibleCharacters = filteredCharacters.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <section className={`${system.card}`} data-tutorial-focus-id="characters-overview">
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className={system.cardBadge}>Character archive</span>
            <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-[3.2rem]">
              Wizarding Character Archive
            </h2>
            <p className="mt-4 font-body text-[1.12rem] leading-relaxed text-white/74">
              Browse the witches and wizards of the series, then narrow the archive by name,
              house, or Hogwarts role.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Total', characters.length || '...'],
              ['Filtered', filteredCharacters.length || 0],
              ['Theme', house.name],
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

      <WikiSearchBar
        filters={
          <>
            <label className="block">
              <span className={system.inputLabel}>House Filter</span>
              <select
                className={system.input}
                onChange={(event) => setHouseFilter(event.target.value)}
                value={houseFilter}
              >
                {houseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All houses' : option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={system.inputLabel}>Role Filter</span>
              <select
                className={system.input}
                onChange={(event) => setRoleFilter(event.target.value)}
                value={roleFilter}
              >
                <option value="all">All roles</option>
                <option value="student">Students</option>
                <option value="staff">Staff</option>
                <option value="other">Other</option>
              </select>
            </label>

            <div className="flex items-end">
              <button className={system.buttonSecondary} onClick={() => setReloadNonce((value) => value + 1)} type="button">
                Reload Archive
              </button>
            </div>
          </>
        }
        hint="Search by name, actor, ancestry, or other familiar details."
        label="Search characters"
        onChange={setQuery}
        placeholder="Harry Potter, Snape, pure-blood, actor name..."
        system={system}
        value={query}
      />

      {isLoading ? (
        <WikiStatePanel
          body="Loading portraits, house records, and known details..."
          title="Loading Characters"
        />
      ) : errorMessage ? (
        <WikiStatePanel
          action={
            <button className={system.buttonPrimary} onClick={() => setReloadNonce((value) => value + 1)}>
              Retry Characters
            </button>
          }
          body={errorMessage}
          title="Failed To Load Data"
          type="error"
        />
      ) : !filteredCharacters.length ? (
        <WikiStatePanel
          body="No characters matched the current search and filters. Try a broader query."
          title="Archive Empty"
          type="empty"
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {visibleCharacters.map((character) => (
              <Link key={character.id} className={`${system.card} overflow-hidden p-0`} to={`/${house.id}/characters/${character.id}`}>
                <div className="grid h-full md:grid-cols-[11rem_minmax(0,1fr)]">
                  <div className="bg-black/30">
                    {character.image ? (
                      <img
                        alt={character.name}
                        className="h-full min-h-[15rem] w-full object-cover"
                        src={character.image}
                      />
                    ) : (
                      <div className="grid h-full min-h-[15rem] place-items-center font-display text-4xl text-white/60">
                        ?
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 flex min-w-0 flex-col gap-4 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`${system.cardBadge} house-name-lock`}>{character.house}</span>
                      <span className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-3 py-2 font-ui text-[0.62rem] tracking-[0.12em] text-white/68">
                        {character.role}
                      </span>
                    </div>

                    <div>
                      <p className="character-card-name character-card-name--feature whitespace-normal font-display text-[1.56rem] text-white">
                        {character.name}
                      </p>
                      <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/72">
                        Actor: {character.actor}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ['Species', character.species],
                        ['Ancestry', character.ancestry],
                        ['Patronus', character.patronus],
                        ['Status', character.alive ? 'Alive' : 'Unknown / deceased'],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                        >
                          <p className="section-label">{label}</p>
                          <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/72">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {visibleCount < filteredCharacters.length ? (
            <div className="flex justify-center">
              <button
                className={system.buttonPrimary}
                onClick={() => setVisibleCount((value) => value + INITIAL_VISIBLE_COUNT)}
                type="button"
              >
                Load More Characters
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default CharactersPage
