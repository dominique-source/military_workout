import { useState } from 'react'

const MILESTONES = {
  10:  '10 done 🔥',
  25:  '1/4 warrior 💪',
  50:  'Halfway legend 🏆',
  75:  '75 — elite zone ⚡',
  100: '100 COMPLETED 🎖️',
}

const CONGRATS = {
  10:  "🔥 10 sessions. You've officially started something.",
  25:  "💪 25 sessions done. La routine est réelle.",
  50:  "🏆 50 sessions. La constance est ton superpouvoir.",
  75:  "⚡ 75 sessions — tu es dans le top 1%.",
  100: "🎖️ 100 ENTRAÎNEMENTS. STATUT ÉLITE ATTEINT.",
}

function getSquareClass(i, marked) {
  if (i >= marked) return i === marked ? 'sq sq--next' : 'sq'
  if (i === 99) return 'sq sq--gold'
  if (i >= 74) return 'sq sq--t4'
  if (i >= 49) return 'sq sq--t3'
  if (i >= 24) return 'sq sq--t2'
  return 'sq sq--t1'
}

export default function SessionTracker({ sessions = 0, syncing = false, increment, decrement, reset, setTo }) {
  const [popIdx, setPopIdx] = useState(null)

  function pop(i) {
    setPopIdx(i)
    setTimeout(() => setPopIdx(null), 300)
  }

  function toggleSquare(i) {
    pop(i)
    if (i === sessions - 1) decrement()
    else setTo(i + 1)
  }

  function markOne() {
    if (sessions >= 100) return
    pop(sessions)
    increment()
  }

  function undoMark() {
    decrement()
  }

  function clearAll() {
    if (window.confirm('Reset all 100 squares?')) reset()
  }

  const activeCongratsKey = [100, 75, 50, 25, 10].find(m => sessions >= m)

  return (
    <div className="card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div className="t-label" style={{ marginBottom: 3 }}>Session Tracker</div>
          <div className="t-display" style={{ fontSize: 16, color: 'var(--text)' }}>
            Marque chaque entraînement complété
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="t-label" style={{ marginBottom: 2 }}>
            {syncing ? '⏳ sync...' : 'Complétés'}
          </div>
          <div className="t-mono" style={{ fontSize: 22, color: '#639922' }}>
            {sessions} <span style={{ fontSize: 13, color: 'var(--text2)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Milestone labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, padding: '0 1px' }}>
        {['1', '25', '50', '75', '100'].map(l => (
          <span key={l} className="t-label" style={{ fontSize: 9 }}>{l}</span>
        ))}
      </div>

      {/* 10×10 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5, marginBottom: '1rem' }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className={`${getSquareClass(i, sessions)}${popIdx === i ? ' anim-pop' : ''}`}
            title={`Session ${i + 1}`}
            onClick={() => toggleSquare(i)}
          />
        ))}
      </div>

      {/* Milestone badges */}
      {sessions > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
          {[10, 25, 50, 75, 100].filter(m => sessions >= m).map(m => (
            <span
              key={m}
              className="badge"
              style={{ color: '#639922', borderColor: 'rgba(99,153,34,.4)', background: 'rgba(99,153,34,.1)' }}
            >
              {MILESTONES[m]}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-primary" onClick={markOne} style={{ flex: 1, fontSize: 16 }}>
          + MARQUER FAIT
        </button>
        <button className="btn-icon" onClick={undoMark} title="Undo" style={{ width: 'auto', padding: '0 14px', fontSize: 12 }}>
          UNDO
        </button>
        <button className="btn-icon" onClick={clearAll} title="Reset all" style={{ width: 'auto', padding: '0 12px', fontSize: 11 }}>
          RESET
        </button>
      </div>

      {/* Congrats banner */}
      {activeCongratsKey && (
        <div className="congrats">{CONGRATS[activeCongratsKey]}</div>
      )}
    </div>
  )
}
