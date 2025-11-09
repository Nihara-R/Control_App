"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

const MonitoringScreen = () => {
  const [realTimeData, setRealTimeData] = useState([
    { time: "12:00", temp: 38, vibration: 0.2, pressure: 55 },
    { time: "12:05", temp: 40, vibration: 0.25, pressure: 58 },
    { time: "12:10", temp: 42, vibration: 0.22, pressure: 60 },
    { time: "12:15", temp: 44, vibration: 0.28, pressure: 62 },
    { time: "12:20", temp: 45, vibration: 0.3, pressure: 65 },
  ])

  const [performanceData] = useState([
    { phase: "Roughing", accuracy: 0.15, yield: 85 },
    { phase: "Shaping", accuracy: 0.1, yield: 91 },
    { phase: "Fine Cut", accuracy: 0.05, yield: 96 },
    { phase: "Polish", accuracy: 0.02, yield: 99 },
  ])

  const [alerts, setAlerts] = useState([
    { id: 1, type: "warning", message: "Temperature rising - monitor spindle", time: "2 min ago" },
    { id: 2, type: "info", message: "Pattern loaded successfully", time: "5 min ago" },
    { id: 3, type: "success", message: "Cutting pass 3/5 completed", time: "8 min ago" },
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Stats */}
        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">45°C</div>
            <p className="text-xs text-muted-foreground mt-1">Normal range: 30-50°C</p>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Vibration Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">0.30 mm</div>
            <p className="text-xs text-muted-foreground mt-1">Acceptable: &lt; 0.5 mm</p>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold aurora-text">±0.06 mm</div>
            <p className="text-xs text-muted-foreground mt-1">Target: ±0.1 mm</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="aurora-text">Real-Time Monitoring</CardTitle>
            <CardDescription>Temperature and vibration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="var(--accent)"
                  name="Temp (°C)"
                  dot={{ fill: "var(--accent)", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke="var(--primary)"
                  name="Vibration (mm)"
                  yAxisId="right"
                  dot={{ fill: "var(--primary)", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="aurora-text">Accuracy by Phase</CardTitle>
            <CardDescription>Precision metrics for each cutting phase</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="phase" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="accuracy" fill="var(--primary)" name="Accuracy (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="aurora-text">System Activity Log</CardTitle>
          <CardDescription>Real-time alerts and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 glitter"
              >
                <div className="mt-1">
                  {alert.type === "warning" && <AlertCircle className="w-5 h-5 text-accent" />}
                  {alert.type === "success" && <CheckCircle className="w-5 h-5 text-secondary" />}
                  {alert.type === "info" && <Clock className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Processing Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground/60">Elapsed</span>
              <span className="font-bold text-foreground">12m 34s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Remaining</span>
              <span className="font-bold text-primary">8m 26s</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Current Pass</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground/60">Phase</span>
              <span className="font-bold text-foreground">Fine Cut</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Progress</span>
              <span className="font-bold text-secondary">65%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Quality Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground/60">Score</span>
              <span className="font-bold text-accent">94/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Status</span>
              <span className="font-bold text-secondary">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MonitoringScreen
