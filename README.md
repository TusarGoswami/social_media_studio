# 🎨 Social Media Studio

**Transform rough ideas into polished, brand-consistent Instagram carousels with AI.** Type a messy thought → get a designed, ready-to-post visual carousel. Built for content creators targeting high-fidelity visuals seamlessly bridging text and dynamically tailored AI images quickly.

> From messy input to polished output — that's the entire product.

---

## 🚀 Live URL

> **Frontend:** [Deploy to Vercel/Netlify]  
> **Backend:** [Deploy to Render/Railway]  
> *(Add your deployed URLs here after deployment)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Animations | Framer Motion |
| Styling | Vanilla CSS with CSS Variables (Light/Dark theme, Fully Responsive) |
| State | useContext + useReducer |
| Backend | Node.js + Express |
| LLM | Google Gemini (`gemini-2.5-flash`) |
| Image Gen | Google Imagen 4 (`imagen-4.0-generate-001`) |
| Export | html2canvas + JSZip + FileSaver |
| Icons | Lucide React |

---

## ⚡ Local Setup

### Prerequisites
- Node.js 18+ 
- npm 9+
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/TusarGoswami/social_media_studio.git
cd social_media_studio
```

### 2. Setup environment variables
```bash
cp server/.env.example server/.env
# Edit server/.env and securely add your GEMINI_API_KEY
```

### 3. Install packages & Start
```bash
npm install
npm run dev
```
*(This command leverages concurrently to run both the React frontend and Node backend gracefully in one unified terminal).*

Navigate to `http://localhost:5173` if your browser doesn't open automatically.

---

## 🔑 Environment Variables

### Server (`server/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google GenAI Key for `gemini-2.5-flash` and `imagen-4.0` |
| `LLM_PROVIDER` | No | `"gemini"` (default) |
| `PORT` | No | Server port (default: 3001) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173 / localhost:*) |

### Client (`client/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: /api via Vite proxy) |

---

## 🏗️ Key Decisions & Tradeoffs

1. **Google GenAI Ecosystem** — Replaced multi-LLM workflows with the unified Google `@google/genai` SDK giving access to `gemini-2.5-flash` for high-speed text context and `imagen-3.0` for visually rich assets smoothly natively.

2. **CSS Variables & Deep Responsiveness** — Vanilla CSS with custom properties powers completely responsive components with modern constraints, light/dark theming, hover limits, overlapping, and fast typography overrides on narrow mobile devices securely.

3. **useReducer over Redux** — For an app of this scope, `useContext` + `useReducer` provides sufficient state management for tracking the carousel deck, generation histories, and complex interactions cleanly without external boilerplate overhead.

4. **Progressive Image Loading** — Text formatting from Gemini resolves instantly and paints the slides dynamically. Then, asynchronous callbacks stream visually complex `imagen-3` generative results natively into the backgrounds seamlessly while the user can start editing text.

5. **Local Persistent Brand Kit** — Stores custom hex values `#4F46E5`, `#06B6D4`, embedded fonts, and base64 logo items permanently inside `localStorage` for returning sessions without building a database workflow.

6. **Hidden Export Canvas Node** — Exact 1080px (1:1 Carousel) and 9:16 (Story) aspect ratios are constructed completely independently off-browser on hidden dom nodes to ensure the PNG zipped exports scale flawlessly into Instagram.

---

## 🔮 What I'd Improve With More Time

- **Drag-and-drop slide reordering** with smooth animations
- **Multiple carousel templates** — different layout compositions per slide role
- **Real-time collaborative editing** with WebSocket sync
- **Scheduled publishing** via Instagram Graph API integration
- **Analytics dashboard** tracking which carousel topics perform best
- **Custom image upload** per slide as an alternative to AI generation
- **PDF export** option alongside PNG/ZIP
- **A/B title suggestions** — generate 3 title variants per slide for A/B testing

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
│   │   │   ├── SlideCard.jsx        # Individual stylish inline-editable slide
│   │   │   ├── Toolbar.jsx          # Global action bar
│   │   │   └── GenerationHistory.jsx # Past carousels sidebar
│   │   ├── context/
│   │   │   └── StudioContext.jsx    # Global state management
│   │   ├── hooks/
│   │   │   ├── useCarousel.js       # Carousel async operations
│   │   │   └── useBrandKit.js       # localStorage persistent hook
│   │   ├── utils/
│   │   │   ├── api.js               # Backend communicator
│   │   │   └── exportSlides.js      # PNG/ZIP export engine
│   │   ├── styles/
│   │   │   └── globals.css          # Fully Responsive UI design
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   └── generateController.js    # Gemini 2.5 Flash + Imagen 3 Logic
│   ├── routes/
│   │   └── generate.js              # API routes
│   ├── prompts/
│   │   └── carouselPrompt.js        # Markdown system instructions
│   ├── middleware/
│   │   └── validateInput.js         # Input validation
│   ├── .env.example
│   ├── server.js                    # Express CORS entrypoint
│   └── package.json
│
├── package.json                     # Concurrently Root Script Config
├── .gitignore                       # Clean secure ignore logic
└── README.md
```

---

## 📜 License

MIT
