// supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import config from './config';

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
