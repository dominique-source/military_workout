import { useState, useEffect } from 'react'
import { supabase, getDeviceId } from '../lib/supabase'

export function useSessions() {
  const [sessions, setSessions] = useState(0)
  const [history, setHistory]   = useState([])      // array of 'YYYY-MM-DD' strings
  const [durCounts, setDurCounts] = useState({})    // { 25: 3, 26: 1, ... }
  const [syncing, setSyncing]   = useState(false)
  const deviceId = getDeviceId()

  // ── Load from Supabase on mount ───────────────────────────
  useEffect(() => {
    async function load() {
      setSyncing(true)

      // Load history — sessions count IS derived from history length
      const { data: hist } = await supabase
        .from('session_history')
        .select('session_date, work_dur')
        .eq('device_id', 'shared')
        .order('session_date', { ascending: false })

      if (hist) {
        const dates = hist.map(r => r.session_date)
        setHistory(dates)
        setSessions(dates.length)
        localStorage.setItem('mw_sessions', dates.length)

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

  // ── Add a completed workout ───────────────────────────────
  async function addHistoryEntry(workDur = 25, date = null) {
    const day = date || new Date().toISOString().split('T')[0]
    if (history.includes(day)) return

    setHistory(h => [day, ...h])
    setSessions(s => s + 1)
    setDurCounts(c => ({ ...c, [workDur]: (c[workDur] || 0) + 1 }))

    await supabase
      .from('session_history')
      .upsert(
        { device_id: 'shared', session_date: day, work_dur: workDur },
        { onConflict: 'device_id,session_date', ignoreDuplicates: true }
      )
  }

  // ── Remove a workout from history ─────────────────────────
  async function removeHistoryEntry(date) {
    setHistory(h => {
      const next = h.filter(d => d !== date)
      setSessions(next.length)
      localStorage.setItem('mw_sessions', next.length)
      return next
    })

    await supabase
      .from('session_history')
      .delete()
      .eq('device_id', 'shared')
      .eq('session_date', date)
  }

  // ── Toggle a day (long press on calendar) ─────────────────
  async function toggleHistoryEntry(date) {
    if (history.includes(date)) {
      await removeHistoryEntry(date)
    } else {
      await addHistoryEntry(25, date)
    }
  }

  // ── Kept for compatibility ────────────────────────────────
  async function increment() { await addHistoryEntry() }
  async function decrement() { if (sessions > 0) setSessions(s => s - 1) }
  async function reset()     { setSessions(0); setHistory([]); setDurCounts({}) }
  async function setTo(val)  { setSessions(Math.max(0, Math.min(100, val))) }

  return { sessions, history, durCounts, syncing, increment, decrement, reset, setTo, addHistoryEntry, toggleHistoryEntry }
}
