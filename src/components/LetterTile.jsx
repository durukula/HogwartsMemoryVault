import { tileTones } from './ui'

function LetterTile({ letter, tone, compact = false }) {
  return (
    <div className={`letter-tile ${compact ? 'letter-mini' : ''} ${tileTones[tone]}`}>
      {letter}
    </div>
  )
}

export default LetterTile
