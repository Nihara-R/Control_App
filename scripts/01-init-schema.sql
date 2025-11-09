-- Create tables for the Robotic Gem Cutting System

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'operator' CHECK (role IN ('operator', 'admin', 'technician')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Gems table
CREATE TABLE IF NOT EXISTS gems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  weight DECIMAL(10, 3),
  length DECIMAL(10, 3),
  width DECIMAL(10, 3),
  height DECIMAL(10, 3),
  quality TEXT,
  origin TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'in_progress', 'completed', 'failed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cutting Patterns table
CREATE TABLE IF NOT EXISTS cutting_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  facets INTEGER,
  complexity TEXT CHECK (complexity IN ('low', 'medium', 'high', 'very_high')),
  pattern_data JSONB,
  file_size TEXT,
  success_rate INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Operations Log table
CREATE TABLE IF NOT EXISTS operations_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
  pattern_id UUID NOT NULL REFERENCES cutting_patterns(id),
  operator_id UUID NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'running' CHECK (status IN ('queued', 'running', 'paused', 'completed', 'failed')),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  yield_percentage DECIMAL(5, 2),
  accuracy_mm DECIMAL(5, 3),
  temperature_avg DECIMAL(5, 2),
  vibration_avg DECIMAL(5, 3),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- System Alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  operation_id UUID REFERENCES operations_log(id),
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Sensor Data table for real-time monitoring
CREATE TABLE IF NOT EXISTS sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID NOT NULL REFERENCES operations_log(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2),
  vibration DECIMAL(5, 3),
  pressure DECIMAL(5, 2),
  feed_rate DECIMAL(5, 2),
  spindle_speed DECIMAL(5, 2),
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gems_status ON gems(status);
CREATE INDEX IF NOT EXISTS idx_gems_created_by ON gems(created_by);
CREATE INDEX IF NOT EXISTS idx_operations_gem_id ON operations_log(gem_id);
CREATE INDEX IF NOT EXISTS idx_operations_status ON operations_log(status);
CREATE INDEX IF NOT EXISTS idx_sensor_operation ON sensor_data(operation_id);
CREATE INDEX IF NOT EXISTS idx_alerts_operation ON system_alerts(operation_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
