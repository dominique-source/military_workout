import StickFigure from './StickFigure'
import { REST_AFTER } from '../data/exercises'

export default function DrillCard({
  exercises, phase, cur, timeLeft, running, previewIdx,
  onStart, onPause, onReset, onShuffle, onJumpToPreview,
  progress,
}) {
  const ex = exercises[cur] || exercises[0]
  const isPreview = previewIdx !== null && (!running || phase === 'idle')
  const px = isPreview ? exercises[previewIdx] : null

  // Compute display values
  let title, animType, counter, nextLabel, nextName, timerColor, timerPulse, phaseLabelText, showDesc

  if (phase === 'done') {
    title = 'Mission Complete!'
    animType = 'rest'
    counter = '30 / 30 Done'
    nextName = '—'
    timerColor = '#639922'
  } else if (isPreview) {
    title = px.name
    animType = px.anim
    counter = `Preview — Drill ${previewIdx + 1}`
    phaseLabelText = 'DRILL PREVIEW'
    nextLabel = 'Current drill'
    nextName = ex.name
    timerColor = 'var(--text3)'
    showDesc = px.desc
  } else if (phase === 'transition') {
    const nxt = exercises[cur + 1]
    title = nxt.name
    animType = nxt.anim
    counter = `Drill ${cur + 2} / 30 — Get Ready!`
    phaseLabelText = 'NEXT UP'
    nextName = cur + 2 < 30 && exercises[cur + 2] ? exercises[cur + 2].name : '—'
    timerColor = '#639922'
    timerPulse = true
  } else if (phase === 'resting') {
    title = 'Rest'
    animType = 'rest'
    counter = `Rest — ${cur + 1} of 30 done`
    nextName = cur < 29 ? exercises[cur + 1].name : '—'
    timerColor = '#639922'
  } else {
    title = ex.name
    animType = ex.anim
    counter = `Drill ${cur + 1} / 30`
    nextName = REST_AFTER.has(cur) ? '30s rest' : (cur < 29 ? exercises[cur + 1].name : '—')
    timerColor = (timeLeft <= 5 && running) ? '#e24b4a' : 'var(--text)'
    timerPulse = timeLeft <= 5 && running
  }

  // Badge
  const badgeMap = {
    idle: { label: 'READY', color: '#639922' },
    working: { label: 'ACTIVE', color: '#639922' },
    transition: { label: 'GET READY', color: '#639922' },
    resting: { label: 'REST', color: '#639922' },
    done: { label: 'DONE', color: '#639922' },
  }
  const badge = isPreview
    ? { label: 'PREVIEW', color: '#639922' }
    : !running && phase !== 'idle' && phase !== 'done'
      ? { label: 'PAUSED', color: '#666' }
      : (badgeMap[phase] || { label: 'READY', color: '#639922' })

  // Card border
  const cardClass = phase === 'transition' || isPreview ? 'card card--preview' : 'card'

  return (
    <div className={cardClass} style={{ marginBottom: '0.75rem' }}>

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span className="t-label">{counter}</span>
        <span
          className="badge"
          style={{ color: badge.color, borderColor: badge.color + '55', background: badge.color + '18' }}
        >
          {badge.label}
        </span>
      </div>

      {/* Drill name + animation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem', minHeight: 90 }}>
        <div style={{ flex: 1 }}>
          {phaseLabelText && (
            <div className="t-label" style={{ marginBottom: 4, color: 'rgba(99,153,34,0.8)' }}>
              {phaseLabelText}
            </div>
          )}
          <div
            className={`t-display anim-slidein`}
            style={{ fontSize: 26, lineHeight: 1.15, color: 'var(--text)' }}
            key={title}
          >
            {title}
          </div>
          {showDesc && (
            <div className="t-label" style={{ marginTop: 6, lineHeight: 1.6, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
              {showDesc}
            </div>
          )}
        </div>
        <div style={{
          flexShrink: 0, width: 88, height: 88,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 8,
          borderColor: phase === 'resting' || isPreview ? 'rgba(99,153,34,0.5)' : 'var(--border)',
          transition: 'border-color 0.3s',
        }}>
          {phase === 'done'
            ? <svg viewBox="0 0 80 80" width="56" height="56" style={{ color: '#639922' }} xmlns="http://www.w3.org/2000/svg">
                <polyline points="16,44 32,60 64,24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            : <StickFigure type={animType} size={80} />
          }
        </div>
      </div>

      {/* Timer + next */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: '1rem' }}>
        <div
          className={`t-mono${timerPulse ? ' anim-pulse' : ''}`}
          style={{ fontSize: 68, fontWeight: 600, lineHeight: 1, color: timerColor, minWidth: 100 }}
        >
          {phase === 'done' ? '✓' : timeLeft}
        </div>
        <div style={{ paddingBottom: 6 }}>
          <div className="t-label" style={{ marginBottom: 3 }}>{nextLabel || 'Next up'}</div>
          <div className="t-display" style={{ fontSize: 13, color: 'var(--text2)' }}>{nextName}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-track" style={{ marginBottom: '1.25rem' }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {phase !== 'done' && (
          <button
            className="btn-primary"
            id="btn-start"
            onClick={onStart}
            style={{ flex: 1 }}
          >
            {!running && phase !== 'idle' ? 'RESUME' : 'START'}
          </button>
        )}
        {running && (
          <button className="btn-secondary" onClick={onPause} style={{ flex: 0.55 }}>
            PAUSE
          </button>
        )}
        <button className="btn-icon" onClick={onReset} title="Reset">↺</button>
        <button className="btn-icon" onClick={onShuffle} title="Shuffle">⇄</button>
      </div>

      {/* Jump to preview button */}
      {isPreview && (
        <button className="btn-jump" onClick={onJumpToPreview}>
          ▶ START FROM THIS DRILL
        </button>
      )}
    </div>
  )
}
