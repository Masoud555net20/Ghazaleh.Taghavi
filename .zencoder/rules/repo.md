# Repository Overview - Ghazaleh Taghavi Legal Consultation

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler/Dev**: Vite 6
- **Styling**: Tailwind utility classes inline (no dedicated config in repo)
- **PWA**: `vite-plugin-pwa`
- **AI Service**: Groq API (`llama-3.1-8b-instant`) via Axios

## Structure (key paths)
- **Root**
  - `App.tsx`, `index.tsx`, `index.html`
  - `package.json`, `tsconfig.json`, `vite.config.ts`
  - `.env`, `.env.local` (API keys)
- **components/** UI sections (Header, Hero, Services, About, Process, LegalAssistant, Booking, Payment, FAQ, Blog, Testimonials, Footer)
- **services/** `groqService.ts` (AI calls)
- **public/** assets and fonts (e.g., `Font/IranNastaliq.ttf`)
- **dist/** build output

## Environment
- Required: `VITE_GROQ_API_KEY` (in `.env.local` for local dev)
- Optional: `GEMINI_API_KEY` (present in docs but not used in codebase)

## Scripts
- `npm run dev` → start Vite dev server
- `npm run build` → production build
- `npm run preview` → preview built app

## AI Integration Notes
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Headers: `Authorization: Bearer ${VITE_GROQ_API_KEY}`
- Model: `llama-3.1-8b-instant`
- Post-processing: Appends a Persian consultation encouragement if missing

## UI/RTL/Persian
- All text is Persian (RTL); ensure right-to-left considerations
- Custom font `IranNastaliq.ttf`
- Header includes scroll-based style changes and mobile menu

## Known Conventions
- Local state only (no global state lib)
- Graceful error handling for AI failures
- Lazy loading used for non-critical sections (per project notes)

## Quick Tips
- If AI fails, check `.env.local` and network
- Optimize large hero images before production
- PWA files present under `dist/` after build