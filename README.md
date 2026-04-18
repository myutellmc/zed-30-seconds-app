# Zed Rush

The Zambian party word-guessing game. Teams race to describe as many words as possible in 30 seconds — without using the forbidden words on the card.

Built as a Progressive Web App (PWA) installable on Android and iOS, with full offline support.

## How to Play

1. Split into two or more teams
2. One player describes the main word — teammates guess
3. You cannot say the word, rhyme it, spell it, or use "sounds like" clues
4. Each correct guess earns one point
5. Most points after all rounds wins

## Features

- **30-second rounds** with urgent countdown animation
- **2–5 teams** with custom team names and player lists
- **Configurable rounds** (1, 5, 10, 15, or 20)
- **354 Zambia-relatable cards** — people, places, culture, food, and more
- **Dark / light / system theme** toggle (available on the menu screen)
- **Confetti celebration** when the game ends
- **Offline support** — works without internet once installed
- **Installable PWA** — add to home screen on Android and iOS

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Convex (data persistence)
- canvas-confetti
- next-themes
- Custom Service Worker (PWA)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
/
├── public/
│   ├── zed-rush-logo.png           # App logo
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker
│   └── .well-known/
│       └── assetlinks.json         # Android TWA verification
├── src/
│   ├── components/
│   │   └── ThemeToggle.tsx         # Dark/light/system theme switcher
│   ├── pages/
│   │   ├── Index.tsx               # Main game (all screens)
│   │   └── Rules.tsx               # Full rules page
│   └── utils/
│       └── cards.ts                # 354-card word deck
└── index.html
```

## Android / Google Play

This app is packaged as a Trusted Web Activity (TWA) for Google Play using [PWABuilder](https://pwabuilder.com).

- Package name: `com.zedrush.game`
- After uploading to Play Console, update `public/.well-known/assetlinks.json` with the SHA-256 fingerprint from **Setup → App integrity**.

## Deployment

Hosted on Vercel. Every push to `main` triggers an automatic deployment.
