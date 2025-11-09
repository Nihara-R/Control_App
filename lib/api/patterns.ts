import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function createPattern(patternData: {
  pattern_name: string
  pattern_type: string
  facets: number
  complexity: string
  pattern_data: object
  file_size: string
}) {
  const { data, error } = await supabase.from("cutting_patterns").insert([patternData]).select().single()

  if (error) throw error
  return data
}

export async function getPatterns() {
  const { data, error } = await supabase.from("cutting_patterns").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function updatePatternSuccessRate(id: string, successRate: number) {
  const { data, error } = await supabase
    .from("cutting_patterns")
    .update({ success_rate: successRate })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePattern(id: string) {
  const { error } = await supabase.from("cutting_patterns").delete().eq("id", id)

  if (error) throw error
}
