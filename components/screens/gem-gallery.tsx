"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Camera } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { createGem, getGems, deleteGem, uploadGemImage } from "@/lib/api/gems"
import GemViewer3D from "@/components/ui/gem-viewer-3d"
import CameraFeed from "@/components/ui/camera-feed"

interface Gem {
  id: string
  gem_id: string
  type: string
  weight: number
  length: number
  width: number
  height: number
  quality: string
  origin: string
  image_url: string
  status: string
  created_at: string
}

const GemGallery = () => {
  const [gems, setGems] = useState<Gem[]>([])
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadGems()
  }, [])

  const loadGems = async () => {
    try {
      setLoading(true)
      const data = await getGems()
      setGems(data)
      if (data.length > 0) {
        setSelectedGem(data[0])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gems",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      console.log("[v0] Starting upload for file:", file.name)
      const imageUrl = await uploadGemImage(file)
      console.log("[v0] Upload successful, URL:", imageUrl)

      const newGem = await createGem({
        gem_id: `GEM-${Date.now()}`,
        type: "Sapphire",
        weight: 2.5,
        length: 8.5,
        width: 6.2,
        height: 3.8,
        quality: "VS1",
        origin: "Unknown",
        image_url: imageUrl,
      })

      setGems([newGem, ...gems])
      setSelectedGem(newGem)
      toast({
        title: "Success",
        description: "Gem uploaded successfully",
      })
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload gem",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteGem = async (id: string) => {
    try {
      await deleteGem(id)
      setGems(gems.filter((g) => g.id !== id))
      if (selectedGem?.id === id) {
        setSelectedGem(gems[0] || null)
      }
      toast({
        title: "Success",
        description: "Gem deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gem",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="card-hologram">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading gems...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="card-hologram h-full">
            <CardHeader>
              <CardTitle className="text-base aurora-text flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Live Camera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CameraFeed />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="card-hologram">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="aurora-text">Gem Inventory</CardTitle>
                  <CardDescription>Manage and process gemstones</CardDescription>
                </div>
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Button asChild className="bg-primary hover:bg-primary/90 gap-2 cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Upload Gem"}
                    </span>
                  </Button>
                </label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gems.map((gem) => (
                  <div
                    key={gem.id}
                    onClick={() => setSelectedGem(gem)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all glitter ${
                      selectedGem?.id === gem.id
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card/50 hover:border-primary/50"
                    }`}
                  >
                    <div className="relative aspect-square mb-2 rounded overflow-hidden bg-primary/10 border border-border">
                      {gem.image_url ? (
                        <Image
                          src={gem.image_url || "/placeholder.svg"}
                          alt={gem.gem_id}
                          fill
                          className="object-cover"
                          priority
                          onError={(e) => {
                            console.log("[v0] Image load error for:", gem.image_url)
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/50">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm text-foreground truncate">{gem.gem_id}</h3>
                    <p className="text-xs text-foreground/60">{gem.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card className="card-hologram">
            <CardHeader>
              <CardTitle className="text-lg aurora-text">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedGem ? (
                <>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-primary/10 border border-border">
                    {selectedGem.image_url ? (
                      <Image
                        src={selectedGem.image_url || "/placeholder.svg"}
                        alt={selectedGem.gem_id}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/50">No Image</div>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-foreground/60">ID</p>
                      <p className="font-medium text-foreground">{selectedGem.gem_id}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Type</p>
                      <p className="font-medium text-foreground">{selectedGem.type}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Weight</p>
                      <p className="font-medium text-foreground">{selectedGem.weight} ct</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Dimensions</p>
                      <p className="font-medium text-foreground">
                        {selectedGem.length} × {selectedGem.width} × {selectedGem.height} mm
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDeleteGem(selectedGem.id)}
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              ) : (
                <p className="text-foreground/60">No gem selected</p>
              )}
            </CardContent>
          </Card>

          {/* 3D Gem Viewer */}
          <Card className="card-hologram">
            <CardHeader>
              <CardTitle className="text-base aurora-text">3D Model</CardTitle>
            </CardHeader>
            <CardContent>{selectedGem && <GemViewer3D gemType={selectedGem.type} />}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GemGallery
