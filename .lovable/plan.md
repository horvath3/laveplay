# Lave Play — Premium Cloud Gaming Platform

A polished, dark-futuristic cloud gaming UI (GeForce NOW / Xbox Cloud caliber) with green `#76B900` accents, glassmorphism, animated backgrounds, and smooth transitions. Bilingual EN/HU via a nav toggle, realistic mock data throughout, and a beautiful login screen (no real auth yet — backend deferred).

## Visual Direction

- **Theme:** Deep near-black background (`oklch` ~0.14), layered translucent glass panels, subtle green glow accents.
- **Accent:** `#76B900` (Lave green) as primary, with a brighter glow variant for hovers/CTAs.
- **Typography:** `Outfit` for display/headings (bold, techy), `Figtree` for body — loaded via `@fontsource` and wired into Tailwind v4 `@theme`.
- **Effects:** Glass cards (`backdrop-blur`, translucent borders), animated aurora/grid background behind hero, gradient text on titles, glow-on-hover, scale/lift card hovers, rounded-2xl corners.
- **Motion:** Framer Motion for page transitions (fade/slide) and entrance animations.
- **Responsive:** Mobile, tablet, desktop — nav collapses to a mobile menu; grids reflow.

## Pages & Routes

```
src/routes/
  __root.tsx            -> shell + providers (i18n, motion) + real metadata
  index.tsx             -> Home
  library.tsx           -> Library
  my-pc.tsx             -> My PC
  settings.tsx          -> Settings
  login.tsx             -> Login
```

**Home** — Full-bleed animated hero: title "Play Your Own PC Anywhere" (gradient), subtitle "Turn your gaming PC into your own cloud gaming server.", large glowing Play button. Below/beside it a **PC Status glass card**: Online/Offline pill, CPU, GPU, RAM, Storage, Internet (mock values, e.g. Ryzen 7 7800X3D, RTX 4080, 32 GB, 2 TB NVMe, 940 Mbps).

**Library** — Responsive grid of premium game cards: cover art, title, Play button, "Installed" badge on some. Cover art generated as real gaming-style images (no lorem/placeholder).

**My PC** — Live-styled system dashboard: CPU/GPU/RAM/temperature/usage meters (animated gauges/progress bars with mock live-updating values), storage breakdown, network stats.

**Settings** — Cards/toggles for Dark mode, Streaming quality (Balanced/Performance/Quality), Resolution (720p/1080p/1440p/4K), Controller support toggle, plus language selector.

**Login** — Centered glass card over animated background: LAVE PLAY logo, email/password fields, sign-in button, social buttons — visual only, routes to Home on submit.

## Navigation

- Top glass nav bar with **LAVE PLAY** logo (green mark), links to all pages with active states, an **EN/HU language toggle**, and a login/account button.
- Mobile/tablet: collapsible menu.

## Bilingual (EN/HU)

- Lightweight i18n via a React context + a `translations` dictionary (`en` / `hu`) covering all UI strings — no external lib needed. Toggle in nav; choice persisted to `localStorage` (read in `useEffect` to avoid SSR mismatch).

## Data

- All stats, games, and system info come from a typed `src/data/*` mock module with realistic values. Structured so a Lovable Cloud backend can replace it later.

## Assets

- Generate ~6–8 game cover images and a hero background via image generation, stored in `src/assets/` and imported directly.

## Technical Notes

- Tailwind v4: add green + glass tokens to `src/styles.css` `@theme`/`:root`; fonts via `@fontsource/outfit` + `@fontsource/figtree` imported in `src/main.tsx` (or entry), referenced in `@theme`.
- Framer Motion (`motion`) for transitions; shared `PageTransition` wrapper.
- Reusable components: `NavBar`, `GameCard`, `PcStatusCard`, `StatMeter`, `GlassCard`, `LanguageToggle`.
- Each route sets its own `head()` metadata; real title/description on `__root.tsx` (replacing "Lovable App").
- No real auth, no backend this round.

Once approved I'll generate assets and build all five pages.  
  
  
  
  
  
The plan looks great. Before building, please extend it with the following features because this project will later become a fully functional personal cloud gaming platform.

Architecture

- Prepare a clean architecture for future integration with a Windows application called Lave Agent.

- The frontend should be ready to receive live data through WebSocket or Server-Sent Events.

- Separate UI components from future API services.

Game Library

- Support automatic Steam library synchronization in the future.

- Design the library so games from Epic Games, Ubisoft Connect, EA App and local executables can also be supported later.

- Add Favorite games.

- Add Recently Played.

- Add Last Played timestamp.

- Add Play Time display.

- Add Installed Size.

Remote PC

Extend the My PC page with placeholders for:

- CPU temperature

- GPU temperature

- Fan speed

- Battery status (for laptops)

- Current running game

- Windows uptime

- Internet latency

- Upload speed

- Download speed

Streaming

Prepare the UI for future streaming support:

- Stream status

- Current resolution

- FPS

- Bitrate

- Codec

- Connection quality

- Network latency

- Packet loss

- Controller connected

Home

Add sections for:

- Continue Playing

- Recently Added Games

- Favorite Games

- Recommended Actions

- PC Online Status

- Quick Launch

Controller Support

Design every page tablet-first.

Large buttons.

Controller friendly spacing.

Touch friendly controls.

Settings

Prepare future options for:

- Wake-on-LAN

- Auto sleep after gaming

- Auto shutdown after gaming

- Auto launch Steam

- Auto reconnect

- Notification preferences

Future Features

Reserve navigation placeholders for:

- Downloads

- Screenshots

- Game Saves

- Remote Desktop

- Activity Log

Branding

Create a complete design system including:

- Color palette

- Typography scale

- Button system

- Iconography

- Card variants

- Animation guidelines

Please update the implementation plan only.

Do not start building yet.