import { forwardRef, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, ImageIcon } from 'lucide-react';

const GRADIENT_PAIRS = [
  ['#4F46E5', '#7C3AED'],
  ['#06B6D4', '#3B82F6'],
  ['#8B5CF6', '#EC4899'],
  ['#10B981', '#06B6D4'],
  ['#F59E0B', '#EF4444'],
  ['#6366F1', '#06B6D4'],
  ['#EC4899', '#F59E0B']
];

function getSlideGradient(index, brandKit) {
  const pair = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
  return `linear-gradient(135deg, ${brandKit.primaryColor || pair[0]}, ${brandKit.secondaryColor || pair[1]})`;
}

const SlideCard = forwardRef(function SlideCard(
  { slide, index, format, brandKit, fontFamily, onCopy, onRegenerate, onRegenerateImage, onUpdateSlide },
  ref
) {
  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [titleValue, setTitleValue] = useState(slide.title);
  const [contentValue, setContentValue] = useState(slide.content);

  useEffect(() => {
    setTitleValue(slide.title);
    setContentValue(slide.content);
  }, [slide.title, slide.content]);

  function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function commitTitle() {
    setEditingTitle(false);
    if (titleValue.trim() && titleValue !== slide.title) {
      onUpdateSlide({ title: titleValue.trim() });
    }
  }

  function commitContent() {
    setEditingContent(false);
    if (contentValue.trim() && contentValue !== slide.content) {
      onUpdateSlide({ content: contentValue.trim() });
    }
  }

  const isLoading = slide.imageLoading;
  const hasImage = slide.imageUrl && !isLoading;
  const gradient = getSlideGradient(index, brandKit);

  return (
    <div className="slide-card" ref={ref} style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
      <div className={`slide-card-inner ${format === 'story' ? 'story' : ''}`} style={{ fontFamily, padding: format === 'story' ? '60px 40px' : '40px 32px' }}>
        <div className="slide-bg">
          {isLoading && (
            <div className="slide-skeleton">
              <div className="slide-skeleton-inner" style={{
                background: `linear-gradient(90deg, #4F46E522 25%, #06B6D433 50%, #4F46E522 75%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.8s infinite ease-in-out',
                width: '100%',
                height: '100%'
              }} />
            </div>
          )}
          {hasImage && (
            <>
              <img src={slide.imageUrl} alt="" className="slide-bg-image" />
              <div className="slide-bg-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)' }} />
            </>
          )}
          {!hasImage && !isLoading && (
            <div className="slide-bg-gradient" style={{ background: gradient }} />
          )}
        </div>

        <div className="slide-content-area" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="slide-number-badge" style={{ background: '#4F46E5', color: 'white', border: '2px solid #06B6D4', width: '40px', height: '40px', fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
              {slide.slide_number}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {editingTitle ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <textarea
                  value={titleValue}
                  onChange={e => setTitleValue(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commitTitle(); } }}
                  className="slide-editable slide-title"
                  style={{ fontFamily, width: '100%', border: '2px solid #06B6D4', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', fontSize: '1.6rem', fontWeight: 900, color: 'white', textAlign: 'center', padding: '12px', minHeight: '80px', resize: 'none', marginBottom: '12px' }}
                  autoFocus
                />
                <button onMouseDown={e => { e.preventDefault(); commitTitle(); }} style={{ position: 'absolute', right: -20, top: -20, background: '#10B981', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <h2
                className="slide-title slide-editable"
                onClick={() => setEditingTitle(true)}
                title="Click to edit"
                style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '0 4px 10px rgba(0,0,0,0.6)', marginBottom: '16px' }}
              >
                {slide.title}
              </h2>
            )}

            {editingContent ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <textarea
                  value={contentValue}
                  onChange={e => setContentValue(e.target.value)}
                  onBlur={commitContent}
                  onKeyDown={e => { if (e.key === 'Enter' && e.shiftKey === false) { e.preventDefault(); commitContent(); } }}
                  className="slide-editable slide-text"
                  style={{ fontFamily, width: '100%', border: '2px solid #4F46E5', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', resize: 'none', minHeight: '100px', fontSize: '1.05rem', color: 'white', textAlign: 'center', lineHeight: 1.6, padding: '12px' }}
                  autoFocus
                />
                <button onMouseDown={e => { e.preventDefault(); commitContent(); }} style={{ position: 'absolute', right: -20, bottom: -20, background: '#10B981', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <p
                className="slide-text slide-editable"
                onClick={() => setEditingContent(true)}
                title="Click to edit"
                style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.6, textShadow: '0 2px 5px rgba(0,0,0,0.5)', opacity: 0.95 }}
              >
                {slide.content}
              </p>
            )}
          </div>
        </div>

        {brandKit.logo && (
          <img src={brandKit.logo} alt="Brand logo" className="slide-logo" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }} />
        )}
      </div>

      <div className="slide-actions" style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, opacity: 1 }}>
        <motion.button
          className={`slide-action-btn ${copied ? 'copied' : ''}`}
          style={{ background: copied ? '#10B981' : 'rgba(79, 70, 229, 0.85)', padding: '8px', border: '1px solid #06B6D4' }}
          onClick={handleCopy}
          whileHover={{ scale: 1.15, background: '#4F46E5' }}
          whileTap={{ scale: 0.9 }}
          title="Copy text"
        >
          {copied ? <Check size={16} /> : <Copy size={16} color="white" />}
        </motion.button>
        <motion.button
          className="slide-action-btn"
          style={{ background: 'rgba(79, 70, 229, 0.85)', padding: '8px', border: '1px solid #06B6D4' }}
          onClick={onRegenerateImage}
          whileHover={{ scale: 1.15, background: '#4F46E5' }}
          whileTap={{ scale: 0.9 }}
          title="Regenerate image"
          disabled={isLoading}
        >
          <ImageIcon size={16} color="white" />
        </motion.button>
        <motion.button
          className="slide-action-btn"
          style={{ background: 'rgba(79, 70, 229, 0.85)', padding: '8px', border: '1px solid #06B6D4' }}
          onClick={onRegenerate}
          whileHover={{ scale: 1.15, background: '#4F46E5' }}
          whileTap={{ scale: 0.9 }}
          title="Regenerate slide completely"
          disabled={slide.regenerating}
        >
          <RefreshCw size={16} color="white" className={slide.regenerating ? 'spinning' : ''} style={slide.regenerating ? { animation: 'spin 1s linear infinite' } : {}} />
        </motion.button>
      </div>
    </div>
  );
});

export default SlideCard;
