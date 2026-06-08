import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://gbssoaqdfjgbshcwkcpa.supabase.co',
  'sb_publishable_B6K5tuvSXJgQ1yyf6l8ugg_Kt9ZpMo4'
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
