import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { quidditchFeature } from '../data/quidditchFeatures'
import prophetCover from '../assets/prophet.jpeg'

function QuidditchPage() {
  const { house, system } = useOutletContext()
  const featureLink = `/${house.id}/quidditch/${quidditchFeature.featuredMatch.slug}`
  const [isProphetOpen, setIsProphetOpen] = useState(false)

  useEffect(() => {
    if (!isProphetOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsProphetOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProphetOpen])

  return (
    <div className="space-y-6">
      <section
        className={`${system.card} quidditch-ledger newspaper-panel`}
        data-tutorial-focus-id="quidditch-overview"
      >
        <div className="relative z-10 quidditch-gazette-flow">
          <div className="overflow-safe quidditch-gazette-lead">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <div>
                <span className={system.cardBadge}>Sports archive</span>
                <p className="mt-4 font-ui text-[0.72rem] tracking-[0.12em] text-white/52">
                  The Daily Prophet Sports Desk
                </p>
                <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-[3.8rem]">
                  {quidditchFeature.overview.title}
                </h2>
                <p className="mt-5 max-w-3xl font-body text-[1.22rem] leading-relaxed text-white/78">
                  {quidditchFeature.overview.strapline}
                </p>
                <p className="mt-4 max-w-3xl font-body text-[1.08rem] leading-relaxed text-white/68">
                  {quidditchFeature.overview.intro}
                </p>
              </div>

              <div className="lg:pt-2">
                <img
                  alt="The Daily Prophet sports clipping"
                  className="quidditch-cover-trigger h-[22rem] w-full object-contain sm:h-[26rem] lg:h-[34rem]"
                  onClick={() => setIsProphetOpen(true)}
                  src={prophetCover}
                />
              </div>
            </div>
          </div>

          <div className="quidditch-gazette-strip">
            {[
              ['Match to revisit', quidditchFeature.featuredMatch.title],
              ['Headline rivalry', 'Gryffindor vs Slytherin'],
              ['Theme edition', `${house.name} sports print`],
            ].map(([label, value]) => (
              <div key={label} className="quidditch-gazette-inline">
                <p className="section-label">{label}</p>
                <p className="mt-2 font-display text-[1.2rem] text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="quidditch-gazette-rule"></div>

          <div className="quidditch-gazette-columns">
            <section className="overflow-safe">
              <p className="section-label">Positions at a glance</p>
              <h3 className="mt-2 font-display text-[2.25rem] text-white">Who Shapes A Match</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {quidditchFeature.positions.map((position) => (
                  <article key={position.id} className="quidditch-gazette-entry">
                    <p className="font-display text-[1.6rem] text-white">{position.title}</p>
                    <p className="mt-3 font-body text-[1.04rem] leading-relaxed text-white/76">
                      {position.duty}
                    </p>
                    <p className="mt-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/54">
                      {position.vibe}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="overflow-safe">
              <p className="section-label">Feature match</p>
              <h3 className="mt-2 font-display text-[2.8rem] leading-none text-white">
                {quidditchFeature.featuredMatch.title}
              </h3>
              <p className="mt-4 font-display text-[1.7rem] text-white/88">
                Hogwarts inter-house showdown
              </p>
              <p className="mt-5 font-body text-[1.12rem] leading-relaxed text-white/76">
                {quidditchFeature.featuredMatch.dek}
              </p>
              <p className="mt-4 font-body text-[1.08rem] leading-relaxed text-white/68">
                {quidditchFeature.featuredMatch.summary}
              </p>

              <div className="mt-6 grid gap-3">
                {quidditchFeature.featuredMatch.beats.map((beat, index) => (
                  <div key={beat} className="quidditch-gazette-entry">
                    <p className="section-label">Moment {String(index + 1).padStart(2, '0')}</p>
                    <p className="mt-2 font-body text-[1.04rem] leading-relaxed text-white/76">
                      {beat}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={system.buttonPrimary} to={featureLink}>
                  Open Full Match Report
                </Link>
                <Link className={system.buttonSecondary} to={`/${house.id}/game`}>
                  Return To House Game
                </Link>
              </div>
            </section>
          </div>

          <div className="quidditch-gazette-rule"></div>

          <div className="quidditch-gazette-footer">
            <div className="quidditch-gazette-inline">
              <p className="section-label">Lead rivalry</p>
              <p className="mt-2 font-body text-[1.02rem] leading-relaxed text-white/74">
                Gryffindor and Slytherin turn every school match into a performance of pride,
                nerves, and open dislike.
              </p>
            </div>
            <div className="quidditch-gazette-inline">
              <p className="section-label">Pitch mood</p>
              <p className="mt-2 font-body text-[1.02rem] leading-relaxed text-white/74">
                Fast brooms, rogue Bludgers, and the Snitch make Hogwarts Quidditch feel like
                school sport played under impossible pressure.
              </p>
            </div>
            <div className="quidditch-gazette-inline">
              <p className="section-label">Why it lasts</p>
              <p className="mt-2 font-body text-[1.02rem] leading-relaxed text-white/74">
                These matches stay memorable because the sport always carries house reputation,
                school legend, and personal courage at the same time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isProphetOpen ? (
        <div
          className={`${system.modalOverlay} quidditch-cover-backdrop`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsProphetOpen(false)
            }
          }}
          role="presentation"
        >
          <div className={`${system.modalPanel} quidditch-cover-modal max-w-4xl`}>
            <button className={system.modalClose} onClick={() => setIsProphetOpen(false)} type="button">
              Close
            </button>

            <div className="relative z-10">
              <span className={system.modalBadge}>Daily Prophet</span>
              <h3 className="mt-4 font-display text-[2.2rem] text-white sm:text-[2.6rem]">
                Sports Clipping
              </h3>

              <div className="mt-6">
                <img
                  alt="The Daily Prophet sports clipping"
                  className="max-h-[80vh] w-full object-contain"
                  src={prophetCover}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default QuidditchPage
