# LaunchFlow

LaunchFlow is a modern SaaS-style social media management dashboard.

## Included in v1

- Overview dashboard
- Connected social accounts
- Post composer
- Draft/scheduled/published post views
- Calendar
- Analytics dashboard
- Settings screen
- Responsive dark UI
- Local demo state for creating posts and connecting accounts

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Next phase

The current release is a functional front-end prototype. Real social publishing will require OAuth/API integrations for platforms such as Instagram, TikTok, YouTube, LinkedIn and X, plus a backend for secure tokens, media storage, scheduling workers and persistent data.
