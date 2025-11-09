"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

const RobotSimulator = () => {
  const [jointAngles, setJointAngles] = useState({
    base: 0,
    shoulder: 45,
    elbow: 90,
    wrist: 0,
  })

  const [isAnimating, setIsAnimating] = useState(false)
  const [cuttingProgress, setCuttingProgress] = useState(0)

  const updateJoint = (joint: string, value: number[]) => {
    setJointAngles((prev) => ({
      ...prev,
      [joint]: value[0],
    }))
  }

  const simulateCutting = () => {
    setIsAnimating(true)
    setCuttingProgress(0)

    const interval = setInterval(() => {
      setCuttingProgress((prev) => {
        if (prev >= 100) {
          setIsAnimating(false)
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const resetSimulation = () => {
    setJointAngles({
      base: 0,
      shoulder: 45,
      elbow: 90,
      wrist: 0,
    })
    setCuttingProgress(0)
    setIsAnimating(false)
  }

  // Simple SVG Robot Arm Visualization
  const RobotArm = () => {
    const baseRotation = jointAngles.base
    const shoulderAngle = jointAngles.shoulder
    const elbowAngle = jointAngles.elbow
    const wristAngle = jointAngles.wrist

    // Calculate joint positions (simplified kinematics)
    const base = { x: 250, y: 300 }
    const shoulder = {
      x: base.x + 80 * Math.cos(((shoulderAngle - 90) * Math.PI) / 180),
      y: base.y + 80 * Math.sin(((shoulderAngle - 90) * Math.PI) / 180),
    }
    const elbow = {
      x: shoulder.x + 70 * Math.cos(((shoulderAngle + elbowAngle - 90) * Math.PI) / 180),
      y: shoulder.y + 70 * Math.sin(((shoulderAngle + elbowAngle - 90) * Math.PI) / 180),
    }
    const wrist = {
      x: elbow.x + 50 * Math.cos(((shoulderAngle + elbowAngle + wristAngle - 90) * Math.PI) / 180),
      y: elbow.y + 50 * Math.sin(((shoulderAngle + elbowAngle + wristAngle - 90) * Math.PI) / 180),
    }

    return (
      <svg
        width="100%"
        height="400"
        viewBox="0 0 500 400"
        className="bg-gradient-to-br from-purple-950/30 via-black/50 to-blue-950/30 rounded-lg border border-primary/20 glitter"
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="500" height="400" fill="url(#grid)" />

        {/* Base */}
        <circle cx={base.x} cy={base.y} r="15" fill="#1f1f2e" stroke="#a855f7" strokeWidth="2" />

        {/* Links */}
        <line
          x1={base.x}
          y1={base.y}
          x2={shoulder.x}
          y2={shoulder.y}
          stroke="#c084fc"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1={shoulder.x}
          y1={shoulder.y}
          x2={elbow.x}
          y2={elbow.y}
          stroke="#a78bfa"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1={elbow.x}
          y1={elbow.y}
          x2={wrist.x}
          y2={wrist.y}
          stroke="#7c3aed"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Joints */}
        <circle cx={shoulder.x} cy={shoulder.y} r="8" fill="#1f1f2e" stroke="#c084fc" strokeWidth="2" />
        <circle cx={elbow.x} cy={elbow.y} r="7" fill="#1f1f2e" stroke="#a78bfa" strokeWidth="2" />
        <circle cx={wrist.x} cy={wrist.y} r="6" fill="#1f1f2e" stroke="#7c3aed" strokeWidth="2" />

        {/* End Effector (Gem Holder) */}
        <circle cx={wrist.x} cy={wrist.y} r="12" fill="none" stroke="#06b6d4" strokeWidth="3" />
        <circle cx={wrist.x} cy={wrist.y} r="8" fill="#06b6d4" opacity="0.4" />

        {/* Cutting Tool (Fixed) */}
        <rect x="400" y="200" width="60" height="40" fill="#ec4899" opacity="0.8" stroke="#be185d" strokeWidth="2" />
        <text x="430" y="225" textAnchor="middle" fill="#fff" fontSize="12">
          Cutter
        </text>

        {/* Cutting Progress */}
        {cuttingProgress > 0 && (
          <line
            x1={wrist.x}
            y1={wrist.y}
            x2={400}
            y2={220}
            stroke="#06b6d4"
            strokeWidth="2"
            opacity={cuttingProgress > 50 ? 0.3 : 0.8}
            strokeDasharray="5,5"
          />
        )}
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="aurora-text">3D Robot Arm Simulator</CardTitle>
          <CardDescription>Interactive joint control and cutting simulation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-950/20 via-black/30 to-blue-950/20 rounded-lg p-4 border border-primary/20 glitter">
              <RobotArm />
            </div>

            {/* Joint Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground/90">Base Rotation: {jointAngles.base}°</label>
                  <Slider
                    value={[jointAngles.base]}
                    onValueChange={(val) => updateJoint("base", val)}
                    min={-180}
                    max={180}
                    step={1}
                    className="mt-2"
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/90">Shoulder: {jointAngles.shoulder}°</label>
                  <Slider
                    value={[jointAngles.shoulder]}
                    onValueChange={(val) => updateJoint("shoulder", val)}
                    min={0}
                    max={180}
                    step={1}
                    className="mt-2"
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/90">Elbow: {jointAngles.elbow}°</label>
                  <Slider
                    value={[jointAngles.elbow]}
                    onValueChange={(val) => updateJoint("elbow", val)}
                    min={0}
                    max={180}
                    step={1}
                    className="mt-2"
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/90">Wrist: {jointAngles.wrist}°</label>
                  <Slider
                    value={[jointAngles.wrist]}
                    onValueChange={(val) => updateJoint("wrist", val)}
                    min={-180}
                    max={180}
                    step={1}
                    className="mt-2"
                    disabled={isAnimating}
                  />
                </div>
              </div>

              {/* Cutting Progress */}
              <div className="space-y-4">
                <Card className="card-hologram">
                  <CardHeader>
                    <CardTitle className="text-sm aurora-text">Cutting Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-foreground/70">Progress</span>
                        <span className="text-sm font-bold text-secondary">{cuttingProgress}%</span>
                      </div>
                      <div className="w-full bg-primary/20 rounded-full h-3 overflow-hidden border border-primary/30">
                        <div
                          className="bg-gradient-to-r from-secondary via-accent to-secondary h-full transition-all duration-300 glitter"
                          style={{ width: `${cuttingProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-foreground/60">Status: </span>
                        <span className={isAnimating ? "text-primary font-bold" : "text-foreground/40"}>
                          {isAnimating ? "● Cutting in progress" : "○ Ready"}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-foreground/60">Estimated Time: </span>
                        <span className="text-foreground/80">{Math.round((100 - cuttingProgress) * 0.5)}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={simulateCutting}
                    disabled={isAnimating}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    Start Cutting
                  </Button>
                  <Button onClick={resetSimulation} variant="outline" className="flex-1 bg-transparent">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RobotSimulator
