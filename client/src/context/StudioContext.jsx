import { createContext, useContext, useReducer, useEffect } from 'react';

const StudioContext = createContext(null);

const HISTORY_KEY = 'sms_history';
const THEME_KEY = 'sms_theme';

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch { return 'light'; }
}

const initialState = {
  slides: [],
  format: 'carousel',
  isGenerating: false,
  generationStep: 0,
  currentSlideIndex: 0,
  error: null,
  history: loadHistory(),
  sidebarPanel: null,
  theme: loadTheme(),
  exportProgress: null,
  toast: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SLIDES':
      return { ...state, slides: action.slides, currentSlideIndex: 0, error: null };
    case 'SET_FORMAT':
      return { ...state, format: action.format };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.value, generationStep: action.value ? 0 : state.generationStep };
    case 'SET_GENERATION_STEP':
      return { ...state, generationStep: action.step };
    case 'SET_CURRENT_SLIDE':
      return { ...state, currentSlideIndex: action.index };
    case 'UPDATE_SLIDE': {
      const slides = [...state.slides];
      slides[action.index] = { ...slides[action.index], ...action.updates };
      return { ...state, slides };
    }
    case 'SET_ERROR':
      return { ...state, error: action.error, isGenerating: false };
    case 'ADD_TO_HISTORY': {
      const entry = {
        id: Date.now().toString(),
        idea: action.idea,
        slides: action.slides.map(s => ({ slide_number: s.slide_number, title: s.title, content: s.content, image_prompt: s.image_prompt })),
        format: action.format,
        createdAt: new Date().toISOString()
      };
      const history = [entry, ...state.history].slice(0, 50);
      return { ...state, history };
    }
    case 'LOAD_FROM_HISTORY':
      return {
        ...state,
        slides: action.entry.slides.map(s => ({ ...s, imageUrl: null })),
        format: action.entry.format || 'carousel',
        currentSlideIndex: 0,
        error: null,
        sidebarPanel: null
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'SET_SIDEBAR':
      return { ...state, sidebarPanel: state.sidebarPanel === action.panel ? null : action.panel };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarPanel: null };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_EXPORT_PROGRESS':
      return { ...state, exportProgress: action.progress };
    case 'SET_TOAST':
      return { ...state, toast: action.message };
    case 'CLEAR':
      return { ...state, slides: [], currentSlideIndex: 0, error: null };
    default:
      return state;
  }
}

export function StudioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history)); } catch {}
  }, [state.history]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    try { localStorage.setItem(THEME_KEY, state.theme); } catch {}
  }, [state.theme]);

  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'SET_TOAST', message: null }), 2500);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  return (
    <StudioContext.Provider value={{ state, dispatch }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
}
