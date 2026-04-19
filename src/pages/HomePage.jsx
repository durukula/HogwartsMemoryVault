import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import WikiStatePanel from '../components/WikiStatePanel'
import { houseLore } from '../data/houseLore'
import { getCharacters, getSpells, getStaff, getStudents } from '../services/hpApi'

function HomePage() {
  const { house, system } = useOutletContext()
  const lore = houseLore[house.id]
  const [overview, setOverview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadNonce, setReloadNonce] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadOverview() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [characters, spells, students, staff] = await Promise.all([
          getCharacters(controller.signal),
          getSpells(controller.signal),
          getStudents(controller.signal),
          getStaff(controller.signal),
        ])

        const featuredCharacters = ['Harry Potter', 'Hermione Granger', 'Severus Snape', 'Luna Lovegood']
          .map((name) => characters.find((character) => character.name === name))
          .filter(Boolean)

        setOverview({
          stats: [
            ['Characters', characters.length],
            ['Spells', spells.length],
            ['Students', students.length],
            ['Staff', staff.length],
          ],
          featuredCharacters,
          featuredSpells: spells.slice(0, 4),
        })
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setErrorMessage('Wizarding overview could not be loaded right now.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadOverview()

    return () => {
      controller.abort()
    }
  }, [reloadNonce])

  const quickLinks = [
    {
      label: 'Characters',
      body: 'Open the character index and jump into individual records.',
      to: `/${house.id}/characters`,
    },
    {
      label: 'Spells',
      body: 'Browse spell entries and their recorded effects.',
      to: `/${house.id}/spells`,
    },
    {
      label: 'Houses',
      body: 'Compare the four houses and open each house record.',
      to: `/${house.id}/houses`,
    },
    {
      label: 'Game',
      body: 'A quick portrait round for practice.',
      to: `/${house.id}/game`,
    },
    {
      label: 'Quidditch',
      body: 'Match reports, positions, and school rivalries.',
      to: `/${house.id}/quidditch`,
    },
  ]

  return (
    <div className="space-y-6">
      <section
        className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]"
        data-tutorial-focus-id="home-overview"
      >
        <article className={`${system.card} min-h-[24rem]`}>
          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div>
              <span className={system.cardBadge}>Wizarding world archive</span>
              <h2 className="mt-4 max-w-4xl font-display text-4xl leading-none text-white sm:text-[3.8rem]">
                Hogwarts Chronicle — {house.name} Edition
              </h2>
              <p className="mt-5 max-w-3xl font-body text-[1.14rem] leading-relaxed text-white/76 sm:text-[1.22rem]">
                {lore.legend} Browse characters, spells, house records, and Quidditch reports from the school year.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className={system.buttonPrimary} to={`/${house.id}/characters`}>
                Enter Character Archive
              </Link>
              <Link className={system.buttonSecondary} to={`/${house.id}/houses`}>
                Review Hogwarts Houses
              </Link>
            </div>
          </div>
        </article>

        <article className={`${system.card}`}>
          <div className="relative z-10 flex h-full flex-col gap-5">
            <div>
              <p className="section-label">Daily briefing</p>
              <h3 className="mt-2 font-display text-[2rem] text-white">Today’s Index</h3>
            </div>

            <div className="grid gap-3">
              {[
                'Characters — names, roles, houses, and known details.',
                'Spells — incantations with recorded effects.',
                'Houses — founder notes, traits, notable names.',
                'Quidditch — match reports and position notes.',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                >
                  <p className="font-body text-[1.04rem] leading-relaxed text-white/78">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      {isLoading ? (
        <WikiStatePanel
          body="Loading overview..."
          title="Loading Overview"
        />
      ) : errorMessage ? (
        <WikiStatePanel
          action={
            <button className={system.buttonPrimary} onClick={() => setReloadNonce((value) => value + 1)}>
              Retry Overview
            </button>
          }
          body={errorMessage}
          title="Failed To Load Data"
          type="error"
        />
      ) : overview ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {overview.stats.map(([label, value]) => (
              <article key={label} className={`${system.card} p-5`}>
                <div className="relative z-10">
                  <p className="section-label">{label}</p>
                  <p className="mt-3 font-display text-[2.5rem] leading-none text-white">{value}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <article className={`${system.card}`}>
              <div className="relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="section-label">Main Sections</p>
                    <h3 className="mt-2 font-display text-[2.1rem] text-white">Sections</h3>
                  </div>
                  <span className={system.navbarBadge}>{house.name} edition</span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.label}
                      className="rounded-[inherit] border border-white/8 bg-black/18 px-5 py-5 transition-transform duration-300 hover:-translate-y-1"
                      to={item.to}
                    >
                      <p className="section-label">{item.label}</p>
                      <p className="mt-3 font-display text-[1.45rem] text-white">{item.label}</p>
                      <p className="mt-3 font-body text-[1.02rem] leading-relaxed text-white/70">
                        {item.body}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            <article className={`${system.card}`}>
              <div className="relative z-10">
                <p className="section-label">Featured Spells</p>
                <h3 className="mt-2 font-display text-[2.1rem] text-white">Spellbook Sampler</h3>

                <div className="mt-5 grid gap-3">
                  {overview.featuredSpells.map((spell) => (
                    <Link
                      key={spell.id}
                      className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4 transition-transform duration-300 hover:-translate-y-1"
                      to={`/${house.id}/spells/${spell.id}`}
                    >
                      <p className="font-display text-[1.3rem] text-white">{spell.name}</p>
                      <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/68">
                        {spell.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <article className={`${system.card}`}>
              <div className="relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="section-label">Featured Characters</p>
                    <h3 className="mt-2 font-display text-[2.1rem] text-white">Live Portrait Gallery</h3>
                  </div>
                  <Link className={system.buttonSecondary} to={`/${house.id}/characters`}>
                    Open Characters
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {overview.featuredCharacters.map((character) => (
                    <Link
                      key={character.id}
                      className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/18"
                      to={`/${house.id}/characters/${character.id}`}
                    >
                      <div className="grid min-h-full md:grid-cols-[9rem_minmax(0,1fr)]">
                        <div className="bg-black/35">
                          {character.image ? (
                            <img
                              alt={character.name}
                              className="h-full min-h-[11rem] w-full object-cover"
                              src={character.image}
                            />
                          ) : (
                            <div className="grid h-full min-h-[11rem] place-items-center font-display text-2xl text-white/72">
                              ?
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <p className="section-label">{character.house}</p>
                          <p className="character-card-name character-card-name--standard mt-3 font-display text-[1.55rem] text-white">
                            {character.name}
                          </p>
                          <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/70">
                            {character.actor} · {character.role}
                          </p>
                          <p className="mt-4 font-body text-[0.98rem] leading-relaxed text-white/62">
                            Patronus: {character.patronus}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            <article className={`${system.card}`}>
              <div className="relative z-10">
                <p className="section-label">House brief</p>
                <h3 className="mt-2 font-display text-[2rem] text-white">Common Room Notes</h3>
                <p className="mt-4 font-body text-[1.06rem] leading-relaxed text-white/74">
                  {lore.spotlight}
                </p>

                <div className="mt-5 grid gap-3">
                  {[
                    { label: 'Founder', value: lore.founder },
                    { label: 'Common room', value: lore.commonRoom },
                    { label: 'Relic', value: lore.relic },
                    { label: 'House ghost', value: lore.ghost },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                    >
                      <p className="section-label">{item.label}</p>
                      <p className="mt-3 font-display text-[1.2rem] text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default HomePage
