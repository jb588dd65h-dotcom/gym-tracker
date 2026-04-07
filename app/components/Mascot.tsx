'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMascot, MascotState } from '@/app/providers/MascotProvider'

// ── Speech bubble ─────────────────────────────────────────────────────────

function SpeechBubble({ message, fading }: { message: string; fading: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 12px)',
        right: 0,
        whiteSpace: 'nowrap',
        background: 'rgba(18,18,18,0.94)',
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        padding: '8px 15px',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.13)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
        pointerEvents: 'none',
        animation: fading
          ? 'mascot-bubble-out 0.5s ease-in forwards'
          : 'mascot-bubble-in 0.3s ease-out forwards',
        zIndex: 55,
      }}
    >
      {message}
      {/* tail pointing to bird */}
      <div
        style={{
          position: 'absolute',
          bottom: -7,
          right: 22,
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '7px solid rgba(18,18,18,0.94)',
        }}
      />
    </div>
  )
}

// ── Zzz floaties ──────────────────────────────────────────────────────────

function ZzzBubbles() {
  return (
    <div style={{ position: 'absolute', bottom: '55%', right: '5%', pointerEvents: 'none' }}>
      {([
        { delay: '0s',   size: 11, x: 0,  y: 0   },
        { delay: '0.9s', size: 14, x: -8, y: -10 },
        { delay: '1.8s', size: 17, x: -4, y: -22 },
      ] as const).map(({ delay, size, x, y }, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            fontSize: size,
            fontWeight: 700,
            color: 'rgba(180,200,255,0.88)',
            animation: `mascot-zzz 2.7s ease-in-out ${delay} infinite`,
            textShadow: '0 1px 8px rgba(100,140,255,0.5)',
          }}
        >
          z
        </span>
      ))}
    </div>
  )
}

// ── Eye sub-component ─────────────────────────────────────────────────────

function Eye({ cx, cy, r = 9.5, sleeping }: { cx: number; cy: number; r?: number; sleeping: boolean }) {
  if (sleeping) {
    return (
      <g>
        {/* fill with body color so closed eye blends in */}
        <circle cx={cx} cy={cy} r={r} fill="#8B6914" />
        {/* eyelid arc */}
        <path
          d={`M ${cx - r} ${cy} Q ${cx} ${cy - r * 0.95} ${cx + r} ${cy}`}
          stroke="#3D1F06"
          strokeWidth={2.6}
          fill="none"
          strokeLinecap="round"
        />
        {/* lashes */}
        {[-4, 0, 4].map((dx, i) => (
          <line
            key={i}
            x1={cx + dx} y1={cy - 1}
            x2={cx + dx + (dx < 0 ? -1.5 : dx > 0 ? 1.5 : 0)} y2={cy - r * 0.7}
            stroke="#3D1F06"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        ))}
      </g>
    )
  }
  return (
    <g>
      {/* white sclera */}
      <circle cx={cx} cy={cy} r={r} fill="white" />
      {/* golden ring — gives that warm, polished look */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8B830" strokeWidth={1.6} />
      {/* pupil */}
      <circle cx={cx + 0.5} cy={cy + 0.5} r={r * 0.62} fill="#1a1a1a" />
      {/* main highlight (top-right) */}
      <circle cx={cx + r * 0.32} cy={cy - r * 0.32} r={r * 0.26} fill="white" />
      {/* soft secondary highlight (bottom-left) */}
      <circle cx={cx - r * 0.28} cy={cy + r * 0.3} r={r * 0.13} fill="rgba(255,255,255,0.45)" />
    </g>
  )
}

// ── The redesigned woodcock SVG ────────────────────────────────────────────
// Duolingo-inspired: big round body, huge expressive eyes, short cute beak,
// small rounded wings, warm brown/golden palette.

function WoodcockSVG({ wingAnim, sleeping }: { wingAnim: boolean; sleeping: boolean }) {
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
      style={{
        overflow: 'visible',
        display: 'block',
        filter: 'drop-shadow(0 5px 12px rgba(0,0,0,0.32))',
      }}
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="35" cy="68" rx="21" ry="4" fill="rgba(0,0,0,0.16)" />

      {/* ── Main body (tall rounded oval) ── */}
      <ellipse cx="35" cy="37" rx="26" ry="31" fill="#8B6914" />

      {/* ── Belly / chest patch (lighter golden) ── */}
      <ellipse cx="35" cy="46" rx="17" ry="22" fill="#D4A017" />

      {/* ── Left wing ── */}
      <g
        className={wingAnim ? 'mascot-wing-anim' : ''}
        style={{ transformOrigin: '17px 46px' }}
      >
        <ellipse cx="8" cy="46" rx="10" ry="7" fill="#7A5210" />
        {/* wing feather hint */}
        <path d="M 3 43 Q 8 40 14 43" stroke="#5C3A08" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Right wing ── */}
      <g
        className={wingAnim ? 'mascot-wing-anim' : ''}
        style={{ transformOrigin: '53px 46px', animationDirection: wingAnim ? 'reverse' : undefined }}
      >
        <ellipse cx="62" cy="46" rx="10" ry="7" fill="#7A5210" />
        <path d="M 56 43 Q 62 40 67 43" stroke="#5C3A08" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Crown / forehead marking (woodcock stripe) ── */}
      <path
        d="M 17 18 Q 35 9 53 18 Q 35 22 17 18 Z"
        fill="#5C3A08"
      />
      {/* buff highlight stripe on crown */}
      <path
        d="M 19 18 Q 35 11 51 18"
        stroke="#E8B830"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Eyes ── */}
      <Eye cx={23} cy={27} r={9.5} sleeping={sleeping} />
      <Eye cx={47} cy={27} r={9.5} sleeping={sleeping} />

      {/* ── Short cute beak (pointing right, almond-shaped) ── */}
      <path
        d="M 43 33 Q 56 37 43 42 Q 40 37.5 43 33 Z"
        fill="#E8891A"
      />
      {/* beak dividing line */}
      <path
        d="M 43 37.5 Q 52 37 56 37"
        stroke="#C06810"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      {/* beak shine */}
      <path
        d="M 44 34.5 Q 50 33 53 36"
        stroke="rgba(255,210,120,0.6)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Small feet (two cute rounded stubs) ── */}
      <ellipse cx="27" cy="67" rx="7" ry="3.5" fill="#A07010" />
      <ellipse cx="43" cy="67" rx="7" ry="3.5" fill="#A07010" />
    </svg>
  )
}

// ── Config ────────────────────────────────────────────────────────────────

const ANIM_DURATION: Partial<Record<MascotState, number>> = {
  happy:       1200,
  excited:     1700,
  celebration: 2500,
}

const RANDOM_MESSAGES = [
  'Allez, on bosse ! 🔥',
  'Tu peux le faire ! 💪',
  'La régularité c\'est la clé !',
  'Encore un effort ! 🚀',
  'Pas de douleur, pas de gain !',
  'Champion du jour, c\'est toi ! 🏆',
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

  // ── 30 s idle → sleep ────────────────────────────────────────────────

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
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

  // ── Speech bubble helper ──────────────────────────────────────────────

  const showBubble = useCallback((msg: string) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    setBubbleFading(false)
    setMessage(msg)
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleFading(true)
      bubbleTimerRef.current = setTimeout(() => setMessage(null), 500)
    }, 2000)
  }, [])

  // ── Apply animation ───────────────────────────────────────────────────

  const applyAnimation = useCallback((state: MascotState, msg?: string) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    if (wingTimerRef.current) clearTimeout(wingTimerRef.current)

    setAnimState(state)

    if (['happy', 'excited', 'celebration'].includes(state)) {
      setWingAnim(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setWingAnim(true)))
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

  // ── React to context trigger ──────────────────────────────────────────

  useEffect(() => {
    if (!reaction) return
    applyAnimation(reaction.state, reaction.message)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reaction?.id])

  // ── Click handler ─────────────────────────────────────────────────────

  function handleClick() {
    const msg   = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)]
    const state = RANDOM_REACTIONS[Math.floor(Math.random() * RANDOM_REACTIONS.length)]
    applyAnimation(state, msg)
    resetIdleTimer()
  }

  const isSleeping = animState === 'sleep'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 90,
        right: 16,
        width: 70,
        height: 70,
        zIndex: 39,
        overflow: 'visible',
      }}
    >
      {message && <SpeechBubble message={message} fading={bubbleFading} />}
      {isSleeping && <ZzzBubbles />}

      <div
        className={`mascot-${animState}`}
        onClick={handleClick}
        style={{ cursor: 'pointer', userSelect: 'none', width: 70, height: 70 }}
        title="Cliquez sur moi !"
      >
        <WoodcockSVG wingAnim={wingAnim} sleeping={isSleeping} />
      </div>
    </div>
  )
}
