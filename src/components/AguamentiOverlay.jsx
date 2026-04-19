const WATER_BUBBLE_COUNT = 14

const bubbles = Array.from({ length: WATER_BUBBLE_COUNT }, (_, index) => ({
  id: `aguamenti-bubble-${index}`,
  left: `${8 + (index * 84) / (WATER_BUBBLE_COUNT - 1)}%`,
  size: `${0.6 + (index % 4) * 0.2}rem`,
  delay: `${(index % 7) * 240}ms`,
  duration: `${2200 + (index % 5) * 280}ms`,
  drift: `${((index % 5) - 2) * 10}px`,
}))

function AguamentiOverlay({ duration = 5000 }) {
  return (
    <div
      className="spell-aguamenti-overlay"
      style={{ '--spell-aguamenti-duration': `${duration}ms` }}
    >
      <div className="spell-aguamenti-fill">
        {bubbles.map((bubble) => (
          <span
            key={bubble.id}
            className="spell-aguamenti-bubble"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              '--spell-aguamenti-bubble-delay': bubble.delay,
              '--spell-aguamenti-bubble-duration': bubble.duration,
              '--spell-aguamenti-bubble-drift': bubble.drift,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default AguamentiOverlay
