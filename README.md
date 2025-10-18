# Vocaloid Type

Vocaloid Type is a browser-based typing rhythm trainer for VOCALOID and UTAU tracks. Watch the full music video, follow the lyric timings, and type the romaji transcription to climb the maimai-inspired grading ladder.

## Features

- Song browser with animated cover art, artist metadata, and quick search via keyboard navigation.
- Speed selector with pre-set playback multipliers (0.5×–1.25×) so you can practise at comfortable tempos.
- Video variants (instrumentals, alt cuts) surfaced through a context menu when multiple sources are available.
- Real-time score, grade, and hit statistics powered by romaji accuracy tracking and maimai-style judgments.
- Full result screen with celebration loop, replay/menu shortcuts, and cloud-hosted assets configured through environment variables.

## Prerequisites

- Node.js ≥ 20 (earlier LTS releases may fail because the project targets Next.js 15).
- A package manager (`npm`, `pnpm`, `yarn`, or `bun`).
- Hosted media assets (covers and videos) reachable from the browser.

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   # or: pnpm install | yarn install | bun install
   ```

2. Create `.env.local` and point it to the bucket or CDN that serves your media:

   ```ini
   NEXT_PUBLIC_STORAGE_URL=https://your-storage.example.com
   ```

3. Launch the dev server:

   ```bash
   npm run dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) and pick a song to start typing.

## Gameplay

- Pick a track from the landing grid; the Escape key closes any open dialogs.
- Select a playback speed tab, or right-click the jacket to choose a video variant when available.
- Type the romaji lyrics that appear in sync with the video; input is case-insensitive and ignores punctuation.
- Watch your score and grade update live; the game auto-advances lines as soon as you finish typing them.
- When the song ends, review your achievement rate on the result screen and replay or return to the menu.

## Adding Songs

Song metadata lives in `app/data/songs.json`. Each entry points to a cover image and video under `NEXT_PUBLIC_STORAGE_URL`, plus time-stamped lyric lines:

```jsonc
{
  "slug": "mesmerizer",
  "title": "メズマライザー",
  "artist": "32ki",
  "bpm": 185,
  "cover": "mesmerizer.jpeg",
  "video": "mesmerizer.mp4",
  "lyrics": [
    { "time": "00:14.14", "text": "実際の感情はno think!" }
  ],
  "lyrics_romaji": [
    { "time": "00:14.14", "text": "jissai no kanjou wa no think" }
  ],
  "variants": {
    "video": [
      { "name": "Instrumental", "url": "mesmerizer-instrumental.mp4" }
    ]
  }
}
```

- `lyrics` and `lyrics_romaji` share timestamps so the typing interface can align romaji prompts with the MV.
- Upload the matching `cover` and `video` files to `${NEXT_PUBLIC_STORAGE_URL}/vocaloid/images` and `/vocaloid/videos`, or adjust the code if you prefer a different layout.

## Deployment

The project targets the Next.js App Router and runs without custom server code, so it can be deployed directly to Vercel or any platform that supports Next.js 15 static/SSR builds. Remember to provision the same environment variables used locally and ensure your storage host supports cross-origin streaming for the video files.

## Tech Stack

- Next.js 15 + React 19 (App Router, server components, and client-side interactivity)
- Tailwind CSS 4 with `tailwind-merge` and `clsx` for styling
- `motion` for animated overlays and transitions
- Radix UI primitives for tabs and context menu components
- `wanakana`-powered romaji typing assistance

Happy typing!
