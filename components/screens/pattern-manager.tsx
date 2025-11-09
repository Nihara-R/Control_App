"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Eye } from "lucide-react"
import { getPatterns, deletePattern } from "@/lib/api/patterns"
import { useToast } from "@/hooks/use-toast"

interface Pattern {
  id: string
  pattern_name: string
  pattern_type: string
  facets: number
  complexity: string
  file_size: string
  success_rate: number
  created_at: string
}

const PatternManager = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPatterns()
  }, [])

  const loadPatterns = async () => {
    try {
      setLoading(true)
      const data = await getPatterns()
      setPatterns(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load patterns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePattern = async (id: string) => {
    try {
      await deletePattern(id)
      setPatterns(patterns.filter((p) => p.id !== id))
      toast({
        title: "Success",
        description: "Pattern deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pattern",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="card-hologram">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading patterns...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="card-hologram">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="aurora-text">Cutting Patterns</CardTitle>
              <CardDescription>3D cutting patterns for gem processing</CardDescription>
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Upload className="w-4 h-4" />
              Upload Pattern
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/50 transition-colors glitter"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{pattern.pattern_name}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-primary/30 text-primary">
                        {pattern.pattern_type}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          pattern.complexity === "low"
                            ? "bg-secondary/30 text-secondary"
                            : pattern.complexity === "high"
                              ? "bg-accent/30 text-accent"
                              : pattern.complexity === "very_high"
                                ? "bg-destructive/30 text-destructive"
                                : "bg-primary/30 text-primary"
                        }`}
                      >
                        {pattern.complexity}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Facets:</span>
                        <p className="text-foreground font-medium">{pattern.facets}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">File Size:</span>
                        <p className="text-foreground font-medium">{pattern.file_size}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <p className="text-secondary font-medium">{pattern.success_rate}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="text-foreground font-medium">
                          {new Date(pattern.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePattern(pattern.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold aurora-text">{patterns.length}</p>
          </CardContent>
        </Card>
        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {patterns.length > 0 ? Math.round(patterns.reduce((a, b) => a + b.success_rate, 0) / patterns.length) : 0}
              %
            </p>
          </CardContent>
        </Card>
        <Card className="card-hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Facets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{patterns.reduce((a, b) => a + b.facets, 0)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PatternManager
