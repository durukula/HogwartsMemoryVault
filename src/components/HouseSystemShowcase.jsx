import { useState } from 'react'
import { designSystemText, getHouseGlassPanelClass, houseDesignSystems } from '../design-system/houseDesignSystems'

function HouseSystemShowcase({ house }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const system = houseDesignSystems[house.id] ?? houseDesignSystems.slytherin

  return (
    <>
      <section className={getHouseGlassPanelClass(house.id, 'p-6 sm:p-8')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">House UI System</p>
            <h2 className="mt-2 font-display text-3xl text-white sm:text-[2.7rem]">
              Reusable Tailwind Components
            </h2>
          </div>
          <p className="max-w-2xl font-body text-[1.08rem] leading-relaxed text-white/70 sm:text-[1.15rem]">
            {system.summary}
          </p>
        </div>

        <div className="mt-6">
          <div className={system.navbar}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className={designSystemText.eyebrow}>{house.name} Navbar</p>
                <p className="mt-2 font-display text-2xl text-white">{house.brand} Control Deck</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['Play', 'Lore', 'Vault'].map((item, index) => (
                  <button
                    key={item}
                    className={index === 0 ? system.navItemActive : system.navItem}
                  >
                    {item}
                  </button>
                ))}
                <span className={system.navbarBadge}>{house.trait} mode</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <article className={system.card}>
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={designSystemText.eyebrow}>Card</p>
                    <h3 className="mt-2 font-display text-[2rem] text-white">Mode Preview Surface</h3>
                  </div>
                  <span className={system.cardBadge}>{house.name} identity</span>
                </div>

                <p className={designSystemText.body}>
                  This card is not just recolored. Its radius, border weight, depth model, hover
                  energy, and overlay language all shift to match the house personality.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Button', 'Tailwind class group'],
                    ['Input', 'Focused interaction'],
                    ['Modal', 'House-specific presence'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                      <p className={designSystemText.eyebrow}>{label}</p>
                      <p className="mt-3 font-display text-[1.2rem] text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <button className={system.buttonPrimary}>Primary Button</button>
              <button className={system.buttonSecondary}>Secondary Button</button>
            </div>
          </div>

          <div className="space-y-5">
            <div className={system.inputShell}>
              <div className="relative z-10">
                <label className={system.inputLabel} htmlFor="house-ui-input">
                  Input
                </label>
                <input
                  id="house-ui-input"
                  className={system.input}
                  defaultValue={`${house.name} word forge`}
                />
                <p className={system.inputHint}>
                  Focus states, padding rhythm, border softness, and field silhouette change with
                  the house emotion.
                </p>
              </div>
            </div>

            <div className={system.card}>
              <div className="relative z-10">
                <p className={designSystemText.eyebrow}>Modal</p>
                <h3 className="mt-2 font-display text-[1.9rem] text-white">House-Specific Dialog</h3>
                <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/70">
                  Open the modal preview to see how each house handles overlay density, panel mass,
                  and emotional tone.
                </p>

                <div className="mt-5">
                  <button className={system.buttonPrimary} onClick={() => setIsModalOpen(true)}>
                    Open Modal Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className={system.modalOverlay}>
          <div className={system.modalPanel}>
            <button className={system.modalClose} onClick={() => setIsModalOpen(false)}>
              Close
            </button>

            <div className="relative z-10">
              <span className={system.modalBadge}>{house.name} modal</span>
              <h3 className="mt-4 font-display text-[2.2rem] text-white sm:text-[2.6rem]">
                Distinct Personality Layer
              </h3>
              <p className="mt-4 font-body text-[1.08rem] leading-relaxed text-white/76 sm:text-[1.16rem]">
                This dialog keeps the same structure, but its border treatment, surface weight,
                spatial softness, and interaction attitude are rebuilt for {house.name}.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  'Shape language',
                  'Motion attitude',
                  'Depth philosophy',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                  >
                    <p className={designSystemText.eyebrow}>{item}</p>
                    <p className="mt-3 min-h-[2.5rem] break-words font-display text-[clamp(0.98rem,1.8vw,1.1rem)] leading-tight text-white">
                      {house.trait}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className={system.buttonPrimary}>Confirm Style</button>
                <button className={system.buttonSecondary} onClick={() => setIsModalOpen(false)}>
                  Keep Exploring
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default HouseSystemShowcase
