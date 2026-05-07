# SoloLevel Fitness — MVP Specification

## 1. Concept & Vision

**SoloLevel Fitness** transforms workout routines into a dark fantasy RPG experience inspired by Solo Leveling. You are a Hunter awakening to the System — every rep kills monsters, every workout grants XP, every day brings you closer to S-Rank. The app feels like the System chose you, and it's watching everything you do.

The vibe: mysterious, dark, powerful. Like Jinwoo staring at his stat window for the first time.

---

## 2. Design Language

### Aesthetic Direction
Dark fantasy RPG with Korean manhwa energy. Think stat windows, glowing UI panels, dungeon portals, shadow aesthetics. The System should feel like it's *actually there*, embedded in your phone.

### Color Palette
- **Primary Background:** `#0D0D1A` (deep void black-blue)
- **Secondary Background:** `#1A1A2E` (dark navy)
- **Panel/Card:** `#16213E` (midnight blue)
- **Accent Gold:** `#FFD60A` (Jinwoo's system gold)
- **Accent Blue Glow:** `#4FC3F7` (stat/skill highlights)
- **Danger Red:** `#FF4757` (low HP, warnings)
- **Success Green:** `#2ED573` (quest complete, level up)
- **Text Primary:** `#E8E8E8` (off-white)
- **Text Secondary:** `#8892A0` (muted gray-blue)
- **Text Accent:** `#FFD60A` (gold for important numbers/stats)

### Typography
- **Headings:** `Cinzel` (Google Font) — regal, fantasy feel
- **Body/Stats:** `Rajdhani` (Google Font) — futuristic yet readable, RPG stat windows
- **Fallback:** `system-ui, sans-serif`

### Spatial System
- Base unit: 8px
- Card padding: 16-24px
- Section gaps: 24-32px
- Mobile-first: max-width 480px content, centered

### Motion Philosophy
- **System activation:** Glitch/flicker effect on first load (like System window appearing)
- **XP gain:** Number flies up and fades, gold glow pulse
- **Level up:** Screen flash + particle burst animation (CSS keyframes)
- **Quest complete:** Checkmark + strike-through animation
- **Stat increases:** Counter tick-up animation
- **Hover states:** Subtle glow intensification (box-shadow transition 200ms)

### Visual Assets
- Icons: Lucide React (clean, consistent)
- Decorative: CSS-generated glow effects, gradient borders, pseudo-element decorations
- No external images needed for MVP — pure CSS/SVG aesthetic

---

## 3. Layout & Structure

### Page Structure
Single-page app with tab navigation:

```
┌─────────────────────────┐
│  SYSTEM STATUS BAR       │  ← Fixed top: Rank, XP bar, level
├─────────────────────────┤
│                         │
│  MAIN CONTENT AREA      │  ← Scrollable, switches by tab
│  (Dashboard/Quests/     │
│   Profile)              │
│                         │
├─────────────────────────┤
│  TAB NAVIGATION         │  ← Fixed bottom: 3 tabs
└─────────────────────────┘
```

### Tabs
1. **Dashboard** — Stats overview, daily progress, quick actions
2. **Quests** — Daily missions, exercise logging
3. **Profile** — Rank progression, history, achievements

### Responsive Strategy
- Mobile-first (320px+)
- Max content width: 480px, centered
- Touch-friendly tap targets: 44px minimum

---

## 4. Features & Interactions

### Core Features

#### 4.1 System Activation Screen (First Launch)
- Full-screen dark overlay with "SYSTEM ACTIVATING..." text
- Glitch/flicker effect for 2 seconds
- Stat allocation mini-game: user distributes 10 bonus points across STR/STA/AGI/VIT
- Transition to dashboard with dramatic reveal

#### 4.2 Dashboard
- **Hunter Profile Card:** Rank badge, username, level, title
- **XP Progress Bar:** Current XP / Next level XP, animated fill
- **Stat Grid:** 2x2 grid showing STR, STA, AGI, VIT with icons
- **Daily Progress:** Quests completed X/Y, streak counter
- **Quick Quest Button:** Jump to today's quests

#### 4.3 Quest System
- **Daily Quests:** 5 quests per day, reset at midnight
- **Quest Types:**
  - "Hunt 10 Low-Level Monsters" = 10 push-ups
  - "Clear a Dungeon Floor" = 20 squats
  - "Train your Stamina" = 30 seconds plank
  - "Hunt a Boss Monster" = 15 burpees
  - "Meditate in the Shadow" = 45 seconds wall sit
- **Logging:** Tap quest → modal with rep counter → increment → complete
- **Rewards:** XP per quest, bonus XP for completing all daily quests

#### 4.4 Exercise Logger
- Quest detail modal with:
  - Exercise name + monster equivalent
  - Rep counter (increment/decrement buttons)
  - Target rep count
  - Progress bar
  - "Claim Victory" button when target reached
- Haptic feedback on increment (if supported)

#### 4.5 Level & Rank System
- **Levels:** 1-99 (XP thresholds: level * 100)
- **Ranks:** E → D → C → B → A → S
- Rank ups at levels: E(1), D(10), C(25), B(40), A(60), S(80)
- Rank change triggers special animation + congratulatory modal

#### 4.6 Stats System
- **STR (Strength):** Increases damage dealt, shown on attack stats
- **STA (Stamina):** Increases max HP, shown on health stats
- **AGI (Agility):** Increases dodge speed, shown on speed stats
- **VIT (Vitality):** Increases HP regen, shown on recovery stats
- Stats increase on level up (+1-3 random) and via bonus point allocation

### Interaction Details
- **Quest tap:** Ripple effect → modal slides up (300ms ease-out)
- **Rep increment:** +1 floats up from button, number ticks
- **Quest complete:** Strike-through animation, gold particles, XP flies to bar
- **Level up:** Screen dims, "LEVEL UP" text scales in, stats flash
- **Tab switch:** Content cross-fades (150ms)

### Edge Cases
- **All quests complete:** Show "All Quests Cleared!" banner with bonus XP notification
- **Streak broken:** Sympathetic message, offer "redemption quest"
- **First launch:** System activation sequence only shows once

---

## 5. Component Inventory

### SystemStatusBar
- **States:** Normal, XP gain (glow animation), level up (flash)
- **Elements:** Rank icon, level number, XP bar with percentage

### HunterCard
- **States:** Default, rank-up pending (glow), new user (pulsing border)
- **Elements:** Avatar placeholder (CSS gradient), name, rank badge, level

### StatBlock
- **States:** Default, increasing (green flash), decreasing (red flash), bonus (gold glow)
- **Elements:** Icon, stat name, stat value, increment indicator

### QuestCard
- **States:** Available, in-progress (progress ring), completed (checkmark + dimmed), locked
- **Elements:** Quest name, description, monster equivalent icon, XP reward, progress

### QuestModal
- **States:** Open, closing, exercise active, quest complete
- **Elements:** Exercise name, rep counter, target display, progress bar, complete button

### TabBar
- **States:** Tab active (gold underline + glow), tab inactive
- **Elements:** Icon, label (hidden on small screens)

### XPBar
- **States:** Idle, filling (animated), full (triggers level up), level up flash
- **Elements:** Fill bar, current/next XP numbers, level indicator

### RankBadge
- **States:** E/D/C/B/A/S with distinct colors per rank
- **Elements:** Rank letter, glow intensity matches rank power

---

## 6. Technical Approach

### Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** CSS Modules or vanilla CSS with CSS variables
- **State:** React useState + useEffect (localStorage persistence)
- **Icons:** Lucide React
- **Animations:** CSS keyframes + transitions

### Data Model
```typescript
interface Hunter {
  id: string;
  name: string;
  level: number;
  xp: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  stats: {
    str: number;
    sta: number;
    agi: number;
    vit: number;
  };
  createdAt: string;
  streak: number;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  exercise: string;
  targetReps: number;
  xpReward: number;
  completed: boolean;
  currentReps: number;
}

interface DailyState {
  date: string;
  quests: Quest[];
  questsCompleted: number;
}
```

### Storage
- `localStorage` for all data (no backend)
- Keys: `sololevel_hunter`, `sololevel_daily`
- Auto-save on every state change

### File Structure
```
solo-leveling-fitness/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── SPEC.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── components/
    │   ├── SystemStatusBar.tsx
    │   ├── Dashboard.tsx
    │   ├── Quests.tsx
    │   ├── Profile.tsx
    │   ├── QuestModal.tsx
    │   ├── TabBar.tsx
    │   └── ActivationScreen.tsx
    ├── hooks/
    │   └── useGameState.ts
    └── utils/
        └── storage.ts
```

---

## Implementation Notes

- All animations via CSS keyframes — no external animation library needed
- localStorage syncs on every state change via useEffect
- System activation only shows when no saved Hunter data exists
- Daily quests regenerate if date has changed since last session