import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom'
import HouseCrest from '../components/HouseCrest'
import WikiSearchBar from '../components/WikiSearchBar'
import WikiStatePanel from '../components/WikiStatePanel'
import { getCharactersByHouse } from '../services/hpApi'

const INITIAL_VISIBLE_COUNT = 10
const VALID_HOUSE_IDS = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff']

function formatHouseName(houseId) {
  if (!houseId) {
    return 'House'
  }

  return houseId.slice(0, 1).toUpperCase() + houseId.slice(1)
}

function HouseDetailPage() {
  const { targetHouseId } = useParams()
  const { house, system } = useOutletContext()
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const deferredQuery = useDeferredValue(query)
  const isValidHouseId = VALID_HOUSE_IDS.includes(targetHouseId)

  const targetHouseName = formatHouseName(targetHouseId)

  useEffect(() => {
    if (!isValidHouseId) {
      return undefined
    }

    const controller = new AbortController()

    async function loadMembers() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getCharactersByHouse(targetHouseId, controller.signal)
        setMembers(data)
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('House member archive could not be loaded.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadMembers()

    return () => {
      controller.abort()
    }
  }, [isValidHouseId, targetHouseId])

  useEffect(() => {
    if (!isValidHouseId) {
      return
    }

    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [deferredQuery, isValidHouseId, targetHouseId])

  const filteredMembers = members.filter((member) =>
    deferredQuery ? member.searchBlob.includes(deferredQuery.trim().toLowerCase()) : true,
  )
  const visibleMembers = filteredMembers.slice(0, visibleCount)

  const houseSummary = useMemo(() => {
    if (!isValidHouseId) {
      return {
        students: 0,
        staff: 0,
        portraits: 0,
        patronusKnown: 0,
        wandKnown: 0,
        living: 0,
        actorNames: [],
        species: [],
        ancestries: [],
        portraitsPreview: [],
      }
    }

    const actorNames = Array.from(
      new Set(members.map((member) => member.actor).filter((actor) => actor !== 'Unknown actor')),
    ).slice(0, 8)
    const species = Array.from(
      new Set(members.map((member) => member.species).filter((value) => value !== 'Unknown species')),
    )
    const ancestries = Array.from(
      new Set(members.map((member) => member.ancestry).filter((value) => value !== 'Unknown ancestry')),
    )
    const portraits = members.filter((member) => member.image).slice(0, 4)

    return {
      students: members.filter((member) => member.hogwartsStudent).length,
      staff: members.filter((member) => member.hogwartsStaff).length,
      portraits: members.filter((member) => member.image).length,
      patronusKnown: members.filter((member) => member.patronus !== 'Unknown patronus').length,
      wandKnown: members.filter((member) => member.wand !== 'Unknown wand').length,
      living: members.filter((member) => member.alive).length,
      actorNames,
      species,
      ancestries,
      portraitsPreview: portraits,
    }
  }, [isValidHouseId, members])

  if (!isValidHouseId) {
    return <Navigate replace to={`/${house.id}/houses`} />
  }

  return (
    <div className="space-y-6">
      <Link className={system.buttonSecondary} to={`/${house.id}/houses`}>
        Back To House Directory
      </Link>

      <section className={`${system.card} house-lore-banner`}>
        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)]">
          <div className="flex items-start gap-5 overflow-safe">
            <div className="grid h-24 w-24 shrink-0 place-items-center">
              <HouseCrest house={targetHouseId} className="h-20 w-16 sm:h-24 sm:w-20" />
            </div>

            <div>
              <span className={system.cardBadge}>House detail</span>
              <h2 className="ui-nowrap mt-4 font-display text-4xl leading-none text-white sm:text-[3.3rem]">
                {targetHouseName}
              </h2>
              <p className="mt-4 max-w-4xl font-body text-[1.14rem] leading-relaxed text-white/82">
                This page is built from character records returned by the HP API for the selected
                house.
              </p>
              <p className="mt-4 max-w-3xl font-body text-[1.02rem] leading-relaxed text-white/66">
                Browse member counts, portraits, recorded actors, and the searchable house roster
                below.
              </p>
            </div>
          </div>

          <div className={`house-flag house-flag--${targetHouseId} grid place-items-center`}>
            <div className="absolute inset-x-5 top-5 rounded-[1rem] border border-white/10 bg-black/24 px-4 py-4 backdrop-blur-sm">
              <p className="section-label">API records</p>
              <p className="mt-2 font-display text-[1.2rem] text-white">{members.length || '...'} members</p>
            </div>
            <HouseCrest house={targetHouseId} className="h-44 w-36 sm:h-48 sm:w-40" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10 grid gap-4 md:grid-cols-2">
            {[
              ['Members', members.length || '...'],
              ['Students', houseSummary.students],
              ['Staff', houseSummary.staff],
              ['Portraits', houseSummary.portraits],
              ['Known Patronus', houseSummary.patronusKnown],
              ['Known Wands', houseSummary.wandKnown],
              ['Living Records', houseSummary.living],
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
        </article>

        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Recorded Actors</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">Known Cast</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {houseSummary.actorNames.length ? (
                houseSummary.actorNames.map((name) => (
                  <span
                    key={name}
                    className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-4 py-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/78"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <p className="font-body text-[1.02rem] leading-relaxed text-white/68">
                  No actor names are available for this house.
                </p>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Recorded Traits</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">Species And Ancestry</h3>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                <p className="section-label">Species</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {houseSummary.species.length ? (
                    houseSummary.species.map((value) => (
                      <span
                        key={value}
                        className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-4 py-3 font-ui text-[0.66rem] tracking-[0.12em] text-white/76"
                      >
                        {value}
                      </span>
                    ))
                  ) : (
                    <p className="font-body text-[1rem] leading-relaxed text-white/68">
                      No species data is available.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                <p className="section-label">Ancestry</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {houseSummary.ancestries.length ? (
                    houseSummary.ancestries.map((value) => (
                      <span
                        key={value}
                        className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-4 py-3 font-ui text-[0.66rem] tracking-[0.12em] text-white/76"
                      >
                        {value}
                      </span>
                    ))
                  ) : (
                    <p className="font-body text-[1rem] leading-relaxed text-white/68">
                      No ancestry data is available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Portrait Preview</p>
            <h3 className="mt-2 font-display text-[2rem] text-white">Available Images</h3>

            <div className="mt-5 grid gap-3">
              {houseSummary.portraitsPreview.length ? (
                houseSummary.portraitsPreview.map((member) => (
                  <Link
                    key={member.id}
                    className="overflow-hidden rounded-[1.2rem] border border-white/8 bg-black/18"
                    to={`/${house.id}/characters/${member.id}`}
                  >
                    <div className="grid md:grid-cols-[6rem_minmax(0,1fr)]">
                      <img
                        alt={member.name}
                        className="h-full min-h-[6rem] w-full object-cover"
                        src={member.image}
                      />
                      <div className="p-4">
                        <p className="font-display text-[1.1rem] text-white">{member.name}</p>
                        <p className="mt-2 font-body text-[0.96rem] leading-relaxed text-white/68">
                          {member.actor}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="font-body text-[1rem] leading-relaxed text-white/68">
                  No portraits are available for this house.
                </p>
              )}
            </div>
          </div>
        </article>
      </section>

      <WikiSearchBar
        hint="Search this house by character name, actor, ancestry, or any text in the archive entry."
        label={`${targetHouseName} member search`}
        onChange={setQuery}
        placeholder={`Search inside ${targetHouseName}...`}
        system={system}
        value={query}
      />

      {isLoading ? (
        <WikiStatePanel
          body={`Loading ${targetHouseName} members and house records...`}
          title="Loading House Detail"
        />
      ) : errorMessage ? (
        <WikiStatePanel
          action={
            <Link className={system.buttonPrimary} to={`/${house.id}/houses`}>
              Return To Houses
            </Link>
          }
          body={errorMessage}
          title="Failed To Load Data"
          type="error"
        />
      ) : !filteredMembers.length ? (
        <WikiStatePanel
          body="No members matched the current search."
          title="No Members Found"
          type="empty"
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleMembers.map((member) => (
              <Link
                key={member.id}
                className={`${system.card} overflow-hidden p-0`}
                to={`/${house.id}/characters/${member.id}`}
              >
                <div className="grid h-full md:grid-cols-[10rem_minmax(0,1fr)]">
                  <div className="bg-black/24">
                    {member.image ? (
                      <img
                        alt={member.name}
                        className="h-full min-h-[14rem] w-full object-cover"
                        src={member.image}
                      />
                    ) : (
                      <div className="grid h-full min-h-[14rem] place-items-center font-display text-4xl text-white/60">
                        {member.name.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 min-w-0 p-5">
                    <p className="character-card-name character-card-name--standard font-display text-[1.45rem] text-white">
                      {member.name}
                    </p>
                    <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/72">
                      {member.actor}
                    </p>
                    <div className="mt-4 grid gap-3">
                      {[
                        ['Role', member.role],
                        ['Species', member.species],
                        ['Patronus', member.patronus],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                        >
                          <p className="section-label">{label}</p>
                          <p className="mt-3 font-body text-[0.98rem] leading-relaxed text-white/70">
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

          {visibleCount < filteredMembers.length ? (
            <div className="flex justify-center">
              <button
                className={system.buttonPrimary}
                onClick={() => setVisibleCount((value) => value + INITIAL_VISIBLE_COUNT)}
                type="button"
              >
                Load More Members
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default HouseDetailPage
