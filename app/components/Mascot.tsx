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
    <div style={{ position: 'absolute', bottom: '65%', right: '2%', pointerEvents: 'none' }}>
      {([
        { delay: '0s',   size: 11, x: 0,   y: 0   },
        { delay: '0.9s', size: 14, x: -10, y: -10 },
        { delay: '1.8s', size: 17, x: -5,  y: -22 },
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

// ── The Woodcock SVG ──────────────────────────────────────────────────────
// Chubby round body, small head, long beak right, blue headband + sneakers.

function WoodcockSVG({ wingAnim, sleeping }: { wingAnim: boolean; sleeping: boolean }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      style={{
        overflow: 'visible',
        display: 'block',
        filter: 'drop-shadow(0 5px 14px rgba(0,0,0,0.3))',
      }}
    >
      {/* ── Shadow ── */}
      <ellipse cx="38" cy="80" rx="22" ry="4.5" fill="rgba(0,0,0,0.18)" />

      {/* ── Blue sneakers (drawn behind legs) ── */}
      {/* left shoe */}
      <rect x="15" y="76" width="16" height="8" rx="4" fill="#3B82F6" />
      <line x1="17" y1="80" x2="29" y2="80" stroke="white" strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" />
      {/* right shoe */}
      <rect x="40" y="76" width="16" height="8" rx="4" fill="#3B82F6" />
      <line x1="42" y1="80" x2="54" y2="80" stroke="white" strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" />

      {/* ── Orange legs ── */}
      <line x1="29" y1="72" x2="24" y2="78" stroke="#E07820" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="43" y1="72" x2="48" y2="78" stroke="#E07820" strokeWidth="3.5" strokeLinecap="round" />

      {/* ── Wings – drawn before body so body overlaps inner edge ── */}
      {/* left wing */}
      <g
        className={wingAnim ? 'mascot-wing-anim' : ''}
        style={{ transformOrigin: '26px 52px' }}
      >
        <ellipse cx="14" cy="52" rx="13" ry="9" fill="#7A5420" />
        <ellipse cx="13" cy="51" rx="9"  ry="6" fill="#8B6428" />
        <path d="M 4 49 Q 13 44 23 49" stroke="#5A3C10" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
      {/* right wing */}
      <g
        className={wingAnim ? 'mascot-wing-anim' : ''}
        style={{
          transformOrigin: '52px 53px',
          animationDirection: wingAnim ? 'reverse' : 'normal',
        }}
      >
        <ellipse cx="63" cy="53" rx="11" ry="8" fill="#7A5420" />
        <ellipse cx="64" cy="52" rx="8"  ry="5.5" fill="#8B6428" />
      </g>

      {/* ── Big round chubby body ── */}
      <circle cx="36" cy="53" r="24" fill="#8B6535" />

      {/* Feather texture lines on body */}
      <path d="M 14 47 Q 36 41 58 47" stroke="#6B4D1A" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 13 54 Q 36 48 59 54" stroke="#6B4D1A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 15 61 Q 36 55 57 61" stroke="#6B4D1A" strokeWidth="1"   fill="none" strokeLinecap="round" />

      {/* Cream belly patch */}
      <ellipse cx="36" cy="58" rx="14" ry="16" fill="#EDD898" />
      {/* subtle belly shading at bottom */}
      <ellipse cx="36" cy="68" rx="10" ry="7" fill="#DFC878" />

      {/* ── Neck blending body → head ── */}
      <ellipse cx="50" cy="38" rx="11" ry="13" fill="#8B6535" />

      {/* ── Small round head ── */}
      <circle cx="52" cy="26" r="14" fill="#9B7540" />

      {/* Head top darkening (woodcock's dark crown) */}
      <path
        d="M 39 22 Q 52 13 65 22 Q 52 28 39 22 Z"
        fill="#6A4818"
      />

      {/* ── Blue sporty headband ── */}
      <path
        d="M 39 19 Q 52 10 65 19 L 65 25 Q 52 16 39 25 Z"
        fill="#3B82F6"
      />
      {/* headband white stripe highlight */}
      <path
        d="M 40 20 Q 52 12 64 20"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* headband lower edge */}
      <path
        d="M 39 25 Q 52 18 65 25"
        stroke="#2563EB"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Long pointed beak (right side of head, extends outside viewBox) ── */}
      {/* upper mandible */}
      <path d="M 65 22 L 92 29 L 65 27 Z" fill="#D4A850" />
      {/* lower mandible */}
      <path d="M 65 28 L 92 29 L 65 33 Z" fill="#B88438" />
      {/* beak top highlight */}
      <path d="M 65 22 L 92 29" stroke="#E8C068" strokeWidth="0.9" fill="none" />
      {/* beak groove */}
      <path d="M 65 25 L 88 29" stroke="#A07030" strokeWidth="0.7" fill="none" strokeLinecap="round" />

      {/* ── Eye ── */}
      {sleeping ? (
        /* Closed eye — fill with head color, draw eyelid arc + lashes */
        <g>
          <circle cx="57" cy="23" r="5" fill="#9B7540" />
          <path d="M 52 23 Q 57 17 62 23" stroke="#3D1F06" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <line x1="54" y1="23" x2="53" y2="19" stroke="#3D1F06" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="57" y1="22" x2="57" y2="18" stroke="#3D1F06" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="60" y1="23" x2="61" y2="19" stroke="#3D1F06" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="57" cy="23" r="5.5" fill="#1a1a1a" />
          {/* main white highlight */}
          <circle cx="59.2" cy="21.0" r="2.1" fill="white" />
          {/* soft secondary highlight */}
          <circle cx="55.2" cy="25.2" r="0.9" fill="rgba(255,255,255,0.4)" />
        </g>
      )}
    </svg>
  )
}

// ── Constants ─────────────────────────────────────────────────────────────

const ANIM_DURATION: Partial<Record<MascotState, number>> = {
  happy:         1300,
  excited:       1700,
  celebration:   2500,
  bodybuilder:   2900,
}

const RANDOM_MESSAGES = [
  'Allez, on bosse ! 🔥',
  'Tu peux le faire ! 💪',
  'La régularité c\'est la clé !',
  'Encore un effort ! 🚀',
  'Pas de douleur, pas de gain !',
  'Champion du jour, c\'est toi ! 🏆',
  'La bécasse approuve ! 👊',
]
const RANDOM_REACTIONS: MascotState[] = ['happy', 'excited', 'celebration', 'bodybuilder']

// ── Main mascot component ─────────────────────────────────────────────────

export function Mascot() {
  const { reaction, trigger, clearReaction } = useMascot()

  const [animState, setAnimState]     = useState<MascotState>('idle')
  const [message, setMessage]         = useState<string | null>(null)
  const [bubbleFading, setBubbleFading] = useState(false)
  const [wingAnim, setWingAnim]       = useState(false)

  const animTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wingTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animStateRef   = useRef<MascotState>('idle')
  animStateRef.current = animState

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

    // Wing flap for bouncy/energetic states (not bodybuilder — scale is the star there)
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

  // ── Random bodybuilder every 45 s ─────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      if (animStateRef.current === 'idle') {
        applyAnimation('bodybuilder')
      }
    }, 45_000)
    return () => clearInterval(interval)
  }, [applyAnimation])

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
        width: 80,
        height: 80,
        zIndex: 39,
        overflow: 'visible',
      }}
    >
      {message && <SpeechBubble message={message} fading={bubbleFading} />}
      {isSleeping && <ZzzBubbles />}

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
