import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function createOperation(operationData: {
  gem_id: string
  pattern_id: string
  operator_id: string
  start_time: string
}) {
  const { data, error } = await supabase.from("operations_log").insert([operationData]).select().single()

  if (error) throw error
  return data
}

export async function updateOperationStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("operations_log")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function logSensorData(
  operationId: string,
  sensorData: {
    temperature: number
    vibration: number
    pressure: number
    feed_rate: number
    spindle_speed: number
  },
) {
  const { data, error } = await supabase
    .from("sensor_data")
    .insert([
      {
        operation_id: operationId,
        ...sensorData,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeOperation(
  id: string,
  results: {
    end_time: string
    yield_percentage: number
    accuracy_mm: number
    temperature_avg: number
    vibration_avg: number
  },
) {
  const { data, error } = await supabase
    .from("operations_log")
    .update({
      status: "completed",
      ...results,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOperationHistory() {
  const { data, error } = await supabase
    .from("operations_log")
    .select(`
      *,
      gems (*),
      cutting_patterns (*),
      users (*)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function createSystemAlert(alertData: {
  alert_type: string
  message: string
  operation_id?: string
}) {
  const { data, error } = await supabase.from("system_alerts").insert([alertData]).select().single()

  if (error) throw error
  return data
}
