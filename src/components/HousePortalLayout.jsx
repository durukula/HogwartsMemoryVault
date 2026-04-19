import { useEffect, useRef, useState } from 'react'
import { houseDesignSystems } from '../design-system/houseDesignSystems'

const ROUND_DURATION_SECONDS = 60
const SKIP_PENALTY_SECONDS = 5
const ROUND_PORTRAIT_COUNT = 18

const gameCopy = {
  slytherin: {
    badge: 'Portrait Vault',
    title: 'All Houses, One Cold-Blooded Memory Test',
    body:
      'This round draws from portraits across the wider Hogwarts world. The challenge stays the same; only the mood changes with the house.',
  },
  gryffindor: {
    badge: 'Honor Trial',
    title: 'All Houses, One Bold Guessing Round',
    body:
      'Portraits from across the saga are folded into one quick guessing round, with the same challenge told in a bolder voice.',
  },
  ravenclaw: {
    badge: 'Archive Drill',
    title: 'All Houses, One Shared Portrait Archive',
    body:
      'The archive mixes familiar faces from every corner of Hogwarts and beyond, while Ravenclaw keeps the presentation cool and precise.',
  },
  hufflepuff: {
    badge: 'Common Room Challenge',
    title: 'All Houses, One Friendly Memory Sprint',
    body:
      'Every round blends portraits from the full Hogwarts world, but Hufflepuff turns the challenge warmer and more welcoming.',
  },
}

function normalizeAnswer(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function shuffleArray(items) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

function buildRoundCharacters(pool, previousIds = []) {
  if (!pool.length) {
    return []
  }

  const maxCount = Math.min(ROUND_PORTRAIT_COUNT, pool.length)
  const previousSignature = previousIds.join('|')
  let nextRound = shuffleArray(pool).slice(0, maxCount)
  let attempts = 0

  while (pool.length > 1 && nextRound.map((item) => item.id).join('|') === previousSignature && attempts < 5) {
    nextRound = shuffleArray(pool).slice(0, maxCount)
    attempts += 1
  }

  return nextRound
}

function isFuzzyMatch(submitted, target, maxDistance = 2) {
  if (submitted === target) {
    return true
  }

  const submittedLength = submitted.length
  const targetLength = target.length

  if (Math.abs(submittedLength - targetLength) > maxDistance) {
    return false
  }

  if (!submittedLength || !targetLength) {
    return false
  }

  const previousRow = new Array(targetLength + 1)
  const currentRow = new Array(targetLength + 1)
  const previousPreviousRow = new Array(targetLength + 1)

  for (let column = 0; column <= targetLength; column += 1) {
    previousRow[column] = column
  }

  for (let row = 1; row <= submittedLength; row += 1) {
    currentRow[0] = row
    let rowBest = currentRow[0]

    for (let column = 1; column <= targetLength; column += 1) {
      const cost = submitted[row - 1] === target[column - 1] ? 0 : 1

      const deletion = previousRow[column] + 1
      const insertion = currentRow[column - 1] + 1
      const substitution = previousRow[column - 1] + cost

      let distance = Math.min(deletion, insertion, substitution)

      if (
        row > 1 &&
        column > 1 &&
        submitted[row - 1] === target[column - 2] &&
        submitted[row - 2] === target[column - 1]
      ) {
        distance = Math.min(distance, previousPreviousRow[column - 2] + cost)
      }

      currentRow[column] = distance
      rowBest = Math.min(rowBest, distance)
    }

    if (rowBest > maxDistance) {
      return false
    }

    for (let column = 0; column <= targetLength; column += 1) {
      previousPreviousRow[column] = previousRow[column]
      previousRow[column] = currentRow[column]
    }
  }

  return previousRow[targetLength] <= maxDistance
}

function formatTime(value) {
  const minutes = Math.floor(value / 60)
  const seconds = value % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function toCharacterPool(items) {
  const seenNames = new Set()

  return items
    .filter((item) => item?.name?.trim() && item?.image?.trim())
    .filter((item) => {
      const key = normalizeAnswer(item.name)

      if (seenNames.has(key)) {
        return false
      }

      seenNames.add(key)
      return true
    })
    .map((item) => ({
      id: item.id ?? item.name,
      image: item.image.trim(),
      name: item.name.trim(),
      house: item.house?.trim() || 'No listed house',
      species: item.species?.trim() || 'Wizarding world',
      ancestry: item.ancestry?.trim() || 'Unknown ancestry',
    }))
}

function createFeedback(type, text) {
  return { type, text }
}

function HousePortalLayout({ house }) {
  const system = houseDesignSystems[house.id] ?? houseDesignSystems.slytherin
  const copy = gameCopy[house.id] ?? gameCopy.slytherin
  const inputRef = useRef(null)
  const scoreRef = useRef(0)
  const previousRoundIdsRef = useRef([])
  const [availableCharacters, setAvailableCharacters] = useState([])
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [reloadNonce, setReloadNonce] = useState(0)
  const [status, setStatus] = useState('idle')
  const [guess, setGuess] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SECONDS)
  const [guessedNames, setGuessedNames] = useState([])
  const [feedback, setFeedback] = useState(
    createFeedback('info', 'Start Game reveals the first portrait. Wrong guesses keep the same face on screen.'),
  )

  const currentCharacter = status === 'playing' ? characters[currentIndex] ?? null : null
  const visibleCharacter = currentCharacter
  const solvedRatio = characters.length ? (score / characters.length) * 100 : 0
  const timerRatio = (timeLeft / ROUND_DURATION_SECONDS) * 100
  const timeSpent = ROUND_DURATION_SECONDS - timeLeft
  const accuracyRatio = characters.length ? Math.round((score / characters.length) * 100) : 0

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    const controller = new AbortController()

    function resetRound(nextCharacters, nextFeedback) {
      setCharacters(nextCharacters)
      setStatus('idle')
      setGuess('')
      setCurrentIndex(0)
      setScore(0)
      scoreRef.current = 0
      setTimeLeft(ROUND_DURATION_SECONDS)
      setGuessedNames([])
      setFeedback(createFeedback('info', nextFeedback))
    }

    async function loadCharacters() {
      setIsLoading(true)
      setFetchError('')
      setAvailableCharacters([])
      previousRoundIdsRef.current = []
      resetRound(
        [],
        'Start Game reveals the first portrait. Wrong guesses keep the same face on screen.',
      )

      try {
        const response = await fetch('https://hp-api.onrender.com/api/characters', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HP API returned ${response.status}`)
        }

        const data = await response.json()
        const nextPool = toCharacterPool(data)
        const nextCharacters = buildRoundCharacters(nextPool, previousRoundIdsRef.current)

        if (!nextCharacters.length) {
          setFetchError('No usable portraits were found for this round.')
        }

        setAvailableCharacters(nextPool)
        previousRoundIdsRef.current = nextCharacters.map((character) => character.id)
        resetRound(
          nextCharacters,
          'A fresh randomized portrait round is ready. Press Start Game to reveal the first face.',
        )
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setFetchError('Portraits could not be loaded right now. Please try again.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCharacters()

    return () => {
      controller.abort()
    }
  }, [reloadNonce])

  useEffect(() => {
    if (status !== 'playing') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [status])

  useEffect(() => {
    if (status === 'playing' && timeLeft === 0) {
      setStatus('finished')
      setFeedback(
        createFeedback(
          'success',
          `Time is up. Final score: ${scoreRef.current} correct character${scoreRef.current === 1 ? '' : 's'}.`,
        ),
      )
    }
  }, [status, timeLeft])

  useEffect(() => {
    if (status === 'playing') {
      inputRef.current?.focus()
    }
  }, [currentIndex, status])

  function handleStart() {
    const sourcePool = availableCharacters.length ? availableCharacters : characters

    if (!sourcePool.length) {
      return
    }

    const nextCharacters = buildRoundCharacters(sourcePool, previousRoundIdsRef.current)
    previousRoundIdsRef.current = nextCharacters.map((character) => character.id)
    setCharacters(nextCharacters)
    setStatus('playing')
    setGuess('')
    setCurrentIndex(0)
    setScore(0)
    scoreRef.current = 0
    setTimeLeft(ROUND_DURATION_SECONDS)
    setGuessedNames([])
    setFeedback(
      createFeedback(
        'info',
        'Round started. Type the full character name (or just the first name / last name). Uppercase and lowercase do not matter.',
      ),
    )
  }

  function finishRound(message) {
    setStatus('finished')
    setFeedback(createFeedback('success', message))
  }

  function handleCorrectAnswer(characterName, acceptedGuess) {
    const nextScore = score + 1
    const nextIndex = currentIndex + 1

    setScore(nextScore)
    scoreRef.current = nextScore
    setGuess('')
    setGuessedNames((previous) => [...previous, characterName])

    if (nextIndex >= characters.length) {
      finishRound(`You cleared every available portrait and finished with ${nextScore} correct answers.`)
      return
    }

    setCurrentIndex(nextIndex)
    setFeedback(
      createFeedback(
        'success',
        acceptedGuess
          ? `"${acceptedGuess}" accepted as ${characterName}. Next portrait loaded.`
          : `${characterName} is correct. Next portrait loaded.`,
      ),
    )
  }

  function submitGuess() {
    if (status !== 'playing' || !currentCharacter) {
      return
    }

    const submittedAnswer = normalizeAnswer(guess)
    const correctAnswer = normalizeAnswer(currentCharacter.name)
    const correctParts = correctAnswer.split(' ').filter(Boolean)
    const firstName = correctParts[0] ?? ''
    const lastName = correctParts[correctParts.length - 1] ?? ''
    // Accept full name, first name only, or last name only to make the game feel fair on quick inputs.
    const acceptedAnswers = Array.from(new Set([correctAnswer, firstName, lastName].filter(Boolean)))

    if (!submittedAnswer) {
      setFeedback(createFeedback('error', 'Please type the character name before submitting.'))
      return
    }

    const directHit = acceptedAnswers.some((candidate) => submittedAnswer === candidate)

    if (!directHit) {
      const fuzzyHit = acceptedAnswers.some((candidate) =>
        isFuzzyMatch(submittedAnswer, candidate, candidate.length <= 5 ? 1 : 2),
      )

      if (fuzzyHit) {
        handleCorrectAnswer(currentCharacter.name, guess.trim())
        return
      }

      setFeedback(createFeedback('error', 'Wrong name. The same portrait stays on screen until you solve it or skip it.'))
      return
    }

    handleCorrectAnswer(currentCharacter.name, guess.trim())
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitGuess()
  }

  function handleSkip() {
    if (status !== 'playing' || !currentCharacter) {
      return
    }

    const nextIndex = currentIndex + 1

    setGuess('')
    setTimeLeft((previous) => Math.max(previous - SKIP_PENALTY_SECONDS, 0))

    if (nextIndex >= characters.length) {
      finishRound(`No portraits remain. Final score: ${scoreRef.current} correct answers.`)
      return
    }

    setCurrentIndex(nextIndex)
    setFeedback(
      createFeedback(
        'warning',
        `${currentCharacter.name} was skipped. ${SKIP_PENALTY_SECONDS} seconds were removed from the clock.`,
      ),
    )
  }

  return (
    <div className="house-layout-shell house-game-shell">
      <section className="house-game-unified-grid" data-tutorial-focus-id="game-overview">
        <article className={`${system.card} house-game-hero-card`}>
          <div className="relative z-10 flex h-full flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-label">Character Guess Game</p>
                <h1 className="mt-2 font-display text-3xl text-white sm:text-[2.7rem]">{copy.title}</h1>
              </div>

              <span className={system.cardBadge}>{copy.badge}</span>
            </div>

            <p className="max-w-4xl font-body text-[1.1rem] leading-relaxed text-white/76 sm:text-[1.2rem]">
              {copy.body}
            </p>

            <div className="house-game-hero-chips">
              {[
                'Enchanted portrait chamber',
                'Cross-house character pool',
                '60-second magical sprint',
              ].map((item) => (
                <span key={item} className="house-game-hero-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="house-game-board-grid" data-tutorial-focus-id="game-board">
        <article className={`${system.card} house-game-stage-card house-game-stage-card--featured`}>
          <div className="relative z-10 flex h-full flex-col gap-6">
            <div className="house-game-stage-top">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-label">Active Portrait</p>
                  <h2 className="mt-2 font-display text-3xl text-white sm:text-[2.6rem]">
                    {status === 'playing'
                      ? `Portrait ${currentIndex + 1}`
                      : status === 'finished'
                        ? 'Round Complete'
                        : 'Awaiting Start'}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <span className={system.navbarBadge}>{status}</span>
                  <button
                    className={`${system.buttonPrimary} house-game-start-button`}
                    data-tutorial-focus-id="game-start"
                    disabled={isLoading || Boolean(fetchError) || !characters.length}
                    onClick={handleStart}
                    type="button"
                  >
                    {status === 'playing' ? 'Restart Game' : 'Start Game'}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                  <p className="section-label">Theme</p>
                  <p className="mt-3 font-display text-[1.25rem] text-white">{house.name}</p>
                </div>
                <div className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                  <p className="section-label">Portrait Pool</p>
                  <p className="mt-3 font-display text-[1.25rem] text-white">
                    {isLoading ? 'Loading...' : `${characters.length} random`}
                  </p>
                </div>
                <div
                  className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                  data-tutorial-focus-id="game-timer"
                >
                  <p className="section-label">Timer</p>
                  <p className="mt-3 font-display text-[1.25rem] text-white">{formatTime(timeLeft)}</p>
                </div>
                <div className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                  <p className="section-label">Score</p>
                  <p className="mt-3 font-display text-[1.25rem] text-white">{score}</p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="section-label">Countdown</span>
                    <span className={system.navbarBadge}>{formatTime(timeLeft)}</span>
                  </div>
                  <div className="house-game-progress-track mt-3">
                    <span className="house-game-progress-fill" style={{ width: `${timerRatio}%` }}></span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="section-label">Solved</span>
                    <span className="ui-nowrap font-ui text-sm tracking-[0.12em] text-white/68">
                      {score}/{characters.length}
                    </span>
                  </div>
                  <div className="house-game-progress-track mt-3">
                    <span className="house-game-progress-fill" style={{ width: `${solvedRatio}%` }}></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="house-game-stage-main">
              <div className="house-character-frame">
                {isLoading ? (
                  <div className="house-character-empty">
                    <p className="font-display text-2xl text-white">Summoning portraits...</p>
                  </div>
                ) : status === 'finished' ? (
                  <div className="house-game-finish-stage">
                    <div className="house-game-finish-orb"></div>
                    <p className="section-label">Final Score</p>
                    <p className="house-game-finish-score">{score}</p>
                    <p className="house-game-finish-copy">
                      The chamber has gone still. Your final tally is locked for this round.
                    </p>

                    <div className="house-game-finish-grid">
                      {[
                        ['Solved', `${score}/${characters.length}`],
                        ['Accuracy', `${accuracyRatio}%`],
                        ['Time Used', formatTime(timeSpent)],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                        >
                          <p className="section-label">{label}</p>
                          <p className="mt-3 font-display text-[1.25rem] text-white">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="house-game-finish-actions">
                      <button
                        className={system.buttonPrimary}
                        disabled={isLoading || Boolean(fetchError) || !characters.length}
                        onClick={handleStart}
                        type="button"
                      >
                        Start Game
                      </button>
                      <button
                        className={system.buttonSecondary}
                        disabled={isLoading}
                        onClick={() => setReloadNonce((value) => value + 1)}
                        type="button"
                      >
                        Reload Portraits
                      </button>
                    </div>
                  </div>
                ) : visibleCharacter ? (
                  <div className="house-character-stage">
                    <img
                      className="house-character-image"
                      src={visibleCharacter.image}
                      alt={visibleCharacter.name}
                    />
                    <div className="house-character-caption">
                      <span className="section-label">Current Subject</span>
                      <p className="mt-2 font-display text-[1.18rem] text-white/88">Identify the witch or wizard before the clock burns out.</p>
                    </div>
                  </div>
                ) : (
                  <div className="house-character-empty">
                    <div className="house-game-empty-stack">
                      <p className="font-display text-2xl text-white">
                        Start Game to reveal the first enchanted portrait.
                      </p>
                      <p className="mt-4 font-body text-[1.02rem] leading-relaxed text-white/68">
                        The frame stays hidden until the round begins. Once active, every correct guess opens the next portrait.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="house-game-play-panel">
                <form className={system.inputShell} onSubmit={handleSubmit}>
                  <div className="relative z-10">
                    <label className={system.inputLabel} htmlFor="character-guess">
                      Character full name
                    </label>
                    <input
                      ref={inputRef}
                      id="character-guess"
                      className={system.input}
                      disabled={status !== 'playing'}
                      onChange={(event) => setGuess(event.target.value)}
                      placeholder={status === 'playing' ? 'Example: Harry Potter' : 'Start Game to enable input'}
                      spellCheck="false"
                      type="text"
                      value={guess}
                    />
                  </div>
                </form>

                <div className="flex flex-wrap gap-3">
                  <button
                    className={system.buttonPrimary}
                    disabled={status !== 'playing'}
                    onClick={submitGuess}
                    type="button"
                  >
                    Submit Guess
                  </button>
                  <button
                    className={system.buttonSecondary}
                    disabled={status !== 'playing'}
                    onClick={handleSkip}
                    type="button"
                  >
                    Skip Portrait (-5 sec)
                  </button>
                  <button
                    className={system.buttonSecondary}
                    disabled={isLoading}
                    onClick={() => setReloadNonce((value) => value + 1)}
                    type="button"
                  >
                    Reload Portraits
                  </button>
                </div>

                <div
                  className={`house-game-message house-game-message--${feedback.type} rounded-[inherit] border px-4 py-4`}
                  role="status"
                >
                  <p className="section-label">Game Feed</p>
                  <p className="mt-3 font-body text-[1.05rem] leading-relaxed text-white/82">
                    {fetchError || feedback.text}
                  </p>
                </div>

                <div className="house-game-spell-note rounded-[inherit] border border-white/8 bg-black/12 px-4 py-4">
                  <p className="section-label">Chamber Rules</p>
                  <p className="mt-3 font-body text-[1rem] leading-relaxed text-white/70">
                    Full name, first name, or last name are all accepted. Close spellings are also
                    tolerated so the round feels magical, not punishing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

      </section>

      <section className="house-game-support-grid">
        <article className={`${system.card} house-game-control-card`}>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Round Setup</p>
                <h3 className="mt-2 font-display text-[2rem] text-white">Challenge Overview</h3>
              </div>
              <span className={system.navbarBadge}>{house.name} mode</span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                <p className="section-label">Portrait Pool</p>
                <p className="mt-3 font-display text-[1.2rem] text-white">
                  {isLoading ? 'Loading...' : `${characters.length} random`}
                </p>
              </div>
              <div className="house-game-stat-tile rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                <p className="section-label">House Theme</p>
                <p className="mt-3 font-display text-[1.2rem] text-white">{house.name}</p>
              </div>
            </div>
          </div>
        </article>

        <div className="house-game-sidebar">
          <article className={`${system.card} house-game-rules-card`}>
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">Rules</p>
                  <h3 className="mt-2 font-display text-[2rem] text-white">How This Round Works</h3>
                </div>
                <span className={system.navbarBadge}>60 sec total</span>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  'Every portrait in the round comes from the wider Hogwarts cast.',
                  'House switching changes the mood of play, not the portraits in the round.',
                  'Wrong guesses trigger a warning and keep the same portrait.',
                  `Skip is available and removes ${SKIP_PENALTY_SECONDS} seconds from the timer.`,
                ].map((rule) => (
                  <div
                    key={rule}
                    className="house-game-rule rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                  >
                    <p className="font-body text-[1.04rem] leading-relaxed text-white/78">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
        
        <article className={`${system.card} house-game-results-card`}>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Round Ledger</p>
                <h3 className="mt-2 font-display text-[2rem] text-white">
                  {status === 'finished' ? 'Final Score' : 'Correct Names'}
                </h3>
              </div>
              <span className={system.navbarBadge}>{score} correct</span>
            </div>

            <div className="mt-5 rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
              <p className="section-label">Score Summary</p>
              <p className="mt-3 font-display text-[2.2rem] text-white">{score}</p>
              <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/66">
                {status === 'finished'
                  ? 'The central chamber now shows the final score while the portraits withdraw from view.'
                  : 'The final score appears here the moment the round ends.'}
              </p>
            </div>

            {status === 'playing' && visibleCharacter ? (
              <div className="mt-5 rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4">
                <p className="section-label">Portrait Metadata</p>
                <p className="mt-3 font-display text-[1.16rem] text-white">
                  {visibleCharacter.house}
                </p>
                <p className="mt-2 font-body text-[1rem] leading-relaxed text-white/62">
                  {visibleCharacter.species} · {visibleCharacter.ancestry}
                </p>
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {guessedNames.length ? (
                guessedNames.map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className="house-game-result-row rounded-[inherit] border border-white/8 bg-black/18 px-4 py-4"
                  >
                    <p className="section-label">Correct {String(index + 1).padStart(2, '0')}</p>
                    <p className="mt-2 font-display text-[1.1rem] text-white">{name}</p>
                  </div>
                ))
              ) : (
                <div className="house-game-result-row rounded-[inherit] border border-dashed border-white/12 bg-black/12 px-4 py-5">
                  <p className="font-body text-[1.04rem] leading-relaxed text-white/62">
                    No correct names yet. When the round ends, the central chamber switches to the final score reveal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export default HousePortalLayout
