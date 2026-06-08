export default function HomePage({ onEnter }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem 1rem',
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
        title="Start Military Workout"
        aria-label="Start Military Workout"
      >
        <img
          src="/icon.png"
          alt="Military Workout"
          style={{ width: '100%', height: '100%', borderRadius: 28, display: 'block' }}
        />
      </button>

      {/* Title */}
      <div style={{ marginTop: '2rem' }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: '0.06em',
            color: '#f0f0f0',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          Military
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: '0.06em',
            color: '#639922',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          Workout
        </div>
      </div>

    </div>
  )
}
