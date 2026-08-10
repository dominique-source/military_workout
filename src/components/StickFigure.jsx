// ─── StickFigure ─────────────────────────────────────────────
// Renders the looping SVG animation for a given drill type.

const G = '#639922'

const H = (x, y) => <circle cx={x} cy={y} r="5" fill={G} stroke="none" />
const Ln = ({ x1, y1, x2, y2 }) => <line x1={x1} y1={y1} x2={x2} y2={y2} />

function Anim2({ dur = '1s', children }) {
  // children[0] = frame A, children[1] = frame B
  return (
    <>
      <g>
        {children[0]}
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.48;0.5;0.98;1" dur={dur} repeatCount="indefinite" />
      </g>
      <g opacity="0">
        {children[1]}
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.48;0.5;0.98;1" dur={dur} repeatCount="indefinite" />
      </g>
    </>
  )
}

function Breathe({ children }) {
  return (
    <g>
      {children}
      <animate attributeName="opacity" values="1;0.5;1" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
    </g>
  )
}

// ── Reusable body positions ───────────────────────────────────
function Standing() {
  return <>
    {H(40,10)}
    <Ln x1="40" y1="15" x2="40" y2="40" />
    <Ln x1="40" y1="23" x2="24" y2="34" />
    <Ln x1="40" y1="23" x2="56" y2="34" />
    <Ln x1="40" y1="40" x2="30" y2="62" />
    <Ln x1="40" y1="40" x2="50" y2="62" />
  </>
}

function InAir() {
  return <>
    {H(40,5)}
    <Ln x1="40" y1="10" x2="40" y2="35" />
    <Ln x1="40" y1="17" x2="26" y2="8" />
    <Ln x1="40" y1="17" x2="54" y2="8" />
    <Ln x1="40" y1="35" x2="34" y2="52" />
    <Ln x1="40" y1="35" x2="46" y2="52" />
  </>
}

function Squat() {
  return <>
    {H(40,14)}
    <Ln x1="40" y1="19" x2="40" y2="38" />
    <Ln x1="40" y1="25" x2="24" y2="35" />
    <Ln x1="40" y1="25" x2="56" y2="35" />
    <Ln x1="40" y1="38" x2="26" y2="53" /><Ln x1="26" y1="53" x2="28" y2="68" />
    <Ln x1="40" y1="38" x2="54" y2="53" /><Ln x1="54" y1="53" x2="52" y2="68" />
  </>
}

function PlankHigh() {
  return <>
    {H(8,36)}
    <Ln x1="13" y1="39" x2="60" y2="39" />
    <Ln x1="22" y1="39" x2="22" y2="56" />
    <Ln x1="38" y1="39" x2="38" y2="56" />
    <Ln x1="60" y1="39" x2="66" y2="54" />
    <Ln x1="60" y1="39" x2="72" y2="46" />
  </>
}

function PlankLow() {
  return <>
    {H(8,43)}
    <Ln x1="13" y1="46" x2="60" y2="46" />
    <Ln x1="22" y1="46" x2="19" y2="58" />
    <Ln x1="38" y1="46" x2="35" y2="58" />
    <Ln x1="60" y1="46" x2="66" y2="60" />
    <Ln x1="60" y1="46" x2="72" y2="52" />
  </>
}

// ── Individual drill animations ───────────────────────────────
const animations = {
  burpee: () => (
    <>
      <g>
        <Standing />
        <animate attributeName="opacity" values="1;1;0;0;0;0;1" keyTimes="0;0.28;0.32;0.62;0.67;0.98;1" dur="2.2s" repeatCount="indefinite" />
      </g>
      <g opacity="0">
        <PlankHigh />
        <animate attributeName="opacity" values="0;0;1;1;0;0;0" keyTimes="0;0.28;0.32;0.62;0.67;0.98;1" dur="2.2s" repeatCount="indefinite" />
      </g>
      <g opacity="0">
        <InAir />
        <animate attributeName="opacity" values="0;0;0;0;1;1;0" keyTimes="0;0.28;0.32;0.62;0.67;0.98;1" dur="2.2s" repeatCount="indefinite" />
      </g>
    </>
  ),

  pushup: () => (
    <Anim2 dur="1s">
      <PlankHigh />
      <PlankLow />
    </Anim2>
  ),

  sqjump: () => (
    <Anim2 dur="1.2s">
      <Squat />
      <InAir />
    </Anim2>
  ),

  hiknees: () => (
    <Anim2 dur="0.7s">
      <>
        {H(40,10)}
        <Ln x1="40" y1="15" x2="40" y2="40" />
        <Ln x1="40" y1="23" x2="56" y2="33" />
        <Ln x1="40" y1="23" x2="24" y2="33" />
        <Ln x1="40" y1="40" x2="30" y2="62" />
        <Ln x1="40" y1="40" x2="50" y2="28" /><Ln x1="50" y1="28" x2="52" y2="44" />
      </>
      <>
        {H(40,10)}
        <Ln x1="40" y1="15" x2="40" y2="40" />
        <Ln x1="40" y1="23" x2="24" y2="33" />
        <Ln x1="40" y1="23" x2="56" y2="33" />
        <Ln x1="40" y1="40" x2="30" y2="28" /><Ln x1="30" y1="28" x2="28" y2="44" />
        <Ln x1="40" y1="40" x2="50" y2="62" />
      </>
    </Anim2>
  ),

  plank: () => (
    <Anim2 dur="1.6s">
      <PlankHigh />
      <>
        {H(8,36)}
        <Ln x1="13" y1="39" x2="60" y2="39" />
        <Ln x1="28" y1="39" x2="28" y2="56" />
        <Ln x1="38" y1="39" x2="38" y2="56" />
        <Ln x1="60" y1="39" x2="66" y2="54" />
        <Ln x1="60" y1="39" x2="72" y2="46" />
      </>
    </Anim2>
  ),

  lunge: () => (
    <Anim2 dur="1.2s">
      <Standing />
      <>
        {H(40,12)}
        <Ln x1="40" y1="17" x2="40" y2="38" />
        <Ln x1="40" y1="24" x2="26" y2="34" />
        <Ln x1="40" y1="24" x2="54" y2="34" />
        <Ln x1="40" y1="38" x2="24" y2="55" /><Ln x1="24" y1="55" x2="22" y2="70" />
        <Ln x1="40" y1="38" x2="56" y2="58" />
      </>
    </Anim2>
  ),

  crunch: () => (
    <Anim2 dur="1.2s">
      <>{H(70,60)}<Ln x1="65" y1="63" x2="20" y2="63" /><Ln x1="20" y1="63" x2="5" y2="63" /></>
      <>{H(60,50)}<Ln x1="55" y1="54" x2="20" y2="63" /><Ln x1="20" y1="63" x2="5" y2="63" /></>
    </Anim2>
  ),

  vup: () => (
    <Anim2 dur="1.3s">
      <>{H(70,60)}<Ln x1="65" y1="63" x2="20" y2="63" /><Ln x1="20" y1="63" x2="5" y2="63" /></>
      <>
        {H(52,38)}
        <Ln x1="47" y1="43" x2="32" y2="55" /><Ln x1="32" y1="55" x2="20" y2="63" />
        <Ln x1="32" y1="55" x2="60" y2="40" /><Ln x1="60" y1="40" x2="74" y2="32" />
      </>
    </Anim2>
  ),

  sideplank: () => (
    <Breathe>
      {H(14,18)}
      <Ln x1="14" y1="23" x2="55" y2="52" />
      <Ln x1="28" y1="30" x2="26" y2="54" />
      <Ln x1="28" y1="30" x2="22" y2="10" />
      <Ln x1="55" y1="52" x2="66" y2="56" />
      <Ln x1="55" y1="52" x2="68" y2="49" />
    </Breathe>
  ),

  bridge: () => (
    <Anim2 dur="1.3s">
      <>{H(68,62)}<Ln x1="63" y1="65" x2="32" y2="65" /><Ln x1="32" y1="65" x2="22" y2="50" /><Ln x1="22" y1="50" x2="18" y2="65" /></>
      <>{H(68,62)}<Ln x1="63" y1="65" x2="60" y2="65" /><Ln x1="60" y1="65" x2="38" y2="44" /><Ln x1="38" y1="44" x2="22" y2="50" /><Ln x1="22" y1="50" x2="18" y2="65" /></>
    </Anim2>
  ),

  flutter: () => (
    <Anim2 dur="0.5s">
      <>{H(70,55)}<Ln x1="65" y1="58" x2="20" y2="58" /><Ln x1="20" y1="58" x2="4" y2="44" /><Ln x1="20" y1="58" x2="7" y2="66" /></>
      <>{H(70,55)}<Ln x1="65" y1="58" x2="20" y2="58" /><Ln x1="20" y1="58" x2="4" y2="66" /><Ln x1="20" y1="58" x2="7" y2="44" /></>
    </Anim2>
  ),

  superman: () => (
    <Anim2 dur="1.5s">
      <>{H(8,42)}<Ln x1="13" y1="45" x2="60" y2="45" /><Ln x1="10" y1="42" x2="4" y2="38" /><Ln x1="60" y1="45" x2="74" y2="44" /></>
      <>{H(8,38)}<Ln x1="13" y1="41" x2="38" y2="39" /><Ln x1="38" y1="39" x2="60" y2="42" /><Ln x1="10" y1="37" x2="4" y2="30" /><Ln x1="60" y1="42" x2="74" y2="38" /></>
    </Anim2>
  ),

  lateral: () => (
    <Anim2 dur="0.9s">
      <>
        {H(30,10)}
        <Ln x1="30" y1="15" x2="30" y2="40" />
        <Ln x1="30" y1="23" x2="14" y2="33" />
        <Ln x1="30" y1="23" x2="46" y2="33" />
        <Ln x1="30" y1="40" x2="20" y2="62" />
        <Ln x1="30" y1="40" x2="44" y2="52" />
      </>
      <>
        {H(50,10)}
        <Ln x1="50" y1="15" x2="50" y2="40" />
        <Ln x1="50" y1="23" x2="34" y2="33" />
        <Ln x1="50" y1="23" x2="66" y2="33" />
        <Ln x1="50" y1="40" x2="36" y2="52" />
        <Ln x1="50" y1="40" x2="60" y2="62" />
      </>
    </Anim2>
  ),

  inchworm: () => (
    <Anim2 dur="2s">
      <Standing />
      <>
        {H(40,55)}
        <Ln x1="40" y1="20" x2="40" y2="50" />
        <Ln x1="40" y1="20" x2="28" y2="68" />
        <Ln x1="40" y1="20" x2="52" y2="68" />
        <Ln x1="40" y1="50" x2="24" y2="70" />
        <Ln x1="40" y1="50" x2="56" y2="70" />
      </>
    </Anim2>
  ),

  wallsit: () => (
    <Breathe>
      {H(40,10)}
      <Ln x1="40" y1="15" x2="40" y2="40" />
      <Ln x1="40" y1="23" x2="24" y2="34" />
      <Ln x1="40" y1="23" x2="56" y2="34" />
      <Ln x1="40" y1="40" x2="15" y2="40" /><Ln x1="15" y1="40" x2="15" y2="65" />
      <Ln x1="40" y1="40" x2="65" y2="40" /><Ln x1="65" y1="40" x2="65" y2="65" />
    </Breathe>
  ),

  donkey: () => (
    <Anim2 dur="1s">
      <>
        {H(8,28)}
        <Ln x1="13" y1="30" x2="50" y2="30" />
        <Ln x1="20" y1="30" x2="20" y2="50" />
        <Ln x1="34" y1="30" x2="34" y2="50" />
        <Ln x1="50" y1="30" x2="56" y2="46" /><Ln x1="56" y1="46" x2="52" y2="56" />
        <Ln x1="50" y1="30" x2="60" y2="16" /><Ln x1="60" y1="16" x2="70" y2="8" />
      </>
      <>
        {H(8,28)}
        <Ln x1="13" y1="30" x2="50" y2="30" />
        <Ln x1="20" y1="30" x2="20" y2="50" />
        <Ln x1="34" y1="30" x2="34" y2="50" />
        <Ln x1="50" y1="30" x2="62" y2="44" /><Ln x1="62" y1="44" x2="58" y2="54" />
        <Ln x1="50" y1="30" x2="56" y2="14" /><Ln x1="56" y1="14" x2="66" y2="6" />
      </>
    </Anim2>
  ),

  rest: () => (
    <Breathe>
      <Standing />
    </Breathe>
  ),

  squat: () => (
    <Anim2 dur="1.4s">
      <Standing />
      <Squat />
    </Anim2>
  ),

  legraise: () => (
    <Anim2 dur="1.4s">
      <>{H(70,58)}<Ln x1="65" y1="60" x2="20" y2="60" /><Ln x1="20" y1="60" x2="5" y2="60" /></>
      <>{H(70,58)}<Ln x1="65" y1="60" x2="20" y2="60" /><Ln x1="20" y1="60" x2="22" y2="20" /></>
    </Anim2>
  ),

  twist: () => (
    <Anim2 dur="1s">
      <>{H(45,25)}<Ln x1="42" y1="30" x2="20" y2="55" /><Ln x1="20" y1="55" x2="10" y2="45" /><Ln x1="20" y1="55" x2="42" y2="65" /><Ln x1="42" y1="65" x2="55" y2="60" /></>
      <>{H(45,25)}<Ln x1="42" y1="30" x2="20" y2="55" /><Ln x1="20" y1="55" x2="10" y2="65" /><Ln x1="20" y1="55" x2="42" y2="65" /><Ln x1="42" y1="65" x2="55" y2="60" /></>
    </Anim2>
  ),

  armcircle: () => (
    <Anim2 dur="0.6s">
      <>
        {H(40,10)}
        <Ln x1="40" y1="15" x2="40" y2="40" />
        <Ln x1="40" y1="20" x2="20" y2="12" />
        <Ln x1="40" y1="20" x2="60" y2="12" />
        <Ln x1="40" y1="40" x2="30" y2="62" />
        <Ln x1="40" y1="40" x2="50" y2="62" />
      </>
      <>
        {H(40,10)}
        <Ln x1="40" y1="15" x2="40" y2="40" />
        <Ln x1="40" y1="20" x2="20" y2="34" />
        <Ln x1="40" y1="20" x2="60" y2="34" />
        <Ln x1="40" y1="40" x2="30" y2="62" />
        <Ln x1="40" y1="40" x2="50" y2="62" />
      </>
    </Anim2>
  ),
}

// ─── Component ───────────────────────────────────────────────
export default function StickFigure({ type, size = 80 }) {
  const AnimComponent = animations[type] || animations.rest
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      style={{ color: G }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <AnimComponent />
      </g>
    </svg>
  )
}
