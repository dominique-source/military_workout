import { useState, useEffect, useRef, useCallback } from 'react'
import { EXERCISES, smartShuffle, WORK_DUR, TRANS_DUR, REST_DUR, REST_AFTER, TOTAL_TIME } from './data/exercises'
import { useVoice } from './hooks/useVoice'
import DrillCard from './components/DrillCard'
import Queue from './components/Queue'
import SessionTracker from './components/SessionTracker'
import HomePage from './components/HomePage'

export default function App() {
  const [screen, setScreen] = useState('home')  // 'home' | 'workout'
  const [exercises, setExercises]   = useState(() => smartShuffle(EXERCISES))
  const [phase, setPhase]           = useState('idle')   // idle | working | transition | resting | done
  const [cur, setCur]               = useState(0)
  const [timeLeft, setTimeLeft]     = useState(WORK_DUR)
  const [running, setRunning]       = useState(false)
  const [previewIdx, setPreviewIdx] = useState(null)
  const [isShuffled, setIsShuffled] = useState(false)

  const ivRef    = useRef(null)
  const stateRef = useRef({ phase, cur, timeLeft, running, exercises })
  const { speak, cancel } = useVoice()

  // Keep ref in sync for use inside setInterval callback
  useEffect(() => {
    stateRef.current = { phase, cur, timeLeft, running, exercises }
  })

  // ── Progress calc ─────────────────────────────────────────
  function calcProgress(p, c, tl) {
    let done = 0
    for (let i = 0; i < c; i++) {
      done += WORK_DUR
      if (i < 29) done += TRANS_DUR
      if (REST_AFTER.has(i)) done += REST_DUR
    }
    if (p === 'working')    done += WORK_DUR  - tl
    if (p === 'transition') done += WORK_DUR  + (TRANS_DUR - tl)
    if (p === 'resting')    done += WORK_DUR  + TRANS_DUR + (REST_DUR - tl)
    return Math.min(100, (done / TOTAL_TIME) * 100)
  }

  const progress = calcProgress(phase, cur, timeLeft)

  // ── Tick ─────────────────────────────────────────────────
  const tick = useCallback(() => {
    const { phase: p, cur: c, timeLeft: tl, exercises: exs } = stateRef.current

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
      setTimeLeft(WORK_DUR)
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
      setTimeLeft(WORK_DUR)
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
    setTimeLeft(WORK_DUR)
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
    setTimeLeft(WORK_DUR)
    setPreviewIdx(null)
  }

  // ── Queue click ──────────────────────────────────────────
  function handleQueueClick(i) {
    if (running) {
      // Jump to drill
      setPreviewIdx(null)
      setCur(i)
      setPhase('working')
      setTimeLeft(WORK_DUR)
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
    setTimeLeft(WORK_DUR)
    setPreviewIdx(null)
    setRunning(true)
    clearInterval(ivRef.current)
    ivRef.current = setInterval(tick, 1000)
    speak('Go')
  }

  // ── Cleanup ──────────────────────────────────────────────
  useEffect(() => () => { clearInterval(ivRef.current); cancel() }, [cancel])

  if (screen === 'home') {
    return <HomePage onEnter={() => setScreen('workout')} />
  }

  return (
    <div className="app">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div className="t-label" style={{ marginBottom: 3 }}>Military Blitz</div>
          <div className="t-display" style={{ fontSize: 22, color: 'var(--text)' }}>30 Drills · 25s each</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="t-label" style={{ marginBottom: 3 }}>Total</div>
          <div className="t-mono" style={{ fontSize: 14 }}>~16:25</div>
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

      {/* Session tracker */}
      <SessionTracker />
    </div>
  )
}
