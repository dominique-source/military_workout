import { useEffect, useRef } from 'react'
import { REST_AFTER } from '../data/exercises'

export default function Queue({ exercises, phase, cur, previewIdx, running, onQueueClick, isShuffled }) {
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [cur, phase])

  function getPillClass(i) {
    const isPrev = previewIdx === i && (!running || phase === 'idle')
    if (isPrev) return 'pill pill--preview'
    if (i < cur || (i === cur && (phase === 'resting' || phase === 'transition'))) return 'pill pill--done'
    if (i === cur && phase === 'working') return 'pill pill--active'
    if (i === cur + 1 && phase === 'transition') return 'pill pill--next'
    return 'pill'
  }

  function getRestClass(idx) {
    if (phase === 'resting' && cur === idx) return 'pill-rest pill-rest--active'
    if (cur > idx) return 'pill-rest pill-rest--done'
    return 'pill-rest'
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span className="t-label">Queue — click to jump or preview</span>
        {isShuffled && (
          <span className="badge" style={{ color: '#639922', borderColor: 'rgba(99,153,34,.4)', background: 'rgba(99,153,34,.1)' }}>
            SHUFFLED
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {exercises.map((ex, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div
              ref={i === cur && phase === 'working' ? activeRef : null}
              className={getPillClass(i)}
              onClick={() => onQueueClick(i)}
              title={ex.desc}
            >
              <span style={{ opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</span>
              {' '}{ex.name}
            </div>
            {REST_AFTER.has(i) && i < 29 && (
              <div
                ref={phase === 'resting' && cur === i ? activeRef : null}
                className={getRestClass(i)}
              >
                — 30s rest —
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
