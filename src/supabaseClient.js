import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cnpbefvzeoegppfzvqui.supabase.co'
const supabaseKey = 'sb_publishable_5kxj0kJWZumqbez8lvMs9g_qTQWVAQL'

export const supabase = createClient(supabaseUrl, supabaseKey)