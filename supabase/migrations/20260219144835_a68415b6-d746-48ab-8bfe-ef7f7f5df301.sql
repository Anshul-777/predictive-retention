
-- Create churn_predictions table to store all prediction data anonymously
CREATE TABLE public.churn_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  -- Demographics
  gender TEXT NOT NULL,
  senior_citizen INTEGER NOT NULL DEFAULT 0,
  partner TEXT NOT NULL,
  dependents TEXT NOT NULL,
  -- Account Info
  tenure INTEGER NOT NULL,
  contract TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  paperless_billing TEXT NOT NULL,
  monthly_charges DECIMAL(10, 2),
  total_charges DECIMAL(10, 2),
  -- Services
  phone_service TEXT NOT NULL,
  multiple_lines TEXT NOT NULL,
  internet_service TEXT NOT NULL,
  -- Add-ons
  online_security TEXT NOT NULL,
  online_backup TEXT NOT NULL,
  device_protection TEXT NOT NULL,
  tech_support TEXT NOT NULL,
  streaming_tv TEXT NOT NULL,
  streaming_movies TEXT NOT NULL,
  -- Model outputs
  churn_probability DECIMAL(5, 4),
  predicted_churn_status TEXT,
  -- Metadata
  prediction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.churn_predictions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous predictions by session)
CREATE POLICY "Anyone can insert predictions"
ON public.churn_predictions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read predictions (public history)
CREATE POLICY "Anyone can view predictions"
ON public.churn_predictions
FOR SELECT
USING (true);

-- Add index on timestamp for fast sorting
CREATE INDEX idx_churn_predictions_timestamp ON public.churn_predictions(prediction_timestamp DESC);

-- Add index on session_id for filtering by session
CREATE INDEX idx_churn_predictions_session ON public.churn_predictions(session_id);
