import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext.jsx';
import { useCarousel } from '../hooks/useCarousel.js';
import { useBrandKit } from '../hooks/useBrandKit.js';

const PRESETS = [
  'Why kids forget what they learn — the forgetting curve explained',
  'How math builds confidence in children — 5 surprising ways',
  'Screen time vs learning time — what the science says',
  'Why making mistakes is the best way to learn math',
  'The link between math skills and real-world problem solving'
];

export default function IdeaInput() {
  const { state } = useStudio();
  const { generateCarousel, setFormat } = useCarousel();
  const { brandKit } = useBrandKit();
  const [idea, setIdea] = useState('');
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const textareaRef = useRef(null);

  const charCount = idea.length;
  const charClass = charCount > 1800 ? 'danger' : charCount > 1500 ? 'warning' : '';

  async function handleSubmit(e) {
    e.preventDefault();
    if (idea.trim().length < 10 || state.isGenerating || isLocalLoading) return;
    
    setIsLocalLoading(true);
    try {
      await generateCarousel(idea.trim(), brandKit.tone);
    } finally {
      setIsLocalLoading(false);
    }
  }

  function handlePreset(preset) {
    setIdea(preset);
    textareaRef.current?.focus();
  }

  const isGenerating = state.isGenerating || isLocalLoading;

  return (
    <div className="idea-input-wrapper">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="idea-input-card">
          <label className="idea-input-label">
            <Sparkles size={14} />
            Describe your content idea
          </label>

          <textarea
            ref={textareaRef}
            className="idea-textarea"
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="e.g. Carousel for parents about why kids forget what they learn — explain the forgetting curve — end with how spaced repetition fixes it"
            maxLength={2000}
            id="idea-textarea"
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePreset(p)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.color = 'var(--text-tertiary)'; }}
              >
                {p.length > 50 ? p.slice(0, 50) + '…' : p}
              </button>
            ))}
          </div>

          <div className="idea-input-footer">
            <span className={`idea-char-count ${charClass}`}>{charCount}/2000</span>

            <div className="format-toggle">
              <button
                type="button"
                className={`format-option ${state.format === 'carousel' ? 'active' : ''}`}
                onClick={() => setFormat('carousel')}
                id="format-carousel"
              >
                Carousel 1:1
              </button>
              <button
                type="button"
                className={`format-option ${state.format === 'story' ? 'active' : ''}`}
                onClick={() => setFormat('story')}
                id="format-story"
              >
                Story 9:16
              </button>
            </div>

            <motion.button
              type="submit"
              className="generate-btn"
              disabled={idea.trim().length < 10 || isGenerating}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="generate-btn"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="spin" style={{ marginRight: '8px' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Generate Carousel
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
