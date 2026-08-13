# Elagon AI Website v3

Production-oriented implementation of the approved Elagon editorial system and Figma Hero direction.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The website runs with source-controlled fallback content when no external services are configured.

## Content and integrations

- Sanity: set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`, then run `npm run studio`.
- Resend: set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL`.
- PostHog: set `NEXT_PUBLIC_POSTHOG_KEY`; Vercel Analytics and Speed Insights activate on Vercel.

The first release uses layered DOM media and GSAP. `VisualStageProps` and `MotionPreset` in `types/content.ts` provide the stable boundary for a later Three.js/WebGL renderer without coupling page content to a rendering engine.

## Routes

- `/`
- `/services`
- `/work`
- `/work/[slug]`
- `/approach` (labelled Playbook)
- `/company`
- `/contact`

Brand and interface guidance lives in `doc/ELAGON_design_system.md`.
