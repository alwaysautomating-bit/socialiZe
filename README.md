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

Start both the Vite dev server (port 3000) and the Express API server (port 3001):

```
npm run dev
```

The Vite dev server proxies `/api` requests to the Express server automatically.

## Testing

```
npm test
```

## Production Build

Build the client:

```
npm run build
```

Start the production server (serves static files + API):

```
npm start
```

## Architecture

- `src/` — React client (Vite + TypeScript)
- `server/` — Express API server (proxies Gemini calls, keeps API key server-side)
- `shared/` — Code shared between client and server (system instruction, response schema)
- `public/` — Static assets (favicon, OG image)
