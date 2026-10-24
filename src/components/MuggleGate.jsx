import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import flyingCarImage from '../assets/flying-car.png'
import { clearObliviateLock, hasObliviateLock } from '../utils/portalAccess'

const WAND_IMAGE_SRC = '/wand.png'
const WAND_SIZE = { width: 244, height: 84 }
const MUGGLE_HOME_PATH = '/'

const muggleRoutes = {
  '/muggle/late-edition': {
    title: 'Late Edition',
    subtitle: 'Special updates filed after several people had already put the kettle on.',
    sections: [
      {
        heading: 'Breaking Administrative Momentum',
        paragraphs: [
          'Residents on Willow Lane have confirmed that the recycling bin on number 12 has now been turned back to its original angle after an intense but respectful exchange of opinion over the fence.',
          'Observers say the reversal restores order while also raising new questions about whether the previous adjustment should have been documented in writing.',
        ],
      },
      {
        heading: 'Stationery Watch',
        paragraphs: [
          'The post office has quietly introduced a second blue pen at the front desk, creating what experts have called "more choice than the average Wednesday can reasonably absorb."',
          'One customer described the moment as "surprisingly efficient, though emotionally difficult to classify."',
        ],
      },
    ],
  },
  '/muggle/city-desk': {
    title: 'City Desk',
    subtitle: 'A civic summary of buses, pavements, and deeply moderate concern.',
    sections: [
      {
        heading: 'Public Transport',
        paragraphs: [
          'The 8:05 bus arrived at 8:06 this morning, restoring emotional balance to regular passengers who felt yesterday\'s punctuality had set an unrealistic tone for the rest of the week.',
          'A spokesperson for the transit office said the service remains "broadly bus-shaped and largely where people expect it to be."',
        ],
      },
      {
        heading: 'Town Centre',
        paragraphs: [
          'Council workers have repainted a bench near the chemist, and at least four residents have already admired it from a practical distance.',
          'The new paint is expected to dry by evening unless looked at too intensely.',
        ],
      },
    ],
  },
  '/muggle/classifieds': {
    title: 'Classifieds',
    classifiedOnly: true,
  },
  '/muggle/weather': {
    title: 'Weather',
    subtitle: 'A forecast for people who know weather will happen whether invited or not.',
    sections: [
      {
        heading: 'Today',
        paragraphs: [
          'Morning begins with a firm grey sky, followed by a period of hesitant brightness around noon that may briefly encourage overconfidence in outerwear decisions.',
          'By afternoon a light breeze will move through town with the specific purpose of making everyone feel slightly incorrect about their jacket.',
        ],
      },
      {
        heading: 'Tomorrow',
        paragraphs: [
          'Clouds are expected to continue attending in large numbers, with possible appearances from sunlight between meetings.',
          'Rain remains a distant possibility and will, as usual, wait until the one moment nobody can go back inside.',
        ],
      },
    ],
  },
}

function MuggleNavigation() {
  return (
    <p>
      <Link to="/muggle/late-edition">Late Edition</Link> |{' '}
      <Link to="/muggle/city-desk">City Desk</Link> |{' '}
      <Link to="/muggle/classifieds">Classifieds</Link> | <Link to="/muggle/weather">Weather</Link>
    </p>
  )
}

function MuggleHomeContent() {
  return (
    <>
      <center>
        <h1>Welcome, Mr Muggle</h1>
        <p>
          <i>Special ordinary edition for perfectly ordinary readers.</i>
        </p>
      </center>

      <MuggleNavigation />

      <p>
        <b>Breaking:</b> Local man says he will definitely start walking every morning "from
        Monday onward." Monday remains unnamed.
      </p>

      <marquee scrollamount="4">
        Town council approves a newer, slightly taller mailbox. Neighborhood cat observed sitting
        with unusual confidence. Kettle boils again at 8:14. More at eleven.
      </marquee>

      <hr />

      <h2>Front Page</h2>
      <p>
        Residents of Willow Lane have reported a major development after Gerald from number 12
        rotated his recycling bin so that the wheels now face the hedge. Witnesses called the move
        "bold, if ultimately unnecessary." A neighborhood meeting has been scheduled for Thursday
        to discuss whether this sets a precedent.
      </p>
      <p>
        In a separate story, the post office confirmed that all three clerks agree the new rubber
        stamp is "much clearer than the old one," though none felt comfortable calling it exciting.
        Analysts say this may be the most productive administrative week since the brief incident
        involving the extra stapler in 2019.
      </p>

      <h3>City Desk</h3>
      <p>
        Commuters experienced mild emotional turbulence yesterday when the 8:05 bus arrived at
        8:04, forcing several passengers to become "unexpectedly punctual." The transit authority
        has promised a full internal review, or at least a memo with a firm tone.
      </p>

      <h3>Opinion & Editorial</h3>
      <p>
        There is no shame in admitting that not every meeting needed to be an email and not every
        email needed to begin with "gentle reminder." Civilization can still be saved if we agree,
        together, to stop replying-all just to say "thanks."
      </p>

      <h3>Classifieds</h3>
      <ul>
        <li>For sale: one folding chair with excellent posture and average charisma.</li>
        <li>Wanted: neighbor who borrowed a casserole dish in 2022 and now avoids eye contact.</li>
        <li>Lost: TV remote. Last seen between the sofa cushions, where brave people go to search.</li>
        <li>Services: man available to say "have you tried unplugging it" with great authority.</li>
      </ul>

      <h3>Weather</h3>
      <p>
        Weather is expected to continue happening throughout the day. Morning will begin with a
        committed layer of cloud, followed by hesitant sunlight around lunchtime, before a light
        breeze arrives and reminds everyone they should have brought a thinner jacket but not that
        thin.
      </p>
    </>
  )
}

function MuggleArticleContent({ page }) {
  if (page.classifiedOnly) {
    return (
      <>
        <center>
          <h1>{page.title}</h1>
          <p>
            <i>This document has been handled with an unnecessary amount of seriousness.</i>
          </p>
        </center>

        <MuggleNavigation />
        <hr />

        <center>
          <h2>this page is classified</h2>
        </center>
      </>
    )
  }

  return (
    <>
      <center>
        <h1>{page.title}</h1>
        <p>
          <i>{page.subtitle}</i>
        </p>
      </center>

      <p>
        <Link to={MUGGLE_HOME_PATH}>Return to Front Page</Link>
      </p>
      <MuggleNavigation />

      <hr />

      {page.sections.map((section) => (
        <div key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ))}
    </>
  )
}

function MuggleGate({ onReveal }) {
  const location = useLocation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [helperMessage, setHelperMessage] = useState('')
  const [step, setStep] = useState('password')
  const [wandPosition, setWandPosition] = useState({ x: 0, y: 0 })
  const [waveProgress, setWaveProgress] = useState(0)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isWandActive, setIsWandActive] = useState(false)
  const [isObliviateRecoveryActive, setIsObliviateRecoveryActive] = useState(false)
  const [isFlyingCarVisible, setIsFlyingCarVisible] = useState(false)
  const [flyingCarMotion, setFlyingCarMotion] = useState({ x: -220, y: 0, rotation: -2, opacity: 0 })
  const arenaRef = useRef(null)
  const obliviateTimersRef = useRef({ helper: 0, reveal: 0, typing: 0, pause: 0 })
  const flyingCarTimersRef = useRef({ reveal: 0 })
  const flyingCarAnimationRef = useRef({
    frame: 0,
    lastTime: 0,
    nextVarianceAt: 0,
    x: -220,
    phase: 0,
    velocity: 520,
    targetVelocity: 520,
  })
  const currentPage = muggleRoutes[location.pathname] ?? null
  const gestureRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    lastDirection: 0,
    swings: 0,
    lastSwingX: 0,
  })

  useEffect(() => {
    if (!isDialogOpen || step !== 'wand') {
      return undefined
    }

    function centerWand() {
      if (!arenaRef.current || gestureRef.current.active) {
        return
      }

      const { clientWidth, clientHeight } = arenaRef.current
      setWandPosition({
        x: Math.max((clientWidth - WAND_SIZE.width) / 2, 0),
        y: Math.max((clientHeight - WAND_SIZE.height) / 2 - 4, 0),
      })
    }

    const frameId = window.requestAnimationFrame(centerWand)
    window.addEventListener('resize', centerWand)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', centerWand)
    }
  }, [isDialogOpen, step])

  useEffect(() => {
    const obliviateTimers = obliviateTimersRef.current
    const flyingCarTimers = flyingCarTimersRef.current
    const flyingCarAnimation = flyingCarAnimationRef.current

    return () => {
      window.clearTimeout(obliviateTimers.helper)
      window.clearTimeout(obliviateTimers.reveal)
      window.clearTimeout(obliviateTimers.typing)
      window.clearTimeout(obliviateTimers.pause)
      window.clearTimeout(flyingCarTimers.reveal)
      window.cancelAnimationFrame(flyingCarAnimation.frame)
    }
  }, [])

  useEffect(() => {
    const flyingCarTimers = flyingCarTimersRef.current

    function startFlyingCarAnimation() {
      window.cancelAnimationFrame(flyingCarAnimationRef.current.frame)

      flyingCarAnimationRef.current = {
        frame: 0,
        lastTime: 0,
        nextVarianceAt: 0,
        x: -220,
        phase: 0,
        velocity: 500 + Math.random() * 60,
        targetVelocity: 500 + Math.random() * 60,
      }

      function step(now) {
        const motion = flyingCarAnimationRef.current

        if (!motion.lastTime) {
          motion.lastTime = now
          setFlyingCarMotion({ x: -220, y: 0, rotation: -2, opacity: 0 })
        }

        const dt = Math.min((now - motion.lastTime) / 1000, 0.04)
        motion.lastTime = now

        const viewportWidth = window.innerWidth || 1
        const isNearCenter = motion.x > viewportWidth * 0.38 && motion.x < viewportWidth * 0.64

        if (now >= motion.nextVarianceAt) {
          const baseVelocity = isNearCenter ? 315 : 520
          const variance = (Math.random() - 0.5) * (isNearCenter ? 70 : 120)
          motion.targetVelocity = Math.max(240, baseVelocity + variance)
          motion.nextVarianceAt = now + 140 + Math.random() * 220
        }

        motion.velocity += (motion.targetVelocity - motion.velocity) * Math.min(dt * 2.8, 1)
        motion.x += motion.velocity * dt
        motion.phase += dt * (isNearCenter ? 5.6 : 7.2)

        const y = Math.sin(motion.phase) * 13 + Math.sin(motion.phase * 0.45) * 4
        const rotation = Math.sin(motion.phase * 0.82) * 2.8
        const opacity = motion.x > -150 ? 0.98 : 0

        setFlyingCarMotion({
          x: motion.x,
          y,
          rotation,
          opacity,
        })

        if (motion.x < viewportWidth + 320) {
          motion.frame = window.requestAnimationFrame(step)
          return
        }

        setIsFlyingCarVisible(false)
      }

      flyingCarAnimationRef.current.frame = window.requestAnimationFrame(step)
    }

    flyingCarTimers.reveal = window.setTimeout(() => {
      setIsFlyingCarVisible(true)
      startFlyingCarAnimation()
    }, 0)

    return () => {
      window.clearTimeout(flyingCarTimers.reveal)
      window.cancelAnimationFrame(flyingCarAnimationRef.current.frame)
    }
  }, [])

  function resetWandTrial() {
    setWaveProgress(0)
    setIsUnlocking(false)
    setIsWandActive(false)
    gestureRef.current = {
      active: false,
      lastX: 0,
      lastY: 0,
      lastDirection: 0,
      swings: 0,
      lastSwingX: 0,
    }
  }

  function getBoundedWandPosition(clientX, clientY) {
    if (!arenaRef.current) {
      return { x: 0, y: 0 }
    }

    const bounds = arenaRef.current.getBoundingClientRect()
    const nextX = clientX - bounds.left - WAND_SIZE.width / 2
    const nextY = clientY - bounds.top - WAND_SIZE.height / 2

    return {
      x: Math.max(0, Math.min(nextX, bounds.width - WAND_SIZE.width)),
      y: Math.max(0, Math.min(nextY, bounds.height - WAND_SIZE.height)),
    }
  }

  function openDialog() {
    setIsDialogOpen(true)
    setPassword('')
    setErrorMessage('')
    setHelperMessage('')
    setStep('password')
    resetWandTrial()
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setPassword('')
    setErrorMessage('')
    setHelperMessage('')
    setStep('password')
    resetWandTrial()
  }

  function typewriteMessage(text, setValue, speed, onDone) {
    let index = 0

    setValue('')

    function writeNext() {
      if (index >= text.length) {
        onDone?.()
        return
      }

      index += 1
      setValue(text.slice(0, index))
      obliviateTimersRef.current.typing = window.setTimeout(writeNext, speed)
    }

    writeNext()
  }

  function startObliviateRecovery() {
    if (isObliviateRecoveryActive) {
      return
    }

    setIsObliviateRecoveryActive(true)
    setErrorMessage('')
    setHelperMessage('')

    window.clearTimeout(obliviateTimersRef.current.helper)
    window.clearTimeout(obliviateTimersRef.current.reveal)
    window.clearTimeout(obliviateTimersRef.current.typing)
    window.clearTimeout(obliviateTimersRef.current.pause)

    typewriteMessage('It seems like you forgot the spell. Bad memory is it?', setErrorMessage, 26, () => {
      obliviateTimersRef.current.pause = window.setTimeout(() => {
        typewriteMessage('Never mind. Let me help you find your way back.', setHelperMessage, 24, () => {
          obliviateTimersRef.current.reveal = window.setTimeout(() => {
            clearObliviateLock()
            onReveal()
          }, 1700)
        })
      }, 900)
    })
  }

  function handlePasswordSubmit(event) {
    event.preventDefault()

    if (hasObliviateLock()) {
      startObliviateRecovery()
      return
    }

    if (password.trim().toLowerCase() === 'revelio') {
      setErrorMessage('')
      setHelperMessage('')
      setStep('wand')
      resetWandTrial()
      return
    }

    setErrorMessage('I believe you have taken a wrong turn, sir.')
  }

  function finishReveal() {
    if (isUnlocking) {
      return
    }

    setIsUnlocking(true)
    window.setTimeout(() => {
      onReveal()
    }, 280)
  }

  function handleWandPointerDown(event) {
    if (isUnlocking) {
      return
    }

    const nextPosition = getBoundedWandPosition(event.clientX, event.clientY)

    gestureRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
      lastDirection: 0,
      swings: gestureRef.current.swings,
      lastSwingX: event.clientX,
    }
    setWandPosition(nextPosition)
    setIsWandActive(true)

    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handleWandPointerMove(event) {
    if (!gestureRef.current.active || isUnlocking) {
      return
    }

    const deltaX = event.clientX - gestureRef.current.lastX
    const direction = deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1
    setWandPosition(getBoundedWandPosition(event.clientX, event.clientY))

    if (Math.abs(deltaX) > 10 && direction !== 0) {
      const hasDirectionChanged =
        gestureRef.current.lastDirection !== 0 && direction !== gestureRef.current.lastDirection
      const hasMeaningfulTravel = Math.abs(event.clientX - gestureRef.current.lastSwingX) > 26

      if (hasDirectionChanged && hasMeaningfulTravel) {
        gestureRef.current.swings += 1
        gestureRef.current.lastSwingX = event.clientX

        setWaveProgress(() => {
          const nextProgress = Math.min((gestureRef.current.swings / 4) * 100, 100)

          if (nextProgress >= 100) {
            finishReveal()
          }

          return nextProgress
        })
      }

      gestureRef.current.lastDirection = direction
    }

    gestureRef.current.lastX = event.clientX
    gestureRef.current.lastY = event.clientY
  }

  function handleWandPointerUp(event) {
    gestureRef.current.active = false
    setIsWandActive(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '8px 12px 32px',
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      <table width="100%" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td>
              <b>The Daily Muggle Bulletin</b>
            </td>
            <td align="right">
              <button type="button" onClick={openDialog}>
                this way to diagon alley
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {currentPage ? <MuggleArticleContent page={currentPage} /> : <MuggleHomeContent />}

      <hr />

      <p>
        <small>
          Copyright 1997 The Daily Muggle Bulletin. Proudly covering bins, buses, weather, and
          suspiciously confident cats since before it was profitable.
        </small>
      </p>

      {isDialogOpen ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: 'min(100%, 440px)',
              border: '2px solid #000000',
              backgroundColor: '#c0c0c0',
              boxShadow: '6px 6px 0 #000000',
            }}
          >
            <div
              style={{
                backgroundColor: '#000080',
                color: '#ffffff',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 'bold',
              }}
            >
              <span>Diagon Alley Access</span>
              <button
                type="button"
                onClick={closeDialog}
                style={{
                  border: '1px solid #000000',
                  backgroundColor: '#c0c0c0',
                  color: '#000000',
                  minWidth: '22px',
                  minHeight: '22px',
                  fontWeight: 'bold',
                }}
              >
                X
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              {step === 'password' ? (
                <form onSubmit={handlePasswordSubmit}>
                  <p>
                    <b>Password required.</b>
                  </p>
                  <p>Please state your business.</p>
                  <input
                    autoFocus
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid #000000',
                      padding: '8px',
                      fontFamily: '"Courier New", monospace',
                    }}
                  />

                  {errorMessage ? (
                    <p
                      style={{
                        color: '#8b0000',
                        marginTop: '10px',
                        fontSize: isObliviateRecoveryActive ? '20px' : undefined,
                        fontWeight: isObliviateRecoveryActive ? 'bold' : undefined,
                        letterSpacing: isObliviateRecoveryActive ? '0.08em' : undefined,
                        textTransform: isObliviateRecoveryActive ? 'uppercase' : undefined,
                      }}
                    >
                      {errorMessage}
                    </p>
                  ) : (
                    <p style={{ marginTop: '10px' }}>
                      Hint: advanced sorcery, surprisingly simple spelling.
                    </p>
                  )}

                  {helperMessage ? (
                    <p
                      style={{
                        color: '#003366',
                        marginTop: '10px',
                        fontSize: isObliviateRecoveryActive ? '18px' : undefined,
                        fontWeight: isObliviateRecoveryActive ? 'bold' : undefined,
                        letterSpacing: isObliviateRecoveryActive ? '0.08em' : undefined,
                        textTransform: isObliviateRecoveryActive ? 'uppercase' : undefined,
                      }}
                    >
                      {helperMessage}
                    </p>
                  ) : null}

                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                    <button disabled={isObliviateRecoveryActive} type="submit">
                      Submit
                    </button>
                    <button type="button" onClick={closeDialog}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p>
                    <b>Looks like you forgot this.</b>
                  </p>

                  <div
                    ref={arenaRef}
                    style={{
                      marginTop: '18px',
                      border: '1px solid #000000',
                      backgroundColor: '#efefef',
                      padding: '24px 12px',
                      minHeight: '220px',
                      position: 'relative',
                      overflow: 'hidden',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: `${wandPosition.x}px`,
                        top: `${wandPosition.y}px`,
                        width: `${WAND_SIZE.width}px`,
                        height: `${WAND_SIZE.height}px`,
                        transition: isWandActive ? 'none' : 'box-shadow 0.16s ease-out',
                        touchAction: 'none',
                        cursor: isUnlocking ? 'default' : isWandActive ? 'grabbing' : 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPointerDown={handleWandPointerDown}
                      onPointerMove={handleWandPointerMove}
                      onPointerUp={handleWandPointerUp}
                      onPointerCancel={handleWandPointerUp}
                    >
                      <img
                        src={WAND_IMAGE_SRC}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          pointerEvents: 'none',
                          userSelect: 'none',
                          WebkitUserDrag: 'none',
                          mixBlendMode: 'multiply',
                          filter: isUnlocking
                            ? 'drop-shadow(0 0 10px rgba(255, 226, 108, 0.9))'
                            : 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.18))',
                        }}
                      />
                    </div>

                    <p style={{ position: 'absolute', left: '12px', bottom: '44px', margin: 0 }}>
                      Wave progress: {Math.round(waveProgress)}%
                    </p>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={closeDialog}>
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {isFlyingCarVisible ? (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '18px',
            left: '-150px',
            width: '152px',
            pointerEvents: 'none',
            zIndex: 30,
            opacity: flyingCarMotion.opacity,
            transform: `translateX(${flyingCarMotion.x}px) translateY(${flyingCarMotion.y}px) rotate(${flyingCarMotion.rotation}deg) scale(0.58)`,
            transformOrigin: 'center center',
            transition: 'opacity 160ms linear',
            willChange: 'transform, opacity',
          }}
        >
          <img
            alt=""
            src={flyingCarImage}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.2))',
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default MuggleGate
