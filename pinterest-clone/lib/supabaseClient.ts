import { createClient } from '@supabase/supabase-js'

// Configuración directa sin variables de entorno
const supabaseUrl = 'https://lygbdgxujnncomdcupwt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Z2JkZ3h1am5uY29tZGN1cHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDYxOTMsImV4cCI6MjA3OTQ4MjE5M30.0W0lsWJ-y7jKUB6VZ2tDCIxhVX6cJm3ntRcjDIizLhU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)