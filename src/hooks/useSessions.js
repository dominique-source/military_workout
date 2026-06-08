import { useState, useEffect } from 'react'
import { supabase, getDeviceId } from '../lib/supabase'

export function useSessions() {
  const [sessions, setSessions] = useState(() =>
    parseInt(localStorage.getItem('mw_sessions') || '0', 10)
  )
  const [history, setHistory] = useState([])      // array of 'YYYY-MM-DD' strings
  const [durCounts, setDurCounts] = useState({})  // { 25: 3, 26: 1, ... }
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
        setSessions(data.count)
        localStorage.setItem('mw_sessions', data.count)
      }

      // Load history (all sessions, shared)
      const { data: hist } = await supabase
        .from('session_history')
        .select('session_date, work_dur')
        .eq('device_id', 'shared')
        .order('session_date', { ascending: false })

      if (hist) {
        setHistory(hist.map(r => r.session_date))
        // Count sessions per duration
        const counts = {}
        hist.forEach(r => {
          const d = r.work_dur || 25
          counts[d] = (counts[d] || 0) + 1
        })
        setDurCounts(counts)
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
      .upsert({ device_id: 'shared', count: val, updated_at: new Date().toISOString() })
  }

  async function addHistoryEntry(workDur = 25, date = null) {
    const day = date || new Date().toISOString().split('T')[0]
    setHistory(h => h.includes(day) ? h : [day, ...h])
    setDurCounts(c => ({ ...c, [workDur]: (c[workDur] || 0) + 1 }))
    await supabase
      .from('session_history')
      .upsert({ device_id: 'shared', session_date: day, work_dur: workDur }, { onConflict: 'device_id,session_date', ignoreDuplicates: true })
  }

  async function removeHistoryEntry(date) {
    setHistory(h => h.filter(d => d !== date))
    await supabase
      .from('session_history')
      .delete()
      .eq('device_id', 'shared')
      .eq('session_date', date)
  }

  async function toggleHistoryEntry(date) {
    if (history.includes(date)) {
      await removeHistoryEntry(date)
    } else {
      await addHistoryEntry(25, date)
      await save(sessions + 1)
    }
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

  return { sessions, history, durCounts, syncing, increment, decrement, reset, setTo, addHistoryEntry, toggleHistoryEntry }
}
