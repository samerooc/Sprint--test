import { createClient } from '@supabase/supabase-js'

// APNA CONFIG YAHA PASTE KARO
const supabaseUrl = 'https://yejzsnrxshqkwvkjedvb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllanpzbnJ4c2hxa3d2a2plZHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTI3NTMsImV4cCI6MjA4NjMyODc1M30.ShlcL5wFp-GPh5dHigrOi_ve0u1qfAQ9H0BTDN-Fj9g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) throw error
    console.log('✅ Supabase connected!')
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}