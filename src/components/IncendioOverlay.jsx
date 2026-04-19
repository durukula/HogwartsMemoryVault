const FIRE_PARTICLE_COUNT = 36

const particles = Array.from({ length: FIRE_PARTICLE_COUNT }, (_, index) => ({
  id: `incendio-particle-${index}`,
  delayMs: Math.round((index / FIRE_PARTICLE_COUNT) * 1000),
  left: `${(index / (FIRE_PARTICLE_COUNT - 1)) * 100}%`,
  driftX: `${((index % 7) - 3) * 7}px`,
  scale: (0.75 + (index % 5) * 0.08).toFixed(2),
}))

function IncendioOverlay({ duration = 5000 }) {
  return (
    <div
      className="spell-incendio-overlay"
      style={{ '--spell-incendio-duration': `${duration}ms` }}
    >
      <div className="spell-incendio-core">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="spell-incendio-particle"
            style={{
              left: particle.left,
              '--spell-incendio-delay': `${particle.delayMs}ms`,
              '--spell-incendio-drift-x': particle.driftX,
              '--spell-incendio-scale': particle.scale,
            }}
          />
        ))}
        <span className="spell-incendio-flame spell-incendio-flame--outer" />
        <span className="spell-incendio-flame spell-incendio-flame--inner" />
        <span className="spell-incendio-flame spell-incendio-flame--core" />
      </div>
    </div>
  )
}

export default IncendioOverlay
