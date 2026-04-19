import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom'
import { quidditchFeature } from '../data/quidditchFeatures'
import prophetCover from '../assets/prophet.jpeg'

function QuidditchDetailPage() {
  const { featureSlug } = useParams()
  const { house, system } = useOutletContext()

  if (featureSlug !== quidditchFeature.featuredMatch.slug) {
    return <Navigate replace to={`/${house.id}/quidditch`} />
  }

  const match = quidditchFeature.featuredMatch

  return (
    <div className="space-y-6">
      <Link className={system.buttonSecondary} to={`/${house.id}/quidditch`}>
        Back To Quidditch Gazette
      </Link>

      <section className={`${system.card} quidditch-ledger newspaper-panel`}>
        <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
          <div className="overflow-safe">
            <p className="ui-nowrap font-ui text-[0.72rem] tracking-[0.12em] text-white/50">
              Special match report
            </p>
            <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-[4rem]">
              {match.title}
            </h2>
            <p className="mt-4 font-display text-[1.8rem] text-white/88">{match.score}</p>
            <p className="mt-6 max-w-4xl font-body text-[1.22rem] leading-relaxed text-white/82">
              {match.summary}
            </p>
          </div>

          <div className="grid gap-3 self-start">
            <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/18 p-3">
              <img
                alt="The Daily Prophet sports clipping"
                className="h-56 w-full object-contain sm:h-64 xl:h-56"
                src={prophetCover}
              />
            </div>
            {[
              ['School rivalry', 'Gryffindor vs Slytherin'],
              ['Match texture', 'Nimbus 2001 arrogance, rogue Bludger chaos, Snitch pressure'],
              ['Headline twist', 'Harry won while hurt and under direct aerial harassment'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
              >
                <p className="section-label">{label}</p>
                <p className="mt-3 font-body text-[1.02rem] leading-relaxed text-white/76">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Front page column</p>
            <h3 className="mt-2 font-display text-[2.2rem] text-white">Why The Match Endures</h3>
            <div className="mt-5 grid gap-4">
              {match.beats.map((beat, index) => (
                <div
                  key={beat}
                  className="rounded-[inherit] border border-white/8 bg-black/18 px-5 py-5"
                >
                  <p className="ui-nowrap font-ui text-[0.64rem] tracking-[0.12em] text-white/48">
                    Moment {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-3 font-body text-[1.08rem] leading-relaxed text-white/78">
                    {beat}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${system.card} overflow-safe`}>
          <div className="relative z-10">
            <p className="section-label">Match cast</p>
            <h3 className="mt-2 font-display text-[2.2rem] text-white">Names In The Air</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {match.cast.map((name) => (
                <span
                  key={name}
                  className="ui-nowrap rounded-full border border-white/10 bg-black/18 px-4 py-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/78"
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-[inherit] border border-white/8 bg-black/18 px-5 py-5">
              <p className="section-label">Reporter’s note</p>
              <p className="mt-4 font-body text-[1.08rem] leading-relaxed text-white/74">
                This match is remembered for two things: Slytherin arriving on Nimbus 2001s, and a
                rogue Bludger turning a standard fixture into an endurance test for Gryffindor’s
                Seeker.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export default QuidditchDetailPage
