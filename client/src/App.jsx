import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useStudio } from './context/StudioContext.jsx';
import { useBrandKit } from './hooks/useBrandKit.js';
import Toolbar from './components/Toolbar.jsx';
import IdeaInput from './components/IdeaInput.jsx';
import CarouselPreview from './components/CarouselPreview.jsx';
import BrandKit from './components/BrandKit.jsx';
import GenerationHistory from './components/GenerationHistory.jsx';

const STEPS = [
  '✨ Understanding your idea...',
  '✍️ Crafting the narrative...',
  '🎨 Designing your slides...',
  '🖼️ Adding finishing touches...',
  '🚀 Optimizing for publishing...'
];

const GRADIENT_PAIRS = [
  ['#4F46E5', '#7C3AED'],
  ['#06B6D4', '#3B82F6'],
  ['#8B5CF6', '#EC4899'],
  ['#10B981', '#06B6D4'],
  ['#F59E0B', '#EF4444'],
  ['#6366F1', '#06B6D4'],
  ['#EC4899', '#F59E0B']
];

function GeneratingState({ step }) {
  const progress = ((step + 1) / STEPS.length) * 100;
  return (
    <motion.div
      className="generating-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="generating-card">
        <div className="generating-spinner" />
        <motion.div
          className="generating-step"
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {STEPS[step] || STEPS[0]}
        </motion.div>
        <div className="generating-substep">This usually takes 5–10 seconds</div>
        <div className="generating-progress">
          <motion.div
            className="generating-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ExportProgress({ progress }) {
  if (progress === null || progress === undefined) return null;
  return (
    <motion.div
      className="export-progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="export-progress-title">Exporting slides...</div>
      <div className="export-progress-bar-track">
        <div className="export-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}

function HiddenExportSlides() {
  const { state } = useStudio();
  const { brandKit, fontFamily } = useBrandKit();

  if (state.slides.length === 0) return null;

  return (
    <div style={{ position: 'fixed', left: '-99999px', top: 0, zIndex: -1 }}>
      {state.slides.map((slide, i) => {
        const pair = GRADIENT_PAIRS[i % GRADIENT_PAIRS.length];
        const gradient = `linear-gradient(135deg, ${brandKit.primaryColor || pair[0]}, ${brandKit.secondaryColor || pair[1]})`;
        const dims = state.format === 'story'
          ? { width: 1080, height: 1920 }
          : { width: 1080, height: 1080 };

        return (
          <div
            key={i}
            data-slide-export={i}
            style={{
              width: dims.width,
              height: dims.height,
              position: 'relative',
              overflow: 'hidden',
              fontFamily
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: slide.imageUrl ? undefined : gradient }}>
              {slide.imageUrl && (
                <>
                  <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
                </>
              )}
            </div>
            <div style={{
              position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', height: '100%',
              padding: '60px 80px', textAlign: 'center'
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 32
              }}>{slide.slide_number}</div>
              <h2 style={{
                fontSize: state.format === 'story' ? 52 : 48, fontWeight: 800, color: 'white',
                lineHeight: 1.2, marginBottom: 24, textShadow: '0 2px 12px rgba(0,0,0,0.3)'
              }}>{slide.title}</h2>
              <p style={{
                fontSize: state.format === 'story' ? 28 : 26, color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.3)'
              }}>{slide.content}</p>
            </div>
            {brandKit.logo && (
              <img src={brandKit.logo} alt="" style={{
                position: 'absolute', bottom: 32, right: 32, width: 80, height: 80,
                objectFit: 'contain', opacity: 0.8
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const { state, dispatch } = useStudio();

  return (
    <div className="app-layout">
      <Toolbar />

      <div className="app-main">
        <AnimatePresence>
          {state.sidebarPanel === 'brand' && (
            <motion.div
              key="brand-sidebar"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <BrandKit />
            </motion.div>
          )}
        </AnimatePresence>

        {state.sidebarPanel && (
          <div className="sidebar-overlay" onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })} />
        )}

        <main className="main-content">
          <IdeaInput />

          <AnimatePresence>
            {state.error && (
              <motion.div className="error-banner" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle size={16} />
                {state.error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {state.isGenerating && <GeneratingState step={state.generationStep} />}
          </AnimatePresence>

          {!state.isGenerating && state.slides.length > 0 && <CarouselPreview />}
        </main>

        <AnimatePresence>
          {state.sidebarPanel === 'history' && (
            <motion.div
              key="history-sidebar"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <GenerationHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HiddenExportSlides />

      <AnimatePresence>
        <ExportProgress progress={state.exportProgress} />
      </AnimatePresence>

      <AnimatePresence>
        {state.toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {state.toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
