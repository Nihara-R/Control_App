"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import DashboardScreen from "@/components/screens/dashboard"
import RobotSimulator from "@/components/screens/robot-simulator"
import GemGallery from "@/components/screens/gem-gallery"
import PatternManager from "@/components/screens/pattern-manager"
import ControlPanel from "@/components/screens/control-panel"
import MonitoringScreen from "@/components/screens/monitoring"
import { LogOut } from "lucide-react"

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth")
      } else {
        setUser(session.user)
        setIsConnected(true)
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Status */}
      <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <h1 className="text-2xl font-bold text-white">Robot Gem Cutting System</h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            {user && <span className="text-sm text-slate-300">{user.email}</span>}
            <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-slate-800 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="simulator" className="data-[state=active]:bg-slate-700">
              Simulator
            </TabsTrigger>
            <TabsTrigger value="gems" className="data-[state=active]:bg-slate-700">
              Gems
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-slate-700">
              Patterns
            </TabsTrigger>
            <TabsTrigger value="control" className="data-[state=active]:bg-slate-700">
              Control
            </TabsTrigger>
            <TabsTrigger value="monitor" className="data-[state=active]:bg-slate-700">
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
