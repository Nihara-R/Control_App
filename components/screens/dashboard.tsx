"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const Dashboard = () => {
  const [stats, setStats] = useState({
    gemsProcessed: 1247,
    successRate: 94.2,
    materialSavings: 34.5,
    avgPrecision: 0.08,
  })

  const [chartData, setChartData] = useState([
    { time: "10:00", precision: 0.08, yield: 94 },
    { time: "10:30", precision: 0.07, yield: 96 },
    { time: "11:00", precision: 0.09, yield: 92 },
    { time: "11:30", precision: 0.06, yield: 98 },
    { time: "12:00", precision: 0.08, yield: 95 },
    { time: "12:30", precision: 0.07, yield: 97 },
  ])

  const [recentOperations, setRecentOperations] = useState([
    { id: 1, gem: "Ruby #4521", status: "Completed", time: "2 min ago", yield: 96 },
    { id: 2, gem: "Sapphire #4520", status: "Completed", time: "15 min ago", yield: 94 },
    { id: 3, gem: "Emerald #4519", status: "In Progress", time: "Running", yield: 92 },
    { id: 4, gem: "Diamond #4518", status: "Completed", time: "45 min ago", yield: 98 },
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hologram hover:shadow-lg hover:shadow-primary/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gems Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold aurora-text">{stats.gemsProcessed}</div>
            <p className="text-xs text-muted-foreground mt-1">+45 this week</p>
          </CardContent>
        </Card>

        <Card className="card-hologram hover:shadow-lg hover:shadow-primary/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.successRate}%</div>
            <Progress value={stats.successRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="card-hologram hover:shadow-lg hover:shadow-primary/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Material Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.materialSavings}%</div>
            <p className="text-xs text-muted-foreground mt-1">vs manual cutting</p>
          </CardContent>
        </Card>

        <Card className="card-hologram hover:shadow-lg hover:shadow-primary/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Precision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">±{stats.avgPrecision}mm</div>
            <p className="text-xs text-muted-foreground mt-1">Target: ±0.1mm</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="aurora-text">Precision Over Time</CardTitle>
            <CardDescription>Cutting accuracy trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hologram">
          <CardHeader>
            <CardTitle className="aurora-text">Yield Efficiency</CardTitle>
            <CardDescription>Material yield percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="yield"
                  stroke="var(--secondary)"
                  fillOpacity={1}
                  fill="url(#colorYield)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Operations */}
      <Card className="card-hologram">
        <CardHeader>
          <CardTitle className="aurora-text">Recent Operations</CardTitle>
          <CardDescription>Latest gem cutting processes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOperations.map((op) => (
              <div
                key={op.id}
                className="flex items-center justify-between p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors border border-border/30"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{op.gem}</p>
                  <p className="text-sm text-muted-foreground">{op.time}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      op.status === "Completed" ? "bg-secondary/30 text-secondary" : "bg-primary/30 text-primary"
                    }`}
                  >
                    {op.status}
                  </span>
                  <span className="text-sm font-medium text-accent">Yield: {op.yield}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
