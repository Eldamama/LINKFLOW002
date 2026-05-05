import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function testConnection() {
  console.log('🔄 Testing Supabase connection...')
  
  const { data, error } = await supabase
    .from('your_table_name')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Supabase error:', error.message)
    process.exit(1)
  }
  
  console.log('✅ Supabase connected successfully!')
  console.log('📊 Sample data:', data)
}

testConnection()
