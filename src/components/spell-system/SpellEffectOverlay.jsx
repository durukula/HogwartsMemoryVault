'use client'

const FIRE_PARTICLE_COUNT = 50
const FIRE_PARTICLE_SIZE_REM = 5
const FIRE_BASE_WIDTH_REM = 10
const FIRE_BASE_HEIGHT_REM = 12
const FIRE_RISE_DISTANCE_REM = 10

const fireParticles = Array.from({ length: FIRE_PARTICLE_COUNT }, (_, index) => ({
  id: `fire-particle-${index}`,
  delayMs: Math.round((index / FIRE_PARTICLE_COUNT) * 1000),
  driftX: ((index % 7) - 3) * 0.3,
  scale: 0.82 + (index % 5) * 0.08,
  left: `calc((100% - ${FIRE_PARTICLE_SIZE_REM}rem) * ${index / (FIRE_PARTICLE_COUNT - 1)})`,
}))

function FireEffect({ durationMs }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="relative flex h-64 w-64 items-center justify-center animate-[spell-effect-fade_var(--spell-duration)_ease-in-out_forwards]"
        style={{ '--spell-duration': `${durationMs}ms` }}
      >
        <div className="absolute inset-0 rounded-full bg-orange-500/18 blur-3xl" />
        <div className="absolute inset-x-12 bottom-9 h-12 rounded-full bg-orange-300/20 blur-2xl" />
        <div className="absolute inset-x-10 bottom-7 h-24 rounded-full bg-red-950/40 blur-2xl" />

        <div
          className="relative blur-[0.02em]"
          style={{
            fontSize: '24px',
            width: `${FIRE_BASE_WIDTH_REM}rem`,
            height: `${FIRE_BASE_HEIGHT_REM}rem`,
          }}
        >
          {fireParticles.map((particle) => (
            <span
              key={particle.id}
              className="absolute bottom-0 block rounded-full opacity-0 mix-blend-screen"
              style={{
                left: particle.left,
                width: `${FIRE_PARTICLE_SIZE_REM}rem`,
                height: `${FIRE_PARTICLE_SIZE_REM}rem`,
                backgroundImage:
                  'radial-gradient(rgb(255 80 0) 20%, rgba(255 80 0 / 0) 70%)',
                animationName: 'spell-fire-rise',
                animationDuration: '1s',
                animationTimingFunction: 'ease-in',
                animationIterationCount: 'infinite',
                animationDelay: `${particle.delayMs}ms`,
                '--spell-fire-drift-x': `${particle.driftX}rem`,
                '--spell-fire-scale': particle.scale,
                '--spell-fire-rise-distance': `-${FIRE_RISE_DISTANCE_REM}rem`,
              }}
            />
          ))}

          <div className="absolute inset-x-[28%] bottom-0 h-16 rounded-[50%] bg-gradient-to-t from-orange-950 via-orange-600 to-transparent opacity-90 blur-md" />
          <div className="absolute inset-x-[34%] bottom-2 h-12 rounded-[50%] bg-gradient-to-t from-orange-500 via-amber-300 to-transparent opacity-90 blur-sm" />
          <div className="absolute inset-x-[41%] bottom-4 h-8 rounded-[50%] bg-gradient-to-t from-yellow-300 via-yellow-100 to-transparent opacity-95 blur-[1px]" />
        </div>

        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-300/15 animate-[spell-ring-expand_var(--spell-duration)_ease-out_forwards]" />
      </div>
    </div>
  )
}

const effectRenderers = {
  fire: FireEffect,
}

function SpellEffectOverlay({ spell }) {
  if (!spell) {
    return null
  }

  const Effect = effectRenderers[spell.effect]

  if (!Effect) {
    return null
  }

  return (
    <>
      <Effect durationMs={spell.durationMs} />
      <style>
        {`
          @keyframes spell-effect-fade {
            0% { opacity: 0; transform: scale(0.88); }
            18% { opacity: 1; transform: scale(1); }
            82% { opacity: 1; transform: scale(1.04); }
            100% { opacity: 0; transform: scale(1.08); }
          }

          @keyframes spell-fire-rise {
            from {
              opacity: 0;
              transform: translate3d(0, 0, 0) scale(1);
            }

            25% {
              opacity: 1;
            }

            to {
              opacity: 0;
              transform:
                translate3d(var(--spell-fire-drift-x, 0rem), var(--spell-fire-rise-distance, -10rem), 0)
                scale(var(--spell-fire-scale, 0));
            }
          }

          @keyframes spell-ring-expand {
            0% { opacity: 0.35; transform: translate(-50%, -50%) scale(0.5); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
          }
        `}
      </style>
    </>
  )
}

export default SpellEffectOverlay
