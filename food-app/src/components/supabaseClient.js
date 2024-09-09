// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocmFnYWlvZnV5Y3Zpc3BhZ3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzOTAwMDYsImV4cCI6MjAzOTk2NjAwNn0.q6YpfsNcv-GILtwVV2k08oA9E6GtOkObriVd_bwErkk';
const SUPABASE_URL = "https://chragaiofuycvispagvj.supabase.co"
export const supabase = createClient(SUPABASE_URL,SUPABASE_KEY);
console.log(supabase);


