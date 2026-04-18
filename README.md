# 🎨 Social Media Studio

**Transform rough ideas into polished, brand-consistent Instagram carousels with AI.** Type a messy thought → get a designed, ready-to-post visual carousel. Built for Cuemath's content team targeting parents with learning science, math education, and child confidence content.

> From messy input to polished output — that's the entire product.

---

## 🚀 Live URL

> **Frontend:** [Deploy to Vercel]  
> **Backend:** [Deploy to Render]  
> *(Add your deployed URLs here after deployment)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Animations | Framer Motion |
| Styling | Vanilla CSS with CSS Variables (Light/Dark theme) |
| State | useContext + useReducer |
| Backend | Node.js + Express |
| LLM | OpenAI GPT-4o / Anthropic Claude Sonnet |
| Image Gen | DALL-E 3 |
| Export | html2canvas + JSZip + FileSaver |
| Icons | Lucide React |

---

## ⚡ Local Setup

### Prerequisites
- Node.js 18+ 
- npm 9+
- OpenAI API key (required for LLM + image generation) **OR** Anthropic API key (for LLM only)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/social-media-studio.git
cd social-media-studio
```

### 2. Setup the server
```bash
cd server
cp .env.example .env
# Edit .env and add your API keys
npm install
npm run dev
```

### 3. Setup the client (new terminal)
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### 4. Open the app
Navigate to `http://localhost:5173`

---

## 🔑 Environment Variables

### Server (`server/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes* | OpenAI API key for GPT-4o and DALL-E 3 |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key for Claude Sonnet |
| `LLM_PROVIDER` | No | `"openai"` or `"anthropic"` (default: openai) |
| `PORT` | No | Server port (default: 3001) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |

*At least one LLM API key is required. OpenAI key enables both text and image generation.

### Client (`client/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: /api via Vite proxy) |

---

## 🏗️ Key Decisions & Tradeoffs

1. **Dual LLM support** — Supports both OpenAI and Anthropic to give flexibility. OpenAI is preferred since it also powers DALL-E 3 image generation.

2. **CSS Variables over Tailwind** — Vanilla CSS with CSS custom properties enables seamless light/dark theming with smooth transitions, and avoids framework lock-in.

3. **useReducer over Redux** — For an app of this scope, useContext + useReducer provides sufficient state management without the overhead of external libraries.

4. **Progressive image loading** — Text slides are returned immediately from the LLM. Image generation triggers in parallel afterward, so users see content instantly while visuals fill in.

5. **Brand kit in localStorage** — Persists brand colors, font, tone, and logo across sessions without requiring user accounts or backend storage.

6. **Hidden export container** — Full-resolution (1080px) slide elements are rendered off-screen for pixel-perfect PNG export, separate from the responsive preview display.

7. **Graceful degradation** — If DALL-E isn't available, slides show beautiful gradient backgrounds using brand colors. The app is fully functional without image generation.

---

## 🔮 What I'd Improve With More Time

- **Drag-and-drop slide reordering** with smooth animations
- **Multiple carousel templates** — different layout compositions per slide role
- **Real-time collaborative editing** with WebSocket sync
- **Scheduled publishing** via Instagram Graph API integration
- **Analytics dashboard** tracking which carousel topics perform best
- **Custom image upload** per slide as an alternative to AI generation
- **PDF export** option alongside PNG/ZIP
- **Undo/Redo** system for all slide edits
- **A/B title suggestions** — generate 3 title variants per slide for A/B testing
- **Progressive Web App** support for offline access to saved carousels

---

## 📁 Project Structure

```
social-media-studio/
├── client/                          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── IdeaInput.jsx        # Main idea input with presets
│   │   │   ├── BrandKit.jsx         # Brand profile sidebar
│   │   │   ├── CarouselPreview.jsx  # Animated slide viewer
│   │   │   ├── SlideCard.jsx        # Individual slide with editing
│   │   │   ├── Toolbar.jsx          # Global action bar
│   │   │   └── GenerationHistory.jsx # Past carousels sidebar
│   │   ├── context/
│   │   │   └── StudioContext.jsx    # Global state management
│   │   ├── hooks/
│   │   │   ├── useCarousel.js       # Carousel operations
│   │   │   └── useBrandKit.js       # Brand kit persistence
│   │   ├── utils/
│   │   │   ├── api.js               # API client with retry
│   │   │   └── exportSlides.js      # PNG/ZIP export
│   │   ├── styles/
│   │   │   └── globals.css          # Design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   └── generateController.js    # LLM + image generation
│   ├── routes/
│   │   └── generate.js              # API routes
│   ├── prompts/
│   │   └── carouselPrompt.js        # Prompt engineering
│   ├── middleware/
│   │   └── validateInput.js         # Input validation
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 📜 License

MIT
