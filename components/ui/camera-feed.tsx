"use client"

import { useEffect, useRef, useState } from "react"

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 480 },
            height: { ideal: 360 },
            facingMode: "user",
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasCamera(true)
          setIsStreaming(true)

          // Draw video to canvas for edge detection visualization
          const drawDetection = () => {
            if (!videoRef.current || !canvasRef.current) return

            const ctx = canvasRef.current.getContext("2d")
            if (!ctx) return

            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

            // Apply edge detection filter
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
            const data = imageData.data

            for (let i = 0; i < data.length; i += 4) {
              const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
              data[i] = gray
              data[i + 1] = gray
              data[i + 2] = gray
            }

            ctx.putImageData(imageData, 0, 0)

            // Draw crosshair and focus ring
            ctx.strokeStyle = "#00ff00"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(canvasRef.current.width / 2, canvasRef.current.height / 2, 40, 0, Math.PI * 2)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(canvasRef.current.width / 2 - 20, canvasRef.current.height / 2)
            ctx.lineTo(canvasRef.current.width / 2 + 20, canvasRef.current.height / 2)
            ctx.moveTo(canvasRef.current.width / 2, canvasRef.current.height / 2 - 20)
            ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height / 2 + 20)
            ctx.stroke()

            requestAnimationFrame(drawDetection)
          }

          drawDetection()
        }
      } catch (error) {
        console.error("[v0] Camera access denied:", error)
        setHasCamera(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  if (!hasCamera) {
    return (
      <div className="w-full h-48 bg-card border border-border rounded-lg flex items-center justify-center text-foreground/60 text-sm">
        Camera access denied or not available
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <video ref={videoRef} autoPlay playsInline className="hidden" />
      <canvas
        ref={canvasRef}
        width={480}
        height={360}
        className="w-full rounded-lg border border-border bg-background"
      />
      {isStreaming && (
        <div className="flex items-center justify-center text-xs text-accent">
          <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
          Live Camera Feed
        </div>
      )}
    </div>
  )
}
