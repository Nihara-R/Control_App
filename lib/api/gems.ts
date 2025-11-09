import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function uploadGemImage(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload-gem", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error("[v0] Error uploading gem image:", error)
    throw error
  }
}

export async function createGem(gemData: {
  gem_id: string
  type: string
  weight: number
  length: number
  width: number
  height: number
  quality: string
  origin: string
  image_url?: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const gemWithUser = {
    ...gemData,
    created_by: user.id,
    status: "pending",
  }

  const { data, error } = await supabase.from("gems").insert([gemWithUser]).select().single()

  if (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
  return data
}

export async function getGems() {
  const { data, error } = await supabase.from("gems").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getGemById(id: string) {
  const { data, error } = await supabase.from("gems").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function updateGemStatus(id: string, status: string) {
  const { data, error } = supabase
    .from("gems")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGem(id: string) {
  const { error } = await supabase.from("gems").delete().eq("id", id)

  if (error) throw error
}
