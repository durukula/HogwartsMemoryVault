import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import HouseCrest from '../components/HouseCrest'
import { houseLore } from '../data/houseLore'
import WikiStatePanel from '../components/WikiStatePanel'
import { houses as houseThemes } from '../data/houses'
import { getCharacters } from '../services/hpApi'

function HousesPage() {
  const { house, system } = useOutletContext()
  const [houseSummaries, setHouseSummaries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadNonce, setReloadNonce] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadHouses() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const characters = await getCharacters(controller.signal)
        const summaries = houseThemes.map((entry) => {
          const members = characters.filter(
            (character) => character.house.toLowerCase() === entry.name.toLowerCase(),
          )

          return {
            id: entry.id,
            name: entry.name,
            trait: entry.trait,
            description: entry.description,
            lore: houseLore[entry.id],
            members,
            students: members.filter((member) => member.hogwartsStudent).length,
            staff: members.filter((member) => member.hogwartsStaff).length,
          }
        })

        setHouseSummaries(summaries)
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('House records could not be built from the character archive.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadHouses()

    return () => {
      controller.abort()
    }
  }, [reloadNonce])

  return (
    <div className="space-y-6">
      <section className={`${system.card}`} data-tutorial-focus-id="houses-overview">
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className={system.cardBadge}>House archive</span>
            <h2 className="ui-nowrap mt-4 font-display text-4xl leading-none text-white sm:text-[3.2rem]">
              Hogwarts House Directory
            </h2>
            <p className="mt-4 font-body text-[1.12rem] leading-relaxed text-white/74">
              Choose a house to open its roster, founder notes, traits, and common room record.
            </p>
          </div>

          <button className={system.buttonSecondary} onClick={() => setReloadNonce((value) => value + 1)} type="button">
            Refresh House Records
          </button>
        </div>
      </section>

      {isLoading ? (
        <WikiStatePanel
          body="Gathering the house records..."
          title="Loading Houses"
        />
      ) : errorMessage ? (
        <WikiStatePanel
          action={
            <button className={system.buttonPrimary} onClick={() => setReloadNonce((value) => value + 1)}>
              Retry Houses
            </button>
          }
          body={errorMessage}
          title="Failed To Load Data"
          type="error"
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {houseSummaries.map((entry) => (
            <Link
              key={entry.id}
              className={`${system.card} house-directory-stage house-directory-card--${entry.id} overflow-hidden p-0`}
              to={`/${house.id}/houses/${entry.id}`}
            >
              <div className="grid h-full lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
                <div className="grid place-items-center border-b border-white/8 bg-black/16 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <div className={`house-directory-emblem house-directory-emblem--${entry.id} w-full`}>
                    <div className="house-directory-emblem-topline">
                      <span className="house-directory-emblem-chip">House Record</span>
                    </div>

                    <div className="house-directory-emblem-crest">
                      <HouseCrest house={entry.id} className="h-36 w-32 sm:h-40 sm:w-36" />
                    </div>

                    <div className="house-directory-emblem-copy">
                      <p className="ui-nowrap house-name-lock font-display text-[2rem] leading-none text-white">{entry.name}</p>
                      <p className="ui-nowrap mt-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/72">
                        {entry.lore.emblem} house
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 p-6 overflow-safe">
                  <div className="min-w-0">
                    <h3 className="ui-nowrap house-name-lock mt-4 font-display text-[2.2rem] text-white">{entry.name}</h3>
                    <p className="mt-4 font-body text-[1.08rem] leading-relaxed text-white/78">
                      {entry.lore.legend}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}

export default HousesPage
