import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuymqlxkvvgxyxmtrqly.supabase.co';
const supabaseAnonKey = 'sb_publishable_whuoKc6WP4_jScvFF4odUg_Q8Zu3fHg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);