'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMascot, MascotState } from '@/app/providers/MascotProvider'

// ── Speech bubble ──────────────────────────────────────────────────────────

function SpeechBubble({ message, fading }: { message: string; fading: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        background: 'rgba(20,20,20,0.92)',
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        padding: '7px 14px',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        pointerEvents: 'none',
        animation: fading
          ? 'mascot-bubble-out 0.5s ease-in forwards'
          : 'mascot-bubble-in 0.3s ease-out forwards',
        zIndex: 55,
      }}
    >
      {message}
      {/* little tail */}
      <div
        style={{
          position: 'absolute',
          bottom: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '7px solid rgba(20,20,20,0.92)',
        }}
      />
    </div>
  )
}

// ── Zzz floaties ──────────────────────────────────────────────────────────

function ZzzBubbles() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '60%',
        left: '70%',
        pointerEvents: 'none',
      }}
    >
      {[
        { delay: '0s', size: 11, x: 0, y: 0 },
        { delay: '0.9s', size: 14, x: 10, y: -8 },
        { delay: '1.8s', size: 17, x: 5, y: -18 },
      ].map(({ delay, size, x, y }, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            fontSize: size,
            fontWeight: 700,
            color: 'rgba(180,200,255,0.85)',
            animation: `mascot-zzz 2.7s ease-in-out ${delay} infinite`,
            textShadow: '0 1px 6px rgba(100,120,255,0.4)',
          }}
        >
          z
        </span>
      ))}
    </div>
  )
}

// ── The woodcock SVG ──────────────────────────────────────────────────────
// Cute cartoon American Woodcock: plump body, very long beak, huge eye,
// distinctive crown stripes, stubby wings, short orange legs.

function WoodcockSVG({
  wingAnim,
  sleeping,
}: {
  wingAnim: boolean
  sleeping: boolean
}) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      style={{ overflow: 'visible', display: 'block', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}
    >
      {/* Ground shadow */}
      <ellipse cx="37" cy="79" rx="16" ry="3.5" fill="rgba(0,0,0,0.18)" />

      {/* ── Tail feathers ── */}
      <path d="M14 60 Q7 66 5 75 Q13 65 20 68 Z" fill="#6B4515" />
      <path d="M13 54 Q6 58 4 67 Q12 60 18 63 Z" fill="#7A5218" />

      {/* ── Body ── */}
      <ellipse cx="35" cy="55" rx="21" ry="17" fill="#9B7230" />

      {/* Body feather texture lines */}
      <path d="M15 50 Q35 44 55 50" stroke="#6B4D18" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M16 56 Q35 50 54 56" stroke="#6B4D18" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M18 62 Q35 57 52 62" stroke="#6B4D18" strokeWidth="1"   fill="none" strokeLinecap="round" />

      {/* ── Left wing (animated) ── */}
      <g
        className={wingAnim ? 'mascot-wing-anim' : ''}
        style={{ transformOrigin: '30px 53px' }}
      >
        <ellipse cx="17" cy="54" rx="11" ry="6.5" fill="#7A5218" />
        <path d="M8 52 Q17 48 26 51" stroke="#5C3D10" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Right wing (animated, counter-phase) ── */}
      <g
        className={wingAnim ? 'mascot-wing-anim' : ''}
        style={{
          transformOrigin: '42px 56px',
          animationDirection: wingAnim ? 'reverse' : undefined,
        }}
      >
        <ellipse cx="55" cy="57" rx="8" ry="5.5" fill="#7A5218" />
      </g>

      {/* ── Neck blend ── */}
      <ellipse cx="50" cy="46" rx="9" ry="11" fill="#9B7230" />

      {/* ── Head ── */}
      <circle cx="51" cy="33" r="15" fill="#9B7230" />

      {/* Crown stripes — woodcock's distinctive buff & dark bands */}
      <path d="M37 20 Q51 15 65 20" stroke="#4A2D08" strokeWidth="4"   fill="none" strokeLinecap="round" />
      <path d="M38 26 Q51 21 64 26" stroke="#C8A050" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M38 20 Q51 15 65 20" stroke="#C8A050" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ── Eye (very large — woodcock trademark) ── */}
      <circle cx="56" cy="27" r="8" fill="white" />

      {sleeping ? (
        /* Closed eye for sleep */
        <>
          <ellipse cx="56" cy="27" r="8" fill="#9B7230" />
          <path d="M48 27 Q56 22 64 27" stroke="#3A2008" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          {/* little eyelashes */}
          <line x1="50" y1="27" x2="49" y2="24" stroke="#3A2008" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="56" y1="26" x2="56" y2="22" stroke="#3A2008" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="27" x2="63" y2="24" stroke="#3A2008" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        /* Open eye */
        <>
          <circle cx="57" cy="27" r="5.5" fill="#1A0500" />
          <circle cx="59"  cy="25"  r="2"   fill="white" />
          <circle cx="55.5" cy="29.5" r="1" fill="rgba(255,255,255,0.35)" />
        </>
      )}

      {/* ── Beak (long! extends outside viewBox — overflow:visible) ── */}
      <path d="M64 29 L92 38 L90 43 L64 34 Z" fill="#D4A040" />
      {/* beak top-edge highlight */}
      <path d="M64 29 L92 38" stroke="#E8B850" strokeWidth="1" fill="none" />
      {/* beak tip */}
      <ellipse cx="91" cy="40.5" rx="2.5" ry="2" fill="#A87820" />
      {/* beak groove line */}
      <path d="M64 31 L88 39.5" stroke="#B88030" strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* ── Legs ── */}
      <line x1="29" y1="71" x2="26" y2="79" stroke="#D4A040" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="41" y1="72" x2="44" y2="79" stroke="#D4A040" strokeWidth="2.8" strokeLinecap="round" />

      {/* ── Feet (3 toes each) ── */}
      {/* left foot */}
      <line x1="26" y1="79" x2="20" y2="79" stroke="#D4A040" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="79" x2="24" y2="76" stroke="#D4A040" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="26" y1="79" x2="28" y2="76" stroke="#D4A040" strokeWidth="1.8" strokeLinecap="round" />
      {/* right foot */}
      <line x1="44" y1="79" x2="50" y2="79" stroke="#D4A040" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="79" x2="42" y2="76" stroke="#D4A040" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="44" y1="79" x2="46" y2="76" stroke="#D4A040" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// ── Auto-reset durations (ms) for non-looping animations ─────────────────
const ANIM_DURATION: Partial<Record<MascotState, number>> = {
  happy:       1200,
  excited:     1700,
  celebration: 2500,
}

const RANDOM_MESSAGES = [
  'Allez, on bosse !',
  'Tu peux le faire !',
  'La régularité c\'est la clé !',
  'Encore un effort !',
]
const RANDOM_REACTIONS: MascotState[] = ['happy', 'excited', 'celebration']

// ── Main mascot component ─────────────────────────────────────────────────

export function Mascot() {
  const { reaction, trigger, clearReaction } = useMascot()

  const [animState, setAnimState] = useState<MascotState>('idle')
  const [message, setMessage]     = useState<string | null>(null)
  const [bubbleFading, setBubbleFading] = useState(false)
  const [wingAnim, setWingAnim]   = useState(false)

  const animTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wingTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── idle-sleep detection ─────────────────────────────────────────────

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    // Wake up from sleep on any activity
    setAnimState((prev) => (prev === 'sleep' ? 'idle' : prev))
    idleTimerRef.current = setTimeout(() => {
      setAnimState('sleep')
      setMessage(null)
    }, 30_000)
  }, [])

  useEffect(() => {
    const events = ['mousemove', 'touchstart', 'click', 'keydown', 'scroll']
    events.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }))
    resetIdleTimer()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [resetIdleTimer])

  // ── helper: show bubble then fade ────────────────────────────────────

  const showBubble = useCallback((msg: string) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    setBubbleFading(false)
    setMessage(msg)
    // start fading after 2 s, remove after 2.5 s
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleFading(true)
      bubbleTimerRef.current = setTimeout(() => setMessage(null), 500)
    }, 2000)
  }, [])

  // ── helper: apply an animation state ─────────────────────────────────

  const applyAnimation = useCallback((state: MascotState, msg?: string) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    if (wingTimerRef.current) clearTimeout(wingTimerRef.current)

    setAnimState(state)

    // Wing flap for energetic animations
    if (['happy', 'excited', 'celebration'].includes(state)) {
      setWingAnim(false)
      // tiny delay so React re-mounts the class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setWingAnim(true))
      })
      wingTimerRef.current = setTimeout(() => setWingAnim(false), 1100)
    }

    if (msg) showBubble(msg)

    const dur = ANIM_DURATION[state]
    if (dur) {
      animTimerRef.current = setTimeout(() => {
        setAnimState('idle')
        clearReaction()
      }, dur)
    }
  }, [clearReaction, showBubble])

  // ── react to context trigger ─────────────────────────────────────────

  useEffect(() => {
    if (!reaction) return
    applyAnimation(reaction.state, reaction.message)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reaction?.id])

  // ── click on mascot ──────────────────────────────────────────────────

  function handleClick() {
    const msg = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)]
    const state = RANDOM_REACTIONS[Math.floor(Math.random() * RANDOM_REACTIONS.length)]
    applyAnimation(state, msg)
    resetIdleTimer()
  }

  const isSleeping = animState === 'sleep'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 84,
        left: 16,
        width: 80,
        height: 80,
        zIndex: 39,
        // don't clip the beak which extends right
        overflow: 'visible',
      }}
    >
      {/* Speech bubble */}
      {message && <SpeechBubble message={message} fading={bubbleFading} />}

      {/* Zzz floaties */}
      {isSleeping && <ZzzBubbles />}

      {/* The bird */}
      <div
        className={`mascot-${animState}`}
        onClick={handleClick}
        style={{ cursor: 'pointer', userSelect: 'none', width: 80, height: 80 }}
        title="Cliquez sur moi !"
      >
        <WoodcockSVG wingAnim={wingAnim} sleeping={isSleeping} />
      </div>
    </div>
  )
}
