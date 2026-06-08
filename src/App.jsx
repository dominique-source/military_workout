import { useState, useEffect, useRef, useCallback } from 'react'
import { EXERCISES, smartShuffle, TRANS_DUR, REST_DUR, REST_AFTER } from './data/exercises'
import { useVoice } from './hooks/useVoice'
import DrillCard from './components/DrillCard'
import Queue from './components/Queue'
import SessionTracker from './components/SessionTracker'
import HomePage from './components/HomePage'
import { useSessions } from './hooks/useSessions'

export default function App() {
  const [screen, setScreen] = useState('home')  // 'home' | 'workout'
  const { sessions, history, durCounts, syncing, increment, decrement, reset: resetSessions, setTo, addHistoryEntry, toggleHistoryEntry } = useSessions()

  // Always keep a fresh ref to session actions so useEffect never captures stale closures
  const sessionActionsRef = useRef({ increment, addHistoryEntry })
  useEffect(() => { sessionActionsRef.current = { increment, addHistoryEntry } })
  const [workDur, setWorkDur]       = useState(25)        // adjustable seconds per drill
  const [exercises, setExercises]   = useState(() => smartShuffle(EXERCISES))
  const [phase, setPhase]           = useState('idle')   // idle | working | transition | resting | done
  const [cur, setCur]               = useState(0)
  const [timeLeft, setTimeLeft]     = useState(25)
  const [running, setRunning]       = useState(false)
  const [previewIdx, setPreviewIdx] = useState(null)
  const [isShuffled, setIsShuffled] = useState(false)

  const ivRef    = useRef(null)
  const stateRef = useRef({ phase, cur, timeLeft, running, exercises, workDur })
  const { speak, cancel } = useVoice()

  // Keep ref in sync for use inside setInterval callback
  useEffect(() => {
    stateRef.current = { phase, cur, timeLeft, running, exercises, workDur }
  })

  // ── Progress calc ─────────────────────────────────────────
  const totalTime = 30 * workDur + 29 * TRANS_DUR + 3 * REST_DUR

  function calcProgress(p, c, tl) {
    let done = 0
    for (let i = 0; i < c; i++) {
      done += workDur
      if (i < 29) done += TRANS_DUR
      if (REST_AFTER.has(i)) done += REST_DUR
    }
    if (p === 'working')    done += workDur  - tl
    if (p === 'transition') done += workDur  + (TRANS_DUR - tl)
    if (p === 'resting')    done += workDur  + TRANS_DUR + (REST_DUR - tl)
    return Math.min(100, (done / totalTime) * 100)
  }

  const progress = calcProgress(phase, cur, timeLeft)

  // ── Tick ─────────────────────────────────────────────────
  const tick = useCallback(() => {
    const { phase: p, cur: c, timeLeft: tl, exercises: exs, workDur: wd } = stateRef.current

    const newTl = tl - 1

    // Voice countdown on last 5 seconds of a drill
    if (p === 'working' && newTl > 0 && newTl <= 5) speak(newTl)

    if (newTl > 0) {
      setTimeLeft(newTl)
      return
    }

    // Transition on 0
    if (p === 'working') {
      if (c >= 29) {
        clearInterval(ivRef.current)
        setRunning(false)
        setPhase('done')
        setTimeLeft(0)
      } else if (REST_AFTER.has(c)) {
        setPhase('resting')
        setTimeLeft(REST_DUR)
        speak('Rest')
      } else {
        setPhase('transition')
        setTimeLeft(TRANS_DUR)
        speak('Next: ' + exs[c + 1].name)
      }
    } else if (p === 'resting') {
      setPhase('transition')
      setTimeLeft(TRANS_DUR)
      speak('Next: ' + exs[c + 1].name)
    } else if (p === 'transition') {
      const next = c + 1
      setCur(next)
      setPhase('working')
      setTimeLeft(wd)
      speak('Go')
    }
  }, [speak])

  // ── Start / Resume ────────────────────────────────────────
  function handleStart() {
    if (phase === 'done') return
    setPreviewIdx(null)
    setRunning(true)
    if (phase === 'idle') {
      setPhase('working')
      setTimeLeft(workDur)
      speak('Go')
    }
    clearInterval(ivRef.current)
    ivRef.current = setInterval(tick, 1000)
  }

  // ── Pause ────────────────────────────────────────────────
  function handlePause() {
    setRunning(false)
    clearInterval(ivRef.current)
    cancel()
  }

  // ── Reset ────────────────────────────────────────────────
  function handleReset() {
    clearInterval(ivRef.current)
    cancel()
    setRunning(false)
    setPhase('idle')
    setCur(0)
    setTimeLeft(workDur)
    setPreviewIdx(null)
  }

  // ── Shuffle ──────────────────────────────────────────────
  function handleShuffle() {
    clearInterval(ivRef.current)
    cancel()
    setExercises(smartShuffle(EXERCISES))
    setIsShuffled(true)
    setRunning(false)
    setPhase('idle')
    setCur(0)
    setTimeLeft(workDur)
    setPreviewIdx(null)
  }

  // ── Queue click ──────────────────────────────────────────
  function handleQueueClick(i) {
    if (running) {
      // Jump to drill
      setPreviewIdx(null)
      setCur(i)
      setPhase('working')
      setTimeLeft(workDur)
      speak(exercises[i].name)
    } else {
      // Toggle preview
      setPreviewIdx(prev => prev === i ? null : i)
    }
  }

  // ── Jump to previewed drill ──────────────────────────────
  function handleJumpToPreview() {
    if (previewIdx === null) return
    setCur(previewIdx)
    setPhase('working')
    setTimeLeft(workDur)
    setPreviewIdx(null)
    setRunning(true)
    clearInterval(ivRef.current)
    ivRef.current = setInterval(tick, 1000)
    speak('Go')
  }

  // ── Voice announcement when workout done ─────────────────
  useEffect(() => {
    if (phase === 'done') speak('Military Workout terminé')
  }, [phase])

  // ── Workout complete button ───────────────────────────────
  function handleComplete() {
    sessionActionsRef.current.increment()
    sessionActionsRef.current.addHistoryEntry(workDur)
    handleReset()
    setScreen('home')
  }

  // ── Cleanup ──────────────────────────────────────────────
  useEffect(() => () => { clearInterval(ivRef.current); cancel() }, [cancel])

  if (screen === 'home') {
    return <HomePage onEnter={() => setScreen('workout')} sessions={sessions} history={history} durCounts={durCounts} syncing={syncing} onToggleDay={toggleHistoryEntry} />
  }

  return (
    <div className="app">
      {/* Back to home */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => { handleReset(); setScreen('home') }}
          title="Back to Home"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: 12,
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1.08)'}
        >
          <img src="/icon.png" alt="Home" style={{ width: 48, height: 48, borderRadius: 12, display: 'block' }} />
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div className="t-label" style={{ marginBottom: 3 }}>Military Blitz</div>
          <div className="t-display" style={{ fontSize: 22, color: 'var(--text)' }}>30 Drills · {workDur}s each</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {/* +/- duration controls — only when idle or paused */}
          {!running && phase !== 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
              <button
                onClick={() => { const v = Math.max(10, workDur - 1); setWorkDur(v); setTimeLeft(v) }}
                style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >−</button>
              <span className="t-mono" style={{ fontSize: 15, color: '#639922', minWidth: 36, textAlign: 'center' }}>{workDur}s</span>
              <button
                onClick={() => { const v = Math.min(60, workDur + 1); setWorkDur(v); setTimeLeft(v) }}
                style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >+</button>
            </div>
          )}
          <div className="t-label" style={{ marginBottom: 2 }}>Total</div>
          <div className="t-mono" style={{ fontSize: 14 }}>~{Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}</div>
        </div>
      </div>

      {/* Main drill card */}
      <DrillCard
        exercises={exercises}
        phase={phase}
        cur={cur}
        timeLeft={timeLeft}
        running={running}
        previewIdx={previewIdx}
        progress={progress}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onShuffle={handleShuffle}
        onJumpToPreview={handleJumpToPreview}
        onComplete={handleComplete}
      />

      {/* Queue */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Queue
          exercises={exercises}
          phase={phase}
          cur={cur}
          previewIdx={previewIdx}
          running={running}
          onQueueClick={handleQueueClick}
          isShuffled={isShuffled}
        />
      </div>

    </div>
  )
}
