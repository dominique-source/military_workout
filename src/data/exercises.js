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
// Pure calisthenics — no jumping, no running. Used for the "No Jump" mode.
export const NO_JUMP_EXERCISES = [
  { name: 'Push-ups (standard)',    anim: 'pushup',    cat: 'push',   desc: 'Chest to floor, full lockout at top. Elbows 45° from body. Controlled tempo, no rushing.' },
  { name: 'Push-ups (diamond)',     anim: 'pushup',    cat: 'push',   desc: 'Hands form a diamond under your chest. Triceps-focused. Full range every rep.' },
  { name: 'Push-ups (wide-grip)',   anim: 'pushup',    cat: 'push',   desc: 'Hands wider than shoulders. Chest does the work. Keep hips level, no sagging.' },
  { name: 'Bodyweight squats',      anim: 'squat',     cat: 'squat',  desc: 'Feet shoulder-width, sit back and down to parallel. Drive through heels — no jump.' },
  { name: 'Lunges',                 anim: 'lunge',     cat: 'squat',  desc: 'Step into a lunge, front knee over ankle, back knee light tap. Alternate legs, stay controlled.' },
  { name: 'Sit-ups',                anim: 'crunch',    cat: 'core',   desc: 'Feet anchored, curl all the way up to your knees, lower with control.' },
  { name: 'Flutter kicks',          anim: 'flutter',   cat: 'core',   desc: 'Lower back pressed flat. Legs a few inches off the floor, small rapid kicks.' },
  { name: 'Leg raises',             anim: 'legraise',  cat: 'core',   desc: 'Lying flat, legs straight, raise to vertical without swinging. Lower slow — don\'t let feet touch down.' },
  { name: 'Plank hold',             anim: 'plank',     cat: 'core',   desc: 'Rigid from head to heels. Squeeze glutes and abs. Breathe steady.' },
  { name: 'Side plank hold',        anim: 'sideplank', cat: 'core',   desc: 'Forearm on ground, body straight. Stack or stagger feet for balance.' },
  { name: 'Mountain climbers',      anim: 'hiknees',   cat: 'core',   desc: 'Plank position, drive knees to chest one at a time. Slow controlled tempo — no hop.' },
  { name: 'Bear crawl',             anim: 'donkey',    cat: 'cardio', desc: 'Hands and feet on the ground, knees hovering. Crawl in place or a short distance, back flat.' },
  { name: 'Crab walk',              anim: 'bridge',    cat: 'cardio', desc: 'Hands and feet on ground, hips lifted. Walk forward or hold, keep hips high.' },
  { name: 'Bicycle crunches',       anim: 'vup',       cat: 'core',   desc: 'Elbow to opposite knee, extend the other leg. Slow controlled rotation — no yanking the neck.' },
  { name: 'Supermans',              anim: 'superman',  cat: 'core',   desc: 'Face down, lift chest and legs together. Squeeze glutes and back at the top.' },
  { name: 'Wall sit',               anim: 'wallsit',   cat: 'squat',  desc: 'Thighs parallel to floor, back flat on wall. Hold steady, breathe through the burn.' },
  { name: 'Glute bridges',          anim: 'bridge',    cat: 'core',   desc: 'Feet flat, drive hips to ceiling, squeeze glutes hard at the top. Hold a beat each rep.' },
  { name: 'Scissor kicks',          anim: 'flutter',   cat: 'core',   desc: 'Legs straight and low off the floor, cross over each other. Core braced throughout.' },
  { name: 'Russian twists',         anim: 'twist',     cat: 'core',   desc: 'Seated, lean back slightly, rotate torso side to side. Feet up for extra challenge, down for control.' },
  { name: '8-count bodybuilders',   anim: 'inchworm',  cat: 'push',   desc: 'Squat down, step back to plank one leg at a time, push-up, step back in, stand. No jump.' },
  { name: 'Squat thrusts',          anim: 'inchworm',  cat: 'squat',  desc: 'Squat, step feet back to plank, step back in, stand. No push-up, no jump.' },
  { name: 'High knees (marching)',  anim: 'hiknees',   cat: 'cardio', desc: 'March in place, drive knees to hip height. Controlled tempo, pump your arms, stay tall.' },
  { name: 'Arm circles',            anim: 'armcircle', cat: 'push',   desc: 'Arms straight out, small fast circles forward then back. Shoulders down, core tight.' },
  { name: 'Low crawl',              anim: 'plank',     cat: 'cardio', desc: 'On elbows and knees, stay low, pull yourself forward. Military-style, controlled and steady.' },
  { name: 'Duck walk',              anim: 'squat',     cat: 'squat',  desc: 'Deep squat position, waddle forward staying low. Thighs stay parallel to the ground.' },
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
