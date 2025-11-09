"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Play, Pause, Square, Radio } from "lucide-react"

interface ControlPanelProps {
  isConnected: boolean
}

const ControlPanel = ({ isConnected }: ControlPanelProps) => {
  const [isRunning, setIsRunning] = useState(false)
  const [feedRate, setFeedRate] = useState(100)
  const [speed, setSpeed] = useState(80)
  const [pressure, setPressure] = useState(60)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hologram border-destructive/30">
          <CardContent className="pt-6">
            <Button
              className="w-full h-24 text-lg font-bold bg-destructive hover:bg-destructive/90 gap-3"
              onClick={() => {
                setIsRunning(false)
              }}
            >
              <Square className="w-6 h-6" />
              EMERGENCY STOP
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70">Connection</span>
              <span
                className={`flex items-center gap-2 font-medium ${isConnected ? "text-secondary" : "text-destructive"}`}
              >
                <Radio className="w-3 h-3" />
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground/70">Status</span>
              <span className={`font-medium ${isRunning ? "text-primary" : "text-muted-foreground"}`}>
                {isRunning ? "Running" : "Ready"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground/70">Temperature</span>
              <span className="text-foreground font-medium">42°C</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="aurora-text">Cutting Parameters</CardTitle>
          <CardDescription>Adjust system parameters for optimal cutting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground/70">Feed Rate</label>
              <span className="text-lg font-bold text-secondary">{feedRate}%</span>
            </div>
            <Slider
              value={[feedRate]}
              onValueChange={(val) => setFeedRate(val[0])}
              min={10}
              max={100}
              step={5}
              disabled={!isConnected}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">Speed at which the cutting tool moves</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground/70">Spindle Speed</label>
              <span className="text-lg font-bold text-primary">{speed}%</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={(val) => setSpeed(val[0])}
              min={20}
              max={100}
              step={5}
              disabled={!isConnected}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">Rotation speed of the cutting wheel</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground/70">Cutting Pressure</label>
              <span className="text-lg font-bold text-accent">{pressure}%</span>
            </div>
            <Slider
              value={[pressure]}
              onValueChange={(val) => setPressure(val[0])}
              min={10}
              max={100}
              step={5}
              disabled={!isConnected}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">Force applied by the gem holder</p>
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button
          onClick={() => setIsRunning(true)}
          disabled={!isConnected || isRunning}
          className="bg-secondary hover:bg-secondary/90 gap-2 h-12"
        >
          <Play className="w-5 h-5" />
          Start
        </Button>

        <Button
          onClick={() => setIsRunning(false)}
          disabled={!isConnected || !isRunning}
          variant="outline"
          className="gap-2 h-12"
        >
          <Pause className="w-5 h-5" />
          Pause
        </Button>

        <Button disabled={!isConnected} variant="outline" className="gap-2 h-12 bg-transparent">
          Resume
        </Button>

        <Button disabled={!isConnected} variant="outline" className="gap-2 h-12 bg-transparent">
          Home Position
        </Button>

        <Button disabled={!isConnected} variant="outline" className="gap-2 h-12 bg-transparent">
          Calibrate
        </Button>

        <Button
          disabled={!isConnected}
          variant="outline"
          className="gap-2 h-12 text-destructive hover:text-destructive bg-transparent"
        >
          Reset
        </Button>
      </div>

      <Card className="card-hologram border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-destructive/80">
            <li>• Ensure gem is properly secured before starting</li>
            <li>• Monitor temperature - stop if exceeds 60°C</li>
            <li>• Spindle must reach stable RPM before cutting</li>
            <li>• Always use emergency stop for anomalies</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default ControlPanel
