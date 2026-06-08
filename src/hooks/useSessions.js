import { useState, useEffect } from 'react'
import { supabase, getDeviceId } from '../lib/supabase'

export function useSessions() {
  const [sessions, setSessions] = useState(() =>
    parseInt(localStorage.getItem('mw_sessions') || '0', 10)
  )
  const [history, setHistory] = useState([])   // array of 'YYYY-MM-DD' strings
  const [syncing, setSyncing] = useState(false)
  const deviceId = getDeviceId()

  // Load from Supabase on mount
  useEffect(() => {
    async function load() {
      setSyncing(true)

      // Load count
      const { data, error } = await supabase
        .from('sessions')
        .select('count')
        .eq('device_id', 'shared')
        .single()

      if (!error && data) {
        const remote = data.count
        const local = parseInt(localStorage.getItem('mw_sessions') || '0', 10)
        const best = Math.max(remote, local)
        setSessions(best)
        localStorage.setItem('mw_sessions', best)
      }

      // Load history (last 35 days, shared)
      const { data: hist } = await supabase
        .from('session_history')
        .select('session_date')
        .eq('device_id', 'shared')
        .order('session_date', { ascending: false })

      if (hist) setHistory(hist.map(r => r.session_date))

      setSyncing(false)
    }
    load()
  }, [deviceId])

  async function save(val) {
    localStorage.setItem('mw_sessions', val)
    setSessions(val)
    await supabase
      .from('sessions')
      .upsert({ device_id: 'shared', count: val, updated_at: new Date().toISOString() })
  }

  async function addHistoryEntry() {
    const today = new Date().toISOString().split('T')[0]
    // Always update local state immediately
    setHistory(h => h.includes(today) ? h : [today, ...h])
    // Upsert to avoid duplicate key errors in DB
    await supabase
      .from('session_history')
      .upsert({ device_id: 'shared', session_date: today }, { onConflict: 'device_id,session_date', ignoreDuplicates: true })
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

  return { sessions, history, syncing, increment, decrement, reset, setTo, addHistoryEntry }
}
