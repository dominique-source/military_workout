import { useState, useEffect } from 'react'
import { supabase, getDeviceId } from '../lib/supabase'

export function useSessions() {
  const [sessions, setSessions] = useState(0)
  const [history, setHistory]   = useState([])      // array of { date, work_dur, profiles }
  const [durCounts, setDurCounts] = useState({})    // { 25: 3, 26: 1, ... }
  const [streakCounts, setStreakCounts] = useState({ 3: 0, 4: 0, 5: 0 }) // consecutive day streaks
  const [syncing, setSyncing]   = useState(false)
  const deviceId = getDeviceId()

  // ── Calcule combien de fois un streak de longueur K a été atteint ──
  function calcStreaks(dates) {
    if (!dates.length) return { 3: 0, 4: 0, 5: 0 }
    const sorted = [...dates].sort()
    const runs = []
    let run = [sorted[0]]
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000
      if (diff === 1) run.push(sorted[i])
      else { runs.push(run); run = [sorted[i]] }
    }
    runs.push(run)
    const counts = { 3: 0, 4: 0, 5: 0 }
    runs.forEach(r => [3, 4, 5].forEach(k => { counts[k] += Math.floor(r.length / k) }))
    return counts
  }

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
        setHistory(hist.map(r => ({
          date: r.session_date,
          work_dur: r.work_dur || 25,
          profiles: r.profiles || [],
        })))
        setSessions(dates.length)
        localStorage.setItem('mw_sessions', dates.length)

        // Count sessions per duration
        const counts = {}
        hist.forEach(r => {
          const d = r.work_dur || 25
          counts[d] = (counts[d] || 0) + 1
        })
        setDurCounts(counts)
        setStreakCounts(calcStreaks(dates))
      }

      setSyncing(false)
    }
    load()
  }, [deviceId])

  // ── Add a completed workout ───────────────────────────────
  async function addHistoryEntry(workDur = 25, date = null, profiles = []) {
    const day = date || new Date().toISOString().split('T')[0]
    if (history.find(h => h.date === day)) return

    const entry = { date: day, work_dur: workDur, profiles }
    setHistory(h => {
      const next = [entry, ...h]
      setStreakCounts(calcStreaks(next.map(e => e.date)))
      return next
    })
    setSessions(s => s + 1)
    setDurCounts(c => ({ ...c, [workDur]: (c[workDur] || 0) + 1 }))

    await supabase
      .from('session_history')
      .upsert(
        { device_id: 'shared', session_date: day, work_dur: workDur, profiles },
        { onConflict: 'device_id,session_date', ignoreDuplicates: true }
      )
  }

  // ── Remove a workout from history ─────────────────────────
  async function removeHistoryEntry(date) {
    setHistory(h => {
      const next = h.filter(e => e.date !== date)
      setSessions(next.length)
      localStorage.setItem('mw_sessions', next.length)
      setStreakCounts(calcStreaks(next.map(e => e.date)))
      return next
    })

    await supabase
      .from('session_history')
      .delete()
      .eq('device_id', 'shared')
      .eq('session_date', date)
  }

  // ── Toggle a day (long press on calendar) ─────────────────
  async function updateHistoryEntry(date, newProfiles, newWorkDur) {
    setHistory(h => {
      const next = h.map(e => e.date === date ? { ...e, profiles: newProfiles, work_dur: newWorkDur } : e)
      // Recalculate durCounts from updated history
      const counts = {}
      next.forEach(e => {
        const d = e.work_dur || 25
        counts[d] = (counts[d] || 0) + 1
      })
      setDurCounts(counts)
      return next
    })
    await supabase
      .from('session_history')
      .update({ profiles: newProfiles, work_dur: newWorkDur })
      .eq('device_id', 'shared')
      .eq('session_date', date)
  }

  async function toggleHistoryEntry(date) {
    if (history.find(h => h.date === date)) {
      await removeHistoryEntry(date)
    } else {
      await addHistoryEntry(25, date, [])
    }
  }

  // ── Kept for compatibility ────────────────────────────────
  async function increment() { await addHistoryEntry() }
  async function decrement() { if (sessions > 0) setSessions(s => s - 1) }
  async function reset()     { setSessions(0); setHistory([]); setDurCounts({}) }
  async function setTo(val)  { setSessions(Math.max(0, Math.min(100, val))) }

  return { sessions, history, durCounts, streakCounts, syncing, increment, decrement, reset, setTo, addHistoryEntry, toggleHistoryEntry, updateHistoryEntry }
}
