// ─── Exercise definitions ────────────────────────────────────
// cat: 'push' | 'squat' | 'core' | 'cardio'
// Smart shuffle ensures no 2 push or 2 squat drills in a row.

export const EXERCISES = [
  { name: 'Burpees',              anim: 'burpee',    cat: 'push',   desc: 'Drop to floor, chest touches ground, explode up with a jump. Core tight throughout.' },
  { name: 'Push-ups',             anim: 'pushup',    cat: 'push',   desc: 'Chest to floor, full lockout at top. Elbows 45° from body. No sagging hips.' },
  { name: 'Jump squats',          anim: 'sqjump',    cat: 'squat',  desc: 'Squat below parallel, explode into a jump, land softly bending knees.' },
  { name: 'Mountain climbers',    anim: 'hiknees',   cat: 'core',   desc: 'Plank position, drive knees to chest alternately as fast as possible. Hips stay low.' },
  { name: 'Plank hold',           anim: 'plank',     cat: 'core',   desc: 'Rigid from head to heels. Squeeze glutes and abs. Breathe steady.' },
  { name: 'High knees',           anim: 'hiknees',   cat: 'cardio', desc: 'Drive knees above hip height, pump arms hard. Stay on balls of your feet.' },
  { name: 'Jump lunges',          anim: 'lunge',     cat: 'squat',  desc: 'Lunge, jump and switch legs mid-air. Land in lunge, repeat. Torso upright.' },
  { name: 'Diamond push-ups',     anim: 'pushup',    cat: 'push',   desc: 'Hands form a diamond under your chest. Targets triceps hard. Full range only.' },
  { name: 'Donkey kicks',         anim: 'donkey',    cat: 'core',   desc: 'On all fours, drive one heel toward the ceiling, squeeze glute at top. Alternate legs. Hips stay square — don\'t rotate.' },
  { name: 'Crunches',             anim: 'crunch',    cat: 'core',   desc: 'Curl shoulder blades off floor. Don\'t pull your neck. Slow controlled squeeze at top.' },
  { name: 'V-ups',                anim: 'vup',       cat: 'core',   desc: 'Lift legs and torso simultaneously, touch toes at top. Lower under control.' },
  { name: 'Side plank — left',    anim: 'sideplank', cat: 'core',   desc: 'Left forearm on ground, body straight. Stack feet or stagger for balance.' },
  { name: 'Side plank — right',   anim: 'sideplank', cat: 'core',   desc: 'Right forearm on ground, body straight. Fight the urge to drop your hips.' },
  { name: 'Broad jumps',          anim: 'sqjump',    cat: 'squat',  desc: 'Swing arms back, explode forward as far as possible. Land soft, absorb with legs.' },
  { name: 'Inchworm walk',        anim: 'inchworm',  cat: 'core',   desc: 'Fold forward, walk hands to plank, walk feet back. Control every inch.' },
  { name: 'Explosive push-ups',   anim: 'pushup',    cat: 'push',   desc: 'Push so hard hands leave the floor. Land soft and go right into next rep.' },
  { name: 'Reverse lunge — left', anim: 'lunge',     cat: 'squat',  desc: 'Step left leg back into lunge. Front knee over ankle. Drive up through heel.' },
  { name: 'Reverse lunge — right',anim: 'lunge',     cat: 'squat',  desc: 'Step right leg back into lunge. Front knee over ankle. Drive up through heel.' },
  { name: 'Lateral bounds',       anim: 'lateral',   cat: 'cardio', desc: 'Leap laterally off one foot, land on the other, balance briefly. Build power.' },
  { name: 'T-push-ups',           anim: 'pushup',    cat: 'push',   desc: 'Push up, rotate into side plank with arm raised. Alternate sides each rep.' },
  { name: 'Sumo squats',          anim: 'sqjump',    cat: 'squat',  desc: 'Wide stance, toes out 45°. Sit deep between heels. Drive knees out.' },
  { name: 'Plank shoulder taps',  anim: 'plank',     cat: 'core',   desc: 'High plank, tap opposite shoulders without rotating hips. Feet wider for stability.' },
  { name: 'Jump rope',            anim: 'sqjump',    cat: 'cardio', desc: 'Real rope or not — same motion. Light on feet, elbows in, wrists spinning.' },
  { name: 'Glute bridges',        anim: 'bridge',    cat: 'core',   desc: 'Feet flat, drive hips to ceiling, squeeze glutes hard at top. Hold a beat each rep.' },
  { name: 'Flutter kicks',        anim: 'flutter',   cat: 'core',   desc: 'Lower back pressed flat. Legs 6 inches off floor, small rapid kicks.' },
  { name: 'Hollow body hold',     anim: 'hollow',    cat: 'core',   desc: 'Arms overhead, legs low, lower back on floor. The hardest core hold you\'ll do.' },
  { name: 'Superman hold',        anim: 'superman',  cat: 'core',   desc: 'Face down, lift chest and legs simultaneously. Squeeze glutes and back.' },
  { name: 'Squat thrusts',        anim: 'sqjump',    cat: 'squat',  desc: 'Squat, kick feet out to plank, pull back, stand. No push-up, no jump.' },
  { name: 'Seal jacks',           anim: 'sqjump',    cat: 'cardio', desc: 'Jumping jack but arms clap in front. Keeps tension on front deltoids.' },
  { name: 'Wall sit',             anim: 'wallsit',   cat: 'squat',  desc: 'Thighs parallel to floor, back flat on wall. If it doesn\'t burn, go lower.' },
]

// ─── Timing constants ────────────────────────────────────────
export const WORK_DUR  = 25  // seconds per drill
export const TRANS_DUR = 5   // seconds transition / "get ready"
export const REST_DUR  = 30  // seconds rest every 7 drills
export const REST_AFTER = new Set([6, 13, 20])  // 0-based indices
export const TOTAL_TIME = 985 // 30×25 + 29×5 + 3×30

// ─── Smart shuffle ───────────────────────────────────────────
// No two consecutive 'push' or 'squat' drills.
export function smartShuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < a.length; i++) {
      const c = a[i].cat, p = a[i - 1].cat
      if ((c === 'push' && p === 'push') || (c === 'squat' && p === 'squat')) {
        for (let j = i + 1; j < a.length; j++) {
          if (a[j].cat !== c) { [a[i], a[j]] = [a[j], a[i]]; break }
        }
      }
    }
  }
  return a
}

// ─── No-jump exercise pool ────────────────────────────────────
// Pure calisthenics — no jumping, no running. Reviewed for training
// balance (push / squat / core / cardio) and exercise-specific
// animations. Used for the "No Jump" mode.
export const NO_JUMP_EXERCISES = [
  { name: 'Push-ups (standard)',    anim: 'pushup',        cat: 'push',   desc: 'Hands under shoulders, body in a straight line. Lower until your chest nearly touches the floor, press back up to full lockout.' },
  { name: 'Push-ups (diamond)',     anim: 'pushup',        cat: 'push',   desc: 'Thumbs and index fingers form a diamond under your chest. Elbows track back, not out — this one hits triceps hard.' },
  { name: 'Push-ups (wide-grip)',   anim: 'pushup',        cat: 'push',   desc: 'Hands wider than shoulder-width. Keep your core braced so your hips don\'t sag — loads the chest more.' },
  { name: 'Bodyweight squats',      anim: 'squat',         cat: 'squat',  desc: 'Feet shoulder-width, chest up. Sit your hips back and down past parallel, then drive up through your heels — no jump.' },
  { name: 'Lunges',                 anim: 'lunge',         cat: 'squat',  desc: 'Step forward into a lunge, both knees near 90°. Push back to standing through your front heel, then alternate legs.' },
  { name: 'Sit-ups',                anim: 'crunch',        cat: 'core',   desc: 'Feet anchored, knees bent. Curl your torso all the way up to your knees, then lower under control.' },
  { name: 'Flutter kicks',          anim: 'flutter',       cat: 'core',   desc: 'Lower back pressed into the floor. Legs a few inches up, small quick alternating kicks from the hips.' },
  { name: 'Leg raises',             anim: 'legraise',      cat: 'core',   desc: 'Lying flat, legs straight. Raise them to vertical without swinging, then lower slowly — stop before your feet touch down.' },
  { name: 'Plank hold',             anim: 'plank',         cat: 'core',   desc: 'Straight line from head to heels. Brace your core and squeeze your glutes — don\'t let your hips drop or pike up.' },
  { name: 'Side plank hold',        anim: 'sideplank',     cat: 'core',   desc: 'Stack your feet, forearm under your shoulder. Lift your hips high and hold — switch sides halfway through.' },
  { name: 'Mountain climbers',      anim: 'mtnclimb',      cat: 'core',   desc: 'High plank position. Drive one knee toward your chest at a time, controlled tempo — hips stay low, no hopping.' },
  { name: 'Bear crawl',             anim: 'bearcrawl',     cat: 'cardio', desc: 'Hands under shoulders, knees hovering an inch off the floor. Crawl forward opposite hand/foot, or hold — back flat.' },
  { name: 'Crab walk',              anim: 'crabwalk',      cat: 'cardio', desc: 'Hands and feet on the ground, hips lifted, facing up. Walk forward or side to side, keeping your hips high the whole time.' },
  { name: 'Bicycle crunches',       anim: 'bicyclecrunch', cat: 'core',   desc: 'Hands behind your head, knees bent. Bring elbow to opposite knee in a slow controlled pedal — don\'t pull on your neck.' },
  { name: 'Supermans',              anim: 'superman',      cat: 'core',   desc: 'Face down, arms extended. Lift chest and legs together, squeeze your glutes and lower back at the top.' },
  { name: 'Wall sit',               anim: 'wallsit',       cat: 'squat',  desc: 'Back flat against the wall, thighs parallel to the floor. Hold steady — if it\'s easy, sink a little lower.' },
  { name: 'Glute bridges',          anim: 'bridge',        cat: 'core',   desc: 'Feet flat, knees bent. Drive your hips to the ceiling, squeeze your glutes hard at the top, lower with control.' },
  { name: 'Dead bug',               anim: 'deadbug',       cat: 'core',   desc: 'On your back, arms up, knees bent at 90°. Extend opposite arm and leg toward the floor without arching your lower back.' },
  { name: 'Russian twists',         anim: 'twist',         cat: 'core',   desc: 'Seated, lean back slightly, feet down or lifted. Rotate your torso side to side, driving the movement from your core.' },
  { name: '8-count bodybuilders',   anim: 'bodybuilder8ct',cat: 'push',   desc: 'Squat down, step back into a plank one leg at a time, do a push-up, step back in, and stand tall. No jump, full control.' },
  { name: 'Squat thrusts',          anim: 'squatthrust',   cat: 'squat',  desc: 'Squat down, step both feet back to a plank, step them back in, and stand. No push-up, no jump — just tempo.' },
  { name: 'High knees (marching)',  anim: 'hiknees',       cat: 'cardio', desc: 'March in place, driving your knees to hip height. Pump your arms, stay tall — controlled tempo, not a run.' },
  { name: 'Arm circles',            anim: 'armcircle',     cat: 'cardio', desc: 'Arms straight out to the sides. Small fast circles forward, then reverse — shoulders down, core tight.' },
  { name: 'Low crawl',              anim: 'lowcrawl',      cat: 'cardio', desc: 'Down on your forearms and knees, stay low. Pull yourself forward — military-style, slow and controlled.' },
  { name: 'Duck walk',              anim: 'duckwalk',      cat: 'squat',  desc: 'Deep squat position, staying low the whole time. Waddle forward, thighs staying parallel to the ground.' },
]

// ─── Build a fixed-length drill set from a pool ──────────────
// Uses every pool item once (shuffled), then fills the remainder
// with random picks (never repeating the previous drill), and
// applies smartShuffle's push/squat spacing rule to the result.
export function buildDrillSet(pool, n = 30) {
  if (pool.length >= n) return smartShuffle(pool).slice(0, n)
  const result = smartShuffle(pool)
  while (result.length < n) {
    let candidate
    do {
      candidate = pool[Math.floor(Math.random() * pool.length)]
    } while (pool.length > 1 && candidate.name === result[result.length - 1].name)
    result.push(candidate)
  }
  return smartShuffle(result)
}
