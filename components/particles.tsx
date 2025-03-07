"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface ParticlesProps {
  className?: string
}

export const Particles: React.FC<ParticlesProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      radius: number
      dx: number
      dy: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 9000)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.beginPath()
      particles.forEach((particle) => {
        ctx.moveTo(particle.x, particle.y)
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        particle.x += particle.dx
        particle.y += particle.dy
        if (particle.x < 0 || particle.x > canvas.width) particle.dx = -particle.dx
        if (particle.y < 0 || particle.y > canvas.height) particle.dy = -particle.dy
      })
      ctx.fill()
      animationFrameId = requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    drawParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme, mounted])

  if (!mounted) return null

  return <canvas ref={canvasRef} className={className} />
}

