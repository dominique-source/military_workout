import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Generate or retrieve a unique device ID
export function getDeviceId() {
  let id = localStorage.getItem('mw_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('mw_device_id', id)
  }
  return id
}
