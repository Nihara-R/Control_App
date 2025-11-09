"use client"

import { useEffect, useRef } from "react"

interface GemViewer3DProps {
  gemType: string
}

export default function GemViewer3D({ gemType }: GemViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let angle = 0

    const draw = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(88, 28, 135, 0.1)")
      gradient.addColorStop(1, "rgba(139, 92, 246, 0.1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Save context state
      ctx.save()

      // Move to center and rotate
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(angle)

      // Draw 3D gem facets based on type
      const gemColors: Record<string, string> = {
        Sapphire: "#0ea5e9",
        Ruby: "#dc2626",
        Emerald: "#10b981",
        Diamond: "#f3f4f6",
        Topaz: "#f59e0b",
      }

      const color = gemColors[gemType] || "#8b5cf6"

      // Draw faceted gem shape
      ctx.fillStyle = color
      ctx.globalAlpha = 0.8

      // Top facet
      ctx.beginPath()
      ctx.moveTo(-30, -60)
      ctx.lineTo(30, -60)
      ctx.lineTo(40, -30)
      ctx.lineTo(-40, -30)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Middle facets
      ctx.globalAlpha = 0.6
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(-40, -30)
      ctx.lineTo(40, -30)
      ctx.lineTo(60, 20)
      ctx.lineTo(-60, 20)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Bottom facet
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.moveTo(-60, 20)
      ctx.lineTo(60, 20)
      ctx.lineTo(30, 70)
      ctx.lineTo(-30, 70)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Base
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.moveTo(-30, 70)
      ctx.lineTo(30, 70)
      ctx.lineTo(0, 90)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.restore()

      angle += 0.02
      requestAnimationFrame(draw)
    }

    draw()
  }, [gemType])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5"
    />
  )
}
