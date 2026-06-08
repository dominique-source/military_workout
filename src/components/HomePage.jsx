import { useState } from 'react'

const BADGES = [
  { id: 1,  icon: '🎯', label: 'Première mission',  desc: '1 entraînement complété',     min: 1   },
  { id: 2,  icon: '🔥', label: 'En feu',             desc: '5 entraînements complétés',   min: 5   },
  { id: 3,  icon: '💪', label: 'Lancé',              desc: '10 entraînements complétés',  min: 10  },
  { id: 4,  icon: '⏱️', label: '25 minutes',         desc: 'Tu tiens 25 min par session', min: 20  },
  { id: 5,  icon: '⚡', label: '26 minutes',         desc: 'Tu tiens 26 min par session', min: 30  },
  { id: 6,  icon: '🛡️', label: '27 minutes',         desc: 'Tu tiens 27 min par session', min: 40  },
  { id: 7,  icon: '🎖️', label: '28 minutes',         desc: 'Tu tiens 28 min par session', min: 50  },
  { id: 8,  icon: '🌟', label: '29 minutes',         desc: 'Tu tiens 29 min par session', min: 65  },
  { id: 9,  icon: '🏅', label: '30 minutes',         desc: 'Tu tiens 30 min par session', min: 80  },
  { id: 10, icon: '🏆', label: '100 entraînements',  desc: 'Statut élite atteint !',      min: 100 },
]

export default function HomePage({ onEnter }) {
  const sessions = parseInt(localStorage.getItem('mw_sessions') || '0', 10)
  const [selected, setSelected] = useState(null)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      padding: '2rem 1rem 3rem', textAlign: 'center',
    }}>

      {/* App icon */}
      <button
        onClick={onEnter}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          borderRadius: 28,
          boxShadow: '0 0 40px rgba(99,153,34,0.25), 0 8px 32px rgba(0,0,0,0.6)',
          width: 220, height: 220,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
        title="Commencer l'entraînement"
      >
        <img src="/icon.png" alt="Military Workout" style={{ width: '100%', height: '100%', borderRadius: 28, display: 'block' }} />
      </button>

      {/* Title */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, letterSpacing: '0.06em', color: '#f0f0f0', lineHeight: 1, textTransform: 'uppercase' }}>Military</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, letterSpacing: '0.06em', color: '#639922', lineHeight: 1, textTransform: 'uppercase' }}>Workout</div>
      </div>

      {/* Badges */}
      <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: 420 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
          🎖️ Badges — {sessions} entraînement{sessions !== 1 ? 's' : ''} complété{sessions !== 1 ? 's' : ''}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {BADGES.map((badge, i) => {
            const unlocked = sessions >= badge.min
            const isSelected = selected === i
            const pct = Math.min(100, Math.round((sessions / badge.min) * 100))

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
                      {unlocked ? '✅ Badge déverrouillé !' : `${sessions} / ${badge.min} entraînements`}
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
      </div>
    </div>
  )
}
