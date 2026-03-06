'use client'
import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
}

export function Particles({
  className = '',
  quantity = 60,
  color = '#4338CA',
  minSize = 0.5,
  maxSize = 2,
  speed = 0.3,
}: {
  className?: string
  quantity?: number
  color?: string
  minSize?: number
  maxSize?: number
  speed?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)

  const parseColor = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { r, g, b } = parseColor(color)
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const spawn = () => {
      particles = Array.from({ length: quantity }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.4 + 0.05,
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`
        ctx.fill()
      }
      raf.current = requestAnimationFrame(tick)
    }

    resize()
    spawn()
    tick()

    const parent = canvas.parentElement
    if (!parent) return
    const ro = new ResizeObserver(() => { resize(); spawn() })
    ro.observe(parent)

    return () => {
      cancelAnimationFrame(raf.current)
      ro.disconnect()
    }
  }, [quantity, color, minSize, maxSize, speed, parseColor])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
