"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardScreen from "@/components/screens/dashboard"
import RobotSimulator from "@/components/screens/robot-simulator"
import GemGallery from "@/components/screens/gem-gallery"
import PatternManager from "@/components/screens/pattern-manager"
import ControlPanel from "@/components/screens/control-panel"
import MonitoringScreen from "@/components/screens/monitoring"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-border card-hologram bg-card/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-aurora-text animate-pulse"></div>
            <h1 className="text-2xl font-bold aurora-text glow-text">Robot Gem Cutting System</h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                isConnected
                  ? "bg-accent/30 text-accent border border-accent/50 glow-text"
                  : "bg-destructive/30 text-destructive border border-destructive/50"
              }`}
            >
              {isConnected ? "✨ Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-card border border-border/50 glitter rounded-xl p-1 shadow-lg shadow-primary/10">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 rounded-lg transition-all duration-300"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="simulator"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 rounded-lg transition-all duration-300"
            >
              Simulator
            </TabsTrigger>
            <TabsTrigger
              value="gems"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 rounded-lg transition-all duration-300"
            >
              Gems
            </TabsTrigger>
            <TabsTrigger
              value="patterns"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 rounded-lg transition-all duration-300"
            >
              Patterns
            </TabsTrigger>
            <TabsTrigger
              value="control"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 rounded-lg transition-all duration-300"
            >
              Control
            </TabsTrigger>
            <TabsTrigger
              value="monitor"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 rounded-lg transition-all duration-300"
            >
              Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardScreen />
          </TabsContent>

          <TabsContent value="simulator">
            <RobotSimulator />
          </TabsContent>

          <TabsContent value="gems">
            <GemGallery />
          </TabsContent>

          <TabsContent value="patterns">
            <PatternManager />
          </TabsContent>

          <TabsContent value="control">
            <ControlPanel isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="monitor">
            <MonitoringScreen />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
