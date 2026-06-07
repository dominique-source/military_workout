# Military Blitz — 30 Drills · 25s each

A military-style interval workout app built with React 18 + Vite 5.

---

## Stack
- React 18 + Vite 5
- No CSS framework — custom CSS variables (dark military theme)
- Fonts: Barlow Condensed (display) + IBM Plex Mono (data/labels)
- Web Speech API for voice countdown
- SVG SMIL animations for stick figures
- Deployed on Vercel, repo on GitHub

---

## Features (already built)
- 30 drills × 25 seconds = base 16:25 total
- 5-second animated transition between each drill ("Get Ready" screen shows next drill + animation)
- Voice counts down 5-4-3-2-1 per drill, says "Next: [name]" on transition, "Go" on start
- 30-second rest automatically after drills 7, 14, and 21
- Smart shuffle: no two consecutive push or squat drills
- Queue below the card — click to jump (while running) or preview (while paused)
- Preview mode: pausing and clicking a drill shows its name, animation, and coaching cue
- "▶ Start from this drill" button in preview mode
- 100-square session tracker with milestone badges (10 / 25 / 50 / 75 / 100)
- Color-coded squares that progress through greens to gold at 100

---

## Project structure

```
src/
  App.jsx                  Main state machine (phase: idle|working|transition|resting|done)
  App.css                  All styles via CSS custom properties
  data/
    exercises.js           30 drills with name, anim key, category, coaching desc + timing constants
  hooks/
    useVoice.js            Web Speech API wrapper
  components/
    DrillCard.jsx          Main timer card — handles all phase rendering
    StickFigure.jsx        SVG SMIL animations for each drill type
    Queue.jsx              Scrollable drill queue with click-to-jump/preview
    SessionTracker.jsx     100-square workout log with milestones
```

---

## Dev

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
```

---

## Claude Code — Onboarding prompt

Paste this into Claude Code to continue development:

---

**CONTEXT**

This is Military Blitz, a React 18 + Vite 5 workout timer app. It is fully functional. The core logic lives in `src/App.jsx` (state machine with phases: idle → working → transition → resting → done). All 30 drills are in `src/data/exercises.js`. Timing: 25s work, 5s transition, 30s rest every 7 drills.

**DESIGN DIRECTION**

The app needs a bold, tactical visual upgrade while staying dark and functional. Reference: PürInstinct brand — dark backgrounds, strong lime/military green (#639922) accents, Barlow Condensed for display type, IBM Plex Mono for data. Think operations room meets training app — no gradients, no fluff, just clean contrast and strong hierarchy.

Specific design tasks:
1. Add a proper app header/nav with a logo lockup ("MILITARY BLITZ" in Barlow Condensed 900 weight, small subtitle "30 · 25s · Elite")
2. Make the main DrillCard more dramatic — the drill name should be much larger (50–60px) when in ACTIVE phase
3. The timer number should be the hero element — make it enormous (100–120px) with a subtle circular progress ring behind it
4. Add a thin animated top-border to the card that pulses green during the WORKING phase and goes white during TRANSITION
5. The GET READY / transition screen should feel different — maybe a slight green tint overlay or background shift
6. REST screen: make it calming — the breathing animation and a slow pulse, no harsh colors
7. Mobile-first: the app should feel native on iOS/Android — large tap targets, no horizontal scroll, safe area insets
8. Session tracker squares: add a subtle grid label on the left (10, 20, 30... by row) for orientation
9. Add localStorage persistence for the session tracker so the count survives page refresh
10. Add a PWA manifest + service worker so the app is installable on mobile

**KEEP THESE UNCHANGED**
- All timing ratios: 25s/5s/30s
- All 30 drills and their categories
- The smart shuffle logic (no 2 push or 2 squat in a row)
- Voice countdown logic in `useVoice.js`
- The SVG SMIL animations in `StickFigure.jsx`
- The phase state machine logic in `App.jsx`

**DEPLOY**
- GitHub repo: [YOUR REPO URL HERE]
- Already linked to Vercel — push to main to deploy

---
