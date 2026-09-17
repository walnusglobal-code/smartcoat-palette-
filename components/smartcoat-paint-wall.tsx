'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy, MoveHorizontal } from 'lucide-react'
import { initialColour, paintColours, type PaintColour } from '@/lib/paint-colours'

const ROW_COUNT = 24
const VISIBLE_TILES = 24

const LOGO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-PCTaNFgod6Ni2ANqzwR96w7fhOUUUR.webp'
const HERO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f25096eee1e284a248eb1a1038d60246-FVyw9Cdi7qAyHBuGEOyo9M0Do7hyl6.jpg'
const TILE_SIZE = 32
const TILE_GAP = 0.2
const TILE_STEP = TILE_SIZE + TILE_GAP

type RowProps = { rowIndex: number; onSelect: (colour: PaintColour) => void; selectedId: string }

type RowRuntime = { offset: number; velocity: number; dragging: boolean; startX: number; startOffset: number; pointerId?: number; moved: boolean }

function PaintRow({ rowIndex, onSelect, selectedId }: RowProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const runtime = useRef<RowRuntime>({ offset: -((rowIndex * 8) % paintColours.length) * TILE_STEP, velocity: rowIndex % 2 ? -0.035 : 0.035, dragging: false, startX: 0, startOffset: 0, moved: false })
  const [hovered, setHovered] = useState<string | null>(null)

  const render = useCallback(() => {
    const state = runtime.current
    if (!state.dragging && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) state.offset += state.velocity
    const total = VISIBLE_TILES * 2 * TILE_STEP
    while (state.offset < -total) state.offset += total
    while (state.offset > 0) state.offset -= total
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${state.offset}px, 0, 0)`
  }, [])

  useEffect(() => {
    let frame = 0
    let active = true
    const tick = () => {
      if (active) render()
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting })
    if (viewportRef.current) observer.observe(viewportRef.current)
    frame = requestAnimationFrame(tick)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [render])

  const pointerDown = (event: React.PointerEvent) => {
    const state = runtime.current
    state.dragging = true; state.moved = false; state.startX = event.clientX; state.startOffset = state.offset; state.pointerId = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const pointerMove = (event: React.PointerEvent) => {
    const state = runtime.current
    if (!state.dragging || state.pointerId !== event.pointerId) return
    const delta = event.clientX - state.startX
    if (Math.abs(delta) > 5) state.moved = true
    state.offset = state.startOffset + delta
    render()
  }
  const pointerUp = (event: React.PointerEvent) => {
    const state = runtime.current
    if (state.pointerId !== event.pointerId) return
    state.dragging = false; state.pointerId = undefined
    const remainder = state.offset % TILE_STEP
    state.offset += remainder > TILE_STEP / 2 ? TILE_STEP - remainder : -remainder
  }

  return (
    <div ref={viewportRef} className="paint-row" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
      <div ref={trackRef} className="paint-track">
        {Array.from({ length: VISIBLE_TILES }, (_, tileIndex) => {
          const colour = paintColours[(rowIndex * 8 + tileIndex) % paintColours.length]
          const isSelected = selectedId === colour.id
          return <button key={`${rowIndex}-${tileIndex}`} type="button" className={`paint-tile${isSelected ? ' is-selected' : ''}`} style={{ backgroundColor: colour.hex }} aria-label={`Select ${colour.name} paint colour, HEX ${colour.hex}`} onClick={() => !runtime.current.moved && onSelect(colour)} onMouseEnter={() => setHovered(colour.id)} onMouseLeave={() => setHovered(null)}>
            {hovered === colour.id && <span className="tile-tooltip"><strong>{colour.name}</strong><small>{colour.hex}</small></span>}
          </button>
        })}
        {Array.from({ length: VISIBLE_TILES }, (_, tileIndex) => {
          const colour = paintColours[(rowIndex * 8 + tileIndex + VISIBLE_TILES) % paintColours.length]
          return <button key={`${rowIndex}-clone-${tileIndex}`} type="button" aria-hidden="true" tabIndex={-1} className="paint-tile" style={{ backgroundColor: colour.hex }} />
        })}
      </div>
    </div>
  )
}

export function SmartCoatPaintWall() {
  const [selected, setSelected] = useState<PaintColour>(initialColour)
  const [accepted, setAccepted] = useState(false)
  const audioContext = useRef<AudioContext | null>(null)
  const select = (colour: PaintColour) => {
    setSelected(colour)
    setAccepted(false)
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextConstructor) return
    const context = audioContext.current ?? new AudioContextConstructor()
    audioContext.current = context
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(420, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(720, context.currentTime + 0.08)
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.15)
  }
  return <main className="smartcoat-shell">
    <header className="smartcoat-header"><a className="brand-lockup" href="#top" aria-label="SmartCoat home"><img src={LOGO_URL} alt="Walnus Global SmartCoat seal" className="brand-logo" /><span><span className="brand-overline">WALNUS GLOBAL</span><span className="brand-name">SMARTCOAT<span>™</span></span></span></a><div className="system-label">PAINT COLOUR SYSTEM <span className="live-dot" aria-hidden="true" /></div></header>
    <section className="hero-banner" id="top" aria-label="SmartCoat professional paint collection"><img src={HERO_URL} alt="Vivid teal, ivory, black, amber and magenta paint strokes flowing across a dark surface" className="hero-image" /><div className="hero-overlay" /><div className="hero-copy"><span className="hero-kicker">WALNUS GLOBAL / SMARTCOAT</span><h1>Colour with<br /><em>character.</em></h1><p>Professional finishes for spaces that make an impression.</p><a href="#colour-wall" className="hero-cta">EXPLORE THE PALETTE <span>↓</span></a></div></section>
    <section className="selection-bar" aria-live="polite"><div className="selection-swatch" style={{ backgroundColor: selected.hex }} /><div className="selection-copy"><span className="selection-label">SELECTED COLOUR</span><strong>{selected.name}</strong><span className="selection-meta"><code>{selected.hex}</code><span>RGB {selected.rgb}</span></span></div><button type="button" className={`use-colour${accepted ? ' accepted' : ''}`} onClick={() => setAccepted(true)}>{accepted ? <><Check size={14} /> COLOUR ADDED TO PROJECT</> : <>USE COLOUR <span>↗</span></>}</button></section>
    <div className="wall-intro" id="colour-wall"><span>01—24 / SPECTRUM LIBRARY</span><span><MoveHorizontal size={14} /> DRAG ROWS TO EXPLORE</span></div>
    <section className="paint-wall" aria-label="Infinite SmartCoat paint colour wall">{Array.from({ length: ROW_COUNT }, (_, index) => <PaintRow key={index} rowIndex={index} onSelect={select} selectedId={selected.id} />)}</section>
    <footer className="wall-footer"><span>SMARTCOAT™ / MASTER PAINT DATABASE PREVIEW</span><span><Copy size={13} /> 152 COLOURS IN SYSTEM</span></footer>
  </main>
}
