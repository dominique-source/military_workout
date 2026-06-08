import { useState, useEffect } from 'react'
import { supabase, getDeviceId } from '../lib/supabase'

export function useSessions() {
  const [sessions, setSessions] = useState(() =>
    parseInt(localStorage.getItem('mw_sessions') || '0', 10)
  )
  const [syncing, setSyncing] = useState(false)
  const deviceId = getDeviceId()

  // Load from Supabase on mount
  useEffect(() => {
    async function load() {
      setSyncing(true)
      const { data, error } = await supabase
        .from('sessions')
        .select('count')
        .eq('device_id', deviceId)
        .single()

      if (!error && data) {
        const remote = data.count
        const local = parseInt(localStorage.getItem('mw_sessions') || '0', 10)
        const best = Math.max(remote, local)
        setSessions(best)
        localStorage.setItem('mw_sessions', best)
      }
      setSyncing(false)
    }
    load()
  }, [deviceId])

  async function save(val) {
    localStorage.setItem('mw_sessions', val)
    setSessions(val)
    await supabase
      .from('sessions')
      .upsert({ device_id: deviceId, count: val, updated_at: new Date().toISOString() })
  }

  async function increment() {
    if (sessions >= 100) return
    await save(sessions + 1)
  }

  async function decrement() {
    if (sessions <= 0) return
    await save(sessions - 1)
  }

  async function reset() {
    await save(0)
  }

  async function setTo(val) {
    await save(Math.max(0, Math.min(100, val)))
  }

  return { sessions, syncing, increment, decrement, reset, setTo }
}
