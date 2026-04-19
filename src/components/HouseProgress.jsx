import { getHouseAccentPillClass, getHouseGlassPanelClass } from '../design-system/houseDesignSystems'

function getProgressPanelOverlay(houseId) {
  switch (houseId) {
    case 'gryffindor':
      return {
        className: 'absolute inset-x-[1rem] top-[1rem] h-[6px] pointer-events-none',
        style: {
          background: 'linear-gradient(90deg, transparent, rgba(255, 216, 166, 0.85), transparent)',
        },
      }
    case 'ravenclaw':
      return {
        className: 'absolute inset-[1rem] rounded-[0.9rem] pointer-events-none opacity-[0.26]',
        style: {
          backgroundImage:
            'linear-gradient(rgba(177, 214, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(177, 214, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        },
      }
    case 'hufflepuff':
      return {
        className: 'absolute inset-[1rem] rounded-[1.8rem] pointer-events-none opacity-[0.46]',
        style: {
          background:
            'radial-gradient(circle at 16% 24%, rgba(255, 245, 214, 0.08), transparent 24%), radial-gradient(circle at 82% 78%, rgba(255, 214, 105, 0.08), transparent 22%)',
        },
      }
    default:
      return {
        className: 'absolute inset-[1rem] rounded-[calc(2rem-0.9rem)] border border-white/[0.04] pointer-events-none opacity-[0.34]',
        style: {
          background:
            'radial-gradient(circle at 84% 20%, rgba(148, 248, 197, 0.1), transparent 18%), linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 34%)',
        },
      }
  }
}

function getProgressShapeConfig(houseId, cap) {
  const capConfigs = {
    serpent: {
      clipPath: 'polygon(0 10%, 70% 0, 100% 50%, 70% 100%, 0 90%, 18% 50%)',
      tailClipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
      tailInsets: { left: '68%', top: '40%', right: '-10%', bottom: '40%' },
    },
    lion: {
      clipPath:
        'polygon(8% 24%, 30% 2%, 52% 18%, 72% 0, 100% 24%, 100% 76%, 70% 100%, 28% 92%, 0 68%, 0 38%)',
      tailClipPath: 'polygon(0 50%, 100% 12%, 80% 50%, 100% 88%)',
      tailInsets: { left: '78%', top: '18%', right: '-14%', bottom: '18%' },
    },
    raven: {
      clipPath:
        'polygon(0 26%, 58% 0, 100% 42%, 76% 54%, 100% 68%, 56% 100%, 10% 82%, 0 54%)',
      tailClipPath: 'polygon(0 50%, 100% 0, 76% 50%, 100% 100%)',
      tailInsets: { left: '72%', top: '28%', right: '-12%', bottom: '28%' },
    },
    badger: {
      clipPath: 'polygon(0 22%, 28% 0, 72% 0, 100% 22%, 100% 74%, 72% 100%, 28% 100%, 0 74%)',
      tailClipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
      tailInsets: { left: '36%', top: '30%', right: '36%', bottom: '0' },
    },
  }

  const shape = capConfigs[cap] ?? capConfigs.serpent

  switch (houseId) {
    case 'gryffindor':
      return {
        panelRadius: 'rounded-[1.15rem]',
        chargeClass: 'px-4 py-2 rounded-none [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]',
        shellClass: 'rounded-[1rem] p-[0.7rem]',
        trackClass: 'h-[2.55rem] rounded-[0.7rem]',
        trackStyle: {
          background:
            'linear-gradient(90deg, rgba(255, 228, 198, 0.08), rgba(255, 195, 132, 0.18) 42%, rgba(255, 228, 198, 0.08))',
        },
        fillClass: 'rounded-[0.55rem] [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]',
        markerClass: 'justify-between tracking-[0.28em]',
        capStyle: shape,
      }
    case 'ravenclaw':
      return {
        panelRadius: 'rounded-[1rem]',
        chargeClass: 'px-4 py-2 rounded-[1rem_0.35rem_1rem_0.35rem]',
        shellClass: 'rounded-[1rem] p-[0.75rem]',
        trackClass: 'h-[2.9rem] rounded-[0.7rem]',
        trackStyle: {
          background:
            'linear-gradient(90deg, rgba(192, 223, 255, 0.08), rgba(114, 173, 255, 0.14) 44%, rgba(245, 223, 187, 0.08))',
        },
        fillClass: 'rounded-[0.55rem] [clip-path:polygon(0_0,100%_0,100%_74%,92%_100%,0_100%)]',
        markerClass: 'justify-start gap-x-[1.6rem] gap-y-3',
        stripeStyle: {
          background:
            'repeating-linear-gradient(90deg, rgba(12, 35, 65, 0.54) 0 14px, rgba(239, 215, 178, 0.14) 14px 16px, rgba(12, 35, 65, 0.54) 16px 28px)',
        },
        capStyle: shape,
      }
    case 'hufflepuff':
      return {
        panelRadius: 'rounded-[2.2rem]',
        chargeClass: 'px-4 py-2 rounded-full',
        shellClass: 'rounded-[2rem] p-[1rem]',
        trackClass: 'h-[3.05rem] rounded-[1.65rem]',
        fillClass: 'rounded-[1.5rem]',
        fillGlossInsets: 'inset-[6px_18px_7px_12px]',
        markerClass: 'justify-center gap-x-[1.1rem] gap-y-[0.6rem]',
        capStyle: shape,
      }
    default:
      return {
        panelRadius: 'rounded-[2rem]',
        chargeClass: 'px-4 py-2 rounded-full',
        shellClass: 'rounded-full p-[0.9rem]',
        trackClass: 'h-[2.9rem] rounded-full',
        fillClass: 'rounded-full',
        markerClass: 'justify-between',
        capStyle: shape,
      }
  }
}

function HouseProgress({ house, charge, mantra }) {
  const overlay = getProgressPanelOverlay(house.id)
  const shape = getProgressShapeConfig(house.id, house.progress.cap)

  return (
    <div className={getHouseGlassPanelClass(house.id, 'p-5 sm:p-6', shape.panelRadius)}>
      <div className={overlay.className} style={overlay.style} />

      <div className="relative z-10 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">{house.progress.label}</p>
          <h2 className="mt-2 font-display text-3xl text-white sm:text-[2.4rem]">
            {house.progress.title}
          </h2>
        </div>

        <div
          className={getHouseAccentPillClass(
            house.id,
            'ui-nowrap font-ui text-[0.7rem] tracking-[0.12em]',
            shape.chargeClass,
          )}
        >
          {charge}% {house.progress.suffix}
        </div>
      </div>

      <div
        className={`relative border border-[var(--panel-border)] bg-black/22 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.34),0_18px_40px_rgba(0,0,0,0.28)] ${shape.shellClass}`}
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)), rgba(0, 0, 0, 0.22)',
        }}
      >
        <div
          className={`relative overflow-visible ${shape.trackClass}`}
          style={{
            background:
              shape.trackStyle?.background ??
              'linear-gradient(90deg, rgba(217, 232, 223, 0.08), rgba(255, 255, 255, 0.12) 40%, rgba(217, 232, 223, 0.08))',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.48)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-5 font-ui text-[0.56rem] uppercase tracking-[0.32em] text-[rgba(242,255,249,0.24)]">
            {house.progress.runes.map((rune) => (
              <span key={rune}>{rune}</span>
            ))}
          </div>

          <div
            className={`relative h-full min-w-[3.4rem] ${shape.fillClass}`}
            style={{
              width: `${charge}%`,
              background: 'var(--progress-gradient)',
              boxShadow: '0 0 36px var(--accent-glow-strong), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
            }}
          >
            <div
              className={`absolute inset-0 ${shape.fillClass} mix-blend-soft-light`}
              style={{
                background:
                  shape.stripeStyle?.background ??
                  'repeating-linear-gradient(120deg, var(--progress-stripe-dark) 0 13px, var(--progress-stripe-light) 13px 15px, var(--progress-stripe-dark) 15px 28px)',
              }}
            />

            <div
              className={`absolute rounded-full opacity-45 ${shape.fillGlossInsets ?? 'inset-[5px_22px_5px_10px]'}`}
              style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.52), transparent 48%)' }}
            />

            <div
              className="absolute top-1/2 h-[2.65rem] w-[3.5rem] -translate-y-1/2 max-sm:h-[2.1rem] max-sm:w-[2.9rem] max-sm:right-[-1.25rem] right-[-1.55rem]"
              style={{
                background: 'var(--cap-gradient)',
                boxShadow: '0 0 30px var(--accent-glow-strong), inset 0 1px 0 rgba(255, 255, 255, 0.58)',
                clipPath: shape.capStyle.clipPath,
              }}
            >
              <div
                className="absolute"
                style={{
                  left: shape.capStyle.tailInsets.left,
                  top: shape.capStyle.tailInsets.top,
                  right: shape.capStyle.tailInsets.right,
                  bottom: shape.capStyle.tailInsets.bottom,
                  background: 'var(--cap-tail)',
                  filter: 'drop-shadow(0 0 10px var(--accent-glow))',
                  clipPath: shape.capStyle.tailClipPath,
                }}
              />

              <span className="absolute left-[1.08rem] top-[34%] h-[0.38rem] w-[0.38rem] animate-[blink_7s_ease-in-out_infinite] rounded-full bg-[#06110a] shadow-[0_0_0_2px_rgba(216,248,228,0.35)] max-sm:left-[0.86rem]" />
              <span className="absolute left-[1.58rem] top-[34%] h-[0.38rem] w-[0.38rem] animate-[blink_7s_ease-in-out_infinite] rounded-full bg-[#06110a] shadow-[0_0_0_2px_rgba(216,248,228,0.35)] max-sm:left-[1.28rem]" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 flex flex-wrap items-center gap-3 font-ui text-[0.68rem] tracking-[0.12em] text-white/40 ${shape.markerClass}`}
      >
        {house.progress.runes.map((marker) => (
          <span key={marker}>{marker}</span>
        ))}
      </div>

      <p className="mt-4 max-w-3xl font-body text-[1.2rem] leading-relaxed text-slate-200/85 sm:text-[1.35rem]">
        {mantra}
      </p>
    </div>
  )
}

export default HouseProgress
