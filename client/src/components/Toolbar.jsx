import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Palette, History, RefreshCw, Download } from 'lucide-react';
import { useStudio } from '../context/StudioContext.jsx';
import { useCarousel } from '../hooks/useCarousel.js';
import { useBrandKit } from '../hooks/useBrandKit.js';
import { exportAllSlides } from '../utils/exportSlides.js';

export default function Toolbar() {
  const { state, dispatch } = useStudio();
  const { regenerateAll } = useCarousel();
  const { brandKit } = useBrandKit();
  const [exporting, setExporting] = useState(false);

  function toggleTheme() {
    dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' });
  }

  function toggleBrandKit() {
    dispatch({ type: 'SET_SIDEBAR', panel: 'brand' });
  }

  function toggleHistory() {
    dispatch({ type: 'SET_SIDEBAR', panel: 'history' });
  }

  function handleRegenerateAll() {
    regenerateAll(null, brandKit.tone);
  }

  async function handleExport() {
    if (state.slides.length === 0 || exporting) return;
    setExporting(true);
    dispatch({ type: 'SET_EXPORT_PROGRESS', progress: 0 });

    try {
      const slideEls = state.slides.map((_, i) => {
        const el = document.querySelector(`[data-slide-export="${i}"]`);
        return el;
      }).filter(Boolean);

      if (slideEls.length === 0) {
        dispatch({ type: 'SET_TOAST', message: 'No slides to export' });
        return;
      }

      await exportAllSlides(slideEls, state.format, (progress) => {
        dispatch({ type: 'SET_EXPORT_PROGRESS', progress });
      });

      dispatch({ type: 'SET_TOAST', message: 'Slides exported successfully!' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'Export failed. Please try again.' });
    } finally {
      setExporting(false);
      dispatch({ type: 'SET_EXPORT_PROGRESS', progress: null });
    }
  }

  return (
    <header className="toolbar" id="main-toolbar">
      <div className="toolbar-logo">
        <div className="toolbar-logo-icon">S</div>
        <span>Social Media Studio</span>
      </div>

      <div className="toolbar-actions">
        {state.slides.length > 0 && (
          <>
            <motion.button
              className="toolbar-btn"
              onClick={handleRegenerateAll}
              disabled={state.isGenerating}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="regenerate-all-btn"
            >
              <RefreshCw size={14} />
              <span>Regenerate</span>
            </motion.button>

            <motion.button
              className="toolbar-btn"
              onClick={handleExport}
              disabled={exporting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="export-btn"
            >
              <Download size={14} />
              <span>{exporting ? 'Exporting...' : 'Export All'}</span>
            </motion.button>
          </>
        )}

        <button
          className={`toolbar-btn-icon ${state.sidebarPanel === 'brand' ? 'active' : ''}`}
          onClick={toggleBrandKit}
          title="Brand Kit"
          id="brandkit-toggle"
          style={state.sidebarPanel === 'brand' ? { background: 'var(--brand-primary)', color: 'white', borderColor: 'var(--brand-primary)' } : {}}
        >
          <Palette size={16} />
        </button>

        <button
          className={`toolbar-btn-icon ${state.sidebarPanel === 'history' ? 'active' : ''}`}
          onClick={toggleHistory}
          title="Generation History"
          id="history-toggle"
          style={state.sidebarPanel === 'history' ? { background: 'var(--brand-primary)', color: 'white', borderColor: 'var(--brand-primary)' } : {}}
        >
          <History size={16} />
        </button>

        <motion.button
          className="toolbar-btn-icon"
          onClick={toggleTheme}
          title={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 180 }}
          id="theme-toggle"
        >
          {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>
      </div>
    </header>
  );
}
