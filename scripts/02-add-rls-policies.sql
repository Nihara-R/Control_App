-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutting_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for gems table - Allow authenticated users to manage their own gems
CREATE POLICY "Authenticated users can insert gems"
  ON public.gems
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can view all gems (shared workspace)"
  ON public.gems
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own gems"
  ON public.gems
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own gems"
  ON public.gems
  FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for cutting_patterns table
CREATE POLICY "Authenticated users can insert patterns"
  ON public.cutting_patterns
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can view patterns"
  ON public.cutting_patterns
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own patterns"
  ON public.cutting_patterns
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own patterns"
  ON public.cutting_patterns
  FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for operations_log table
CREATE POLICY "Authenticated users can insert operations"
  ON public.operations_log
  FOR INSERT
  WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Authenticated users can view operations"
  ON public.operations_log
  FOR SELECT
  USING (true);

-- RLS Policies for sensor_data table
CREATE POLICY "Authenticated users can insert sensor data"
  ON public.sensor_data
  FOR INSERT
  USING (true);

CREATE POLICY "Authenticated users can view sensor data"
  ON public.sensor_data
  FOR SELECT
  USING (true);

-- RLS Policies for system_alerts table
CREATE POLICY "Authenticated users can view alerts"
  ON public.system_alerts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON public.system_alerts
  FOR INSERT
  USING (true);
