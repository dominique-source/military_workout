const BADGES = [
  { id: 1,   icon: '🎯', label: 'Première mission',       desc: '1 entraînement complété',      min: 1   },
  { id: 2,   icon: '🔥', label: 'En feu',                 desc: '5 entraînements complétés',    min: 5   },
  { id: 3,   icon: '💪', label: 'Lancé',                  desc: '10 entraînements complétés',   min: 10  },
  { id: 4,   icon: '⏱️', label: '25 minutes',             desc: 'Tu tiens 25 min par session',  min: 20  },
  { id: 5,   icon: '⚡', label: '26 minutes',             desc: 'Tu tiens 26 min par session',  min: 30  },
  { id: 6,   icon: '🛡️', label: '27 minutes',             desc: 'Tu tiens 27 min par session',  min: 40  },
  { id: 7,   icon: '🎖️', label: '28 minutes',             desc: 'Tu tiens 28 min par session',  min: 50  },
  { id: 8,   icon: '🌟', label: '29 minutes',             desc: 'Tu tiens 29 min par session',  min: 65  },
  { id: 9,   icon: '🏅', label: '30 minutes',             desc: 'Tu tiens 30 min par session',  min: 80  },
  { id: 10,  icon: '🏆', label: '100 entraînements',      desc: 'Statut élite atteint!',        min: 100 },
]

export default function HomePage({ onEnter }) {
  const sessions = parseInt(localStorage.getItem('mw_sessions') || '0', 10)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem 1rem 3rem',
      textAlign: 'center',
    }}>

      {/* App icon — clickable */}
      <button
        onClick={onEnter}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          borderRadius: 28,
          boxShadow: '0 0 40px rgba(99,153,34,0.25), 0 8px 32px rgba(0,0,0,0.6)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          width: 220,
          height: 220,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = '0 0 60px rgba(99,153,34,0.4), 0 12px 40px rgba(0,0,0,0.7)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 0 40px rgba(99,153,34,0.25), 0 8px 32px rgba(0,0,0,0.6)'
        }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
        title="Commencer l'entraînement"
        aria-label="Commencer l'entraînement"
      >
        <img
          src="/icon.png"
          alt="Military Workout"
          style={{ width: '100%', height: '100%', borderRadius: 28, display: 'block' }}
        />
      </button>

      {/* Title */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 42, fontWeight: 900,
          letterSpacing: '0.06em', color: '#f0f0f0',
          lineHeight: 1, textTransform: 'uppercase',
        }}>
          Military
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 42, fontWeight: 900,
          letterSpacing: '0.06em', color: '#639922',
          lineHeight: 1, textTransform: 'uppercase',
        }}>
          Workout
        </div>
      </div>

      {/* Badges section */}
      <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: 420 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#888',
          marginBottom: '1rem',
        }}>
          🎖️ Badges — {sessions} entraînement{sessions !== 1 ? 's' : ''} complété{sessions !== 1 ? 's' : ''}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {BADGES.map((badge, i) => {
            const unlocked = sessions >= badge.min
            return (
              <div
                key={badge.id}
                style={{
                  background: unlocked ? 'rgba(99,153,34,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${unlocked ? 'rgba(99,153,34,0.45)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  textAlign: 'left',
                  opacity: unlocked ? 1 : 0.45,
                  transition: 'all 0.3s',
                  position: 'relative',
                  gridColumn: i === 9 ? '1 / -1' : undefined, // last badge spans full width
                }}
              >
                {/* Lock overlay */}
                {!unlocked && (
                  <div style={{
                    position: 'absolute', top: 8, right: 10,
                    fontSize: 10, color: '#555',
                  }}>🔒</div>
                )}

                <div style={{ fontSize: 26, flexShrink: 0, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  {badge.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 15, fontWeight: 700,
                    color: unlocked ? '#f0f0f0' : '#555',
                    letterSpacing: '0.03em',
                    lineHeight: 1.2,
                  }}>
                    {badge.label}
                  </div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10, color: unlocked ? '#639922' : '#444',
                    marginTop: 2, letterSpacing: '0.02em',
                  }}>
                    {badge.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
