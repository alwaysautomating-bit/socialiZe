# socialiZe

AI-powered social media content optimizer. Turn raw thoughts into platform-ready posts for LinkedIn, X, Instagram, Facebook, TikTok, and YouTube.

Built with React 19, TypeScript, Vite 6, Tailwind CSS 3, and Google Gemini AI.

## Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Development

Run the Vite app on port 3000 and the local serverless function bridge on port 9999:

```
npm run dev
```

The client calls `/api/translate`. During local development, Vite proxies that route to `netlify/functions/translate.ts`.

`npm run preview` is static-only. It does not run the API endpoint, so `/api/translate` will 404 there.

The older `server/` Express backend has been removed because it was no longer used by the current Vite + serverless deployment path.

## Validation

```
npm run typecheck
npm test
npm run build
```

## Production Deployment

Vercel serves the static app from `dist` and the API from `api/translate.ts`.

Required environment variables:

- `GEMINI_API_KEY`

Recommended Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 18+ or 20+

## Architecture

- `src/` - React client
- `api/` - Vercel serverless API endpoints
- `netlify/functions/` - local development bridge for the Gemini endpoint
- `shared/` - shared prompt and schema definitions
- `public/` - static assets

## Cleanup Notes

- Required env var is `GEMINI_API_KEY` in `.env.example`, local code, and Vercel.
- `netlify-cli` is still used only for local development. Keeping it is the smallest safe option for now.
- If you later want one deployment runtime for both local and cloud, switching to `vercel dev` would be reasonable, but that is not necessary for this cleanup.
