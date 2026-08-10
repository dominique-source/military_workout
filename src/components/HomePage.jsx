import { useState, useRef } from 'react'

// type: 'sessions' = basé sur total sessions, 'dur' = basé sur sessions à X secondes
const BADGES = [
  { id: 1,  icon: '🎯', label: 'Première mission',   desc: '1 entraînement complété',              type: 'sessions', min: 1,   dur: null, need: 1   },
  { id: 2,  icon: '🔥', label: 'En feu',              desc: '5 entraînements complétés',            type: 'sessions', min: 5,   dur: null, need: 5   },
  { id: 3,  icon: '💪', label: 'Lancé',               desc: '10 entraînements complétés',           type: 'sessions', min: 10,  dur: null, need: 10  },
  { id: 4,  icon: '⏱️', label: '25 secondes',         desc: '10 sessions à 25s par exercice',       type: 'dur',      min: null, dur: 25,  need: 10  },
  { id: 5,  icon: '⚡', label: '26 secondes',         desc: '10 sessions à 26s par exercice',       type: 'dur',      min: null, dur: 26,  need: 10  },
  { id: 6,  icon: '🛡️', label: '27 secondes',         desc: '10 sessions à 27s par exercice',       type: 'dur',      min: null, dur: 27,  need: 10  },
  { id: 7,  icon: '🎖️', label: '28 secondes',         desc: '10 sessions à 28s par exercice',       type: 'dur',      min: null, dur: 28,  need: 10  },
  { id: 8,  icon: '🌟', label: '29 secondes',         desc: '10 sessions à 29s par exercice',       type: 'dur',      min: null, dur: 29,  need: 10  },
  { id: 9,  icon: '🏅', label: '30 secondes',         desc: '10 sessions à 30s par exercice',       type: 'dur',      min: null, dur: 30,  need: 10  },
  { id: 11, icon: '🔥', label: '3 jours de suite',    desc: '3 jours consécutifs (10 fois)',         type: 'streak',   streak: 3, need: 10  },
  { id: 12, icon: '💥', label: '4 jours de suite',    desc: '4 jours consécutifs (5 fois)',          type: 'streak',   streak: 4, need: 5   },
  { id: 13, icon: '⚔️', label: '5 jours de suite',    desc: '5 jours consécutifs (3 fois)',          type: 'streak',   streak: 5, need: 3   },
  { id: 10, icon: '🏆', label: '100 entraînements',   desc: 'Statut élite atteint !',               type: 'sessions', min: 100, dur: null, need: 100 },
]

function EditModal({ entry, onSave, onClose }) {
  const [profiles, setProfiles] = useState(entry.profiles || [])
  const [workDur, setWorkDur] = useState(entry.work_dur || 25)
  const NAMES = ['Éloi', 'Papa', 'Maman']

  function toggleName(name) {
    setProfiles(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name])
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#1f2e1f', border: '1px solid #3a4f3a',
        borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 340,
      }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 900, color: '#f0f0f0', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
          ✏️ Modifier — {entry.date}
        </div>

        {/* Participants */}
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Participants</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {NAMES.map(name => {
            const active = profiles.includes(name)
            return (
              <button key={name} onClick={() => toggleName(name)} style={{
                flex: 1, padding: '10px 0',
                borderRadius: 8,
                border: `1px solid ${active ? '#a8e63d' : '#3a4f3a'}`,
                background: active ? '#a8e63d' : 'transparent',
                color: active ? '#000' : '#888',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>{name}</button>
            )
          })}
        </div>

        {/* Duration */}
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Secondes par exercice</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <button onClick={() => setWorkDur(v => Math.max(10, v - 1))} style={{
            width: 40, height: 40, borderRadius: 8, background: '#2a3d2a',
            border: '1px solid #3a4f3a', color: '#f0f0f0', fontSize: 20,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>−</button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: '#a8e63d', flex: 1, textAlign: 'center' }}>{workDur}s</span>
          <button onClick={() => setWorkDur(v => Math.min(60, v + 1))} style={{
            width: 40, height: 40, borderRadius: 8, background: '#2a3d2a',
            border: '1px solid #3a4f3a', color: '#f0f0f0', fontSize: 20,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>+</button>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px 0', borderRadius: 8,
            border: '1px solid #3a4f3a', background: 'transparent',
            color: '#888', fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>Annuler</button>
          <button onClick={() => onSave(profiles, workDur)} style={{
            flex: 2, padding: '12px 0', borderRadius: 8,
            border: 'none', background: '#a8e63d',
            color: '#000', fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 15, fontWeight: 900, cursor: 'pointer',
          }}>✓ Sauvegarder</button>
        </div>
      </div>
    </div>
  )
}

function CalendarStrip({ history, onToggleDay, onUpdateDay }) {
  const longPressTimer = useRef(null)
  const [flashing, setFlashing] = useState(null)
  const [popup, setPopup] = useState(null)
  const [editing, setEditing] = useState(null) // entry being edited
  const didLongPress = useRef(false)

  function startLongPress(dateStr) {
    didLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true
      setFlashing(dateStr)
      onToggleDay(dateStr)
      setTimeout(() => setFlashing(null), 400)
    }, 600)
  }

  function cancelLongPress(dateStr, entry) {
    clearTimeout(longPressTimer.current)
    if (!didLongPress.current) {
      if (entry) setPopup(p => p?.dateStr === dateStr ? null : { dateStr, entry })
    }
    didLongPress.current = false
  }

  function handleSave(profiles, workDur) {
    onUpdateDay(editing.date, profiles, workDur)
    setEditing(null)
    setPopup(null)
  }

  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - (34 - i))
    const dateStr = d.toISOString().split('T')[0]
    const isToday = i === 34
    const entry = history.find(h => h.date === dateStr)
    const done = !!entry
    return { dateStr, isToday, done, entry, day: d.getDate(), month: d.getMonth() }
  })

  return (
    <div style={{ width: '100%', maxWidth: 420, marginTop: '2rem' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: '0.75rem' }}>
        📅 Historique — 35 derniers jours
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {days.map(({ dateStr, isToday, done, entry, day }) => (
          <div key={dateStr} style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onMouseDown={() => startLongPress(dateStr)}
              onMouseUp={() => cancelLongPress(dateStr, entry)}
              onMouseLeave={() => clearTimeout(longPressTimer.current)}
              onTouchStart={e => { e.preventDefault(); startLongPress(dateStr) }}
              onTouchEnd={() => cancelLongPress(dateStr, entry)}
              onTouchCancel={() => clearTimeout(longPressTimer.current)}
              style={{
                width: 28, height: 28, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600,
                background: flashing === dateStr ? '#fff' : done ? '#a8e63d' : isToday ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: isToday ? '1px solid #639922' : done ? 'none' : '1px solid rgba(255,255,255,0.06)',
                color: done ? '#000' : isToday ? '#639922' : '#555',
                cursor: 'pointer',
                userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none',
                transition: 'background 0.15s',
              }}
            >
              {day}
            </div>
            </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#a8e63d' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#888' }}>Entraînement</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, border: '1px solid #639922' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#888' }}>Aujourd'hui</span>
        </div>
      </div>

      {/* Popup détail au clic rapide */}
      {popup && (
        <div
          onClick={() => setPopup(null)}
          style={{
            marginTop: 10,
            background: '#a8e63d',
            borderRadius: 10,
            padding: '12px 16px',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 900, color: '#000', letterSpacing: '0.04em', marginBottom: 6 }}>
            🗓️ {popup.dateStr}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: '#1a3a00', marginBottom: 4, fontWeight: 700, letterSpacing: '0.04em' }}>
            👤 Participants
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {['Éloi', 'Papa', 'Maman'].map(name => {
              const did = popup.entry.profiles && popup.entry.profiles.includes(name)
              return (
                <span key={name} style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 5,
                  background: did ? '#1a5200' : 'rgba(0,0,0,0.15)',
                  color: did ? '#a8e63d' : 'rgba(0,0,0,0.35)',
                  letterSpacing: '0.04em',
                }}>
                  {did ? '✓ ' : ''}{name}
                </span>
              )
            })}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#1a3a00' }}>
            ⏱️ {popup.entry.work_dur}s par exercice
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              onClick={() => { setEditing(popup.entry); setPopup(null) }}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 7,
                border: '1px solid #1a5200', background: '#1a5200',
                color: '#a8e63d', fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em',
              }}
            >✏️ Modifier</button>
            <button
              onClick={() => setPopup(null)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 7,
                border: '1px solid rgba(0,0,0,0.2)', background: 'rgba(0,0,0,0.15)',
                color: '#1a3a00', fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >Fermer</button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && <EditModal entry={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
    </div>
  )
}

export default function HomePage({ onEnter, sessions = 0, history = [], durCounts = {}, streakCounts = {}, syncing = false, onToggleDay, onUpdateDay }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      padding: '2rem 1rem 3rem', textAlign: 'center',
    }}>

      {/* App icon */}
      <button
        onClick={() => onEnter('classic')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          boxShadow: '0 0 40px rgba(99,153,34,0.25), 0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: 36,
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
        title="Commencer l'entraînement"
      >
        <img src="/icon.png" alt="Military Workout" style={{ width: 220, height: 220, display: 'block' }} />
      </button>

      {/* Title */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, letterSpacing: '0.06em', color: '#f0f0f0', lineHeight: 1, textTransform: 'uppercase' }}>Military</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, letterSpacing: '0.06em', color: '#639922', lineHeight: 1, textTransform: 'uppercase' }}>Workout</div>
      </div>

      {/* No-jump mode button */}
      <button
        onClick={() => onEnter('nojump')}
        style={{
          marginTop: '1.25rem',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 20px',
          borderRadius: 999,
          border: '1px solid rgba(99,153,34,0.5)',
          background: 'rgba(99,153,34,0.1)',
          color: '#a8e63d',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 15, fontWeight: 700, letterSpacing: '0.04em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,153,34,0.2)'; e.currentTarget.style.borderColor = '#639922' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,153,34,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,153,34,0.5)' }}
      >
        🚫🦘 Military Workout — Sans sauts
      </button>

      {/* Badges */}
      <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: 420 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
          {syncing ? '⏳ Synchronisation...' : `🎖️ Badges — ${sessions} entraînement${sessions !== 1 ? 's' : ''} complété${sessions !== 1 ? 's' : ''}`}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {BADGES.map((badge, i) => {
            const current = badge.type === 'dur'    ? (durCounts[badge.dur] || 0)
                          : badge.type === 'streak' ? (streakCounts[badge.streak] || 0)
                          : sessions
            const target  = badge.need || badge.min
            const unlocked = current >= target
            const isSelected = selected === i
            const pct = Math.min(100, Math.round((current / target) * 100))

            // ── Style sets ──────────────────────────────────────────
            let cardBg, cardBorder, cardShadow, labelColor, descColor, opacity
            if (isSelected && unlocked) {
              cardBg     = '#a8e63d'
              cardBorder = '2px solid #7ab800'
              cardShadow = '0 0 28px rgba(168,230,61,0.55)'
              labelColor = '#000'
              descColor  = '#1a3a00'
              opacity    = 1
            } else if (isSelected && !unlocked) {
              cardBg     = '#2a2a2a'
              cardBorder = '2px solid #666'
              cardShadow = 'none'
              labelColor = '#fff'
              descColor  = '#aaa'
              opacity    = 1
            } else if (unlocked) {
              cardBg     = 'rgba(99,153,34,0.12)'
              cardBorder = '1px solid rgba(99,153,34,0.45)'
              cardShadow = 'none'
              labelColor = '#f0f0f0'
              descColor  = '#639922'
              opacity    = 1
            } else {
              cardBg     = 'rgba(255,255,255,0.03)'
              cardBorder = '1px solid rgba(255,255,255,0.07)'
              cardShadow = 'none'
              labelColor = '#555'
              descColor  = '#444'
              opacity    = 0.5
            }

            return (
              <div
                key={badge.id}
                onClick={() => setSelected(isSelected ? null : i)}
                style={{
                  background: cardBg,
                  border: cardBorder,
                  boxShadow: cardShadow,
                  borderRadius: 12,
                  padding: isSelected ? '18px 14px' : '12px 14px',
                  display: 'flex',
                  flexDirection: isSelected ? 'column' : 'row',
                  alignItems: 'center',
                  gap: isSelected ? 8 : 10,
                  textAlign: isSelected ? 'center' : 'left',
                  opacity,
                  cursor: 'pointer',
                  position: 'relative',
                  gridColumn: i === 9 ? '1 / -1' : undefined,
                  zIndex: isSelected ? 2 : 1,
                }}
              >
                {/* Lock icon */}
                {!unlocked && !isSelected && (
                  <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 10, color: '#555' }}>🔒</div>
                )}

                {/* Emoji icon */}
                <div style={{ fontSize: isSelected ? 42 : 26, flexShrink: 0, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  {badge.icon}
                </div>

                {/* Label + desc */}
                <div style={{ flex: isSelected ? 'unset' : 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: isSelected ? 20 : 15, fontWeight: 700, color: labelColor, letterSpacing: '0.03em', lineHeight: 1.2 }}>
                    {badge.label}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: descColor, marginTop: 3 }}>
                    {badge.desc}
                  </div>
                </div>

                {/* Progress (expanded only) */}
                {isSelected && (
                  <div style={{ width: '100%', marginTop: 4 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: unlocked ? '#1a3a00' : '#aaa', marginBottom: 8, fontWeight: 600 }}>
                      {unlocked ? '✅ Badge déverrouillé !' :
                        badge.type === 'dur'    ? `${current} / ${target} sessions à ${badge.dur}s` :
                        badge.type === 'streak' ? `${current} / ${target} fois ${badge.streak} jours de suite` :
                        `${current} / ${target} entraînements`}
                    </div>

                    {/* Track */}
                    <div style={{ background: unlocked ? 'rgba(0,0,0,0.25)' : '#1a1a1a', borderRadius: 6, height: 10, overflow: 'hidden', width: '100%' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: unlocked ? '#1a5200' : 'linear-gradient(90deg, #2a4a2a, #639922)',
                        borderRadius: 6,
                      }} />
                    </div>

                    {/* Pct */}
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 900, color: unlocked ? '#000' : '#ccc', marginTop: 6, letterSpacing: '0.05em' }}>
                      {pct}%
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Calendar */}
        <CalendarStrip history={history} onToggleDay={onToggleDay} onUpdateDay={onUpdateDay} />
      </div>
    </div>
  )
}
