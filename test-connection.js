import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or Key missing in .env file')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyConnection() {
    console.log('Checking connection to:', supabaseUrl)
    const { data, error } = await supabase.from('notes').select('count', { count: 'exact', head: true })

    if (error) {
        console.error('Connection failed ❌')
        console.error('Error details:', error.message)
    } else {
        console.log('Connection successful! ✅')
        console.log('Supabase is responding correctly.')
    }
}

verifyConnection()
