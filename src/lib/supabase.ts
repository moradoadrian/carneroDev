import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sdobjolxazkvbsakzwcl.supabase.co'
const supabaseKey = 'sb_publishable_O51sgtbrGi48EakI2_z-5w_3QI7bef8'

export const supabase = createClient(supabaseUrl, supabaseKey)