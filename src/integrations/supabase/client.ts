// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vfklitdsibfrovchiobx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZma2xpdGRzaWJmcm92Y2hpb2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NzIzMTYsImV4cCI6MjA1MjA0ODMxNn0.0Z5CvEhGjKaRh0H7uMvNzZ7Ng_-A5K9wf97QtOQXT_4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);