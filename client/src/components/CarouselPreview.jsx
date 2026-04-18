import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw, Copy, Check, Image } from 'lucide-react';
import { useStudio } from '../context/StudioContext.jsx';
import { useCarousel } from '../hooks/useCarousel.js';
import { useBrandKit } from '../hooks/useBrandKit.js';
import SlideCard from './SlideCard.jsx';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 400 : -400, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir < 0 ? 400 : -400, opacity: 0, scale: 0.95 })
};

export default function CarouselPreview() {
  const { state, dispatch } = useStudio();
  const { nextSlide, prevSlide, setCurrentSlide, regenerateSlide, generateSlideImage, updateSlide } = useCarousel();
  const { brandKit, fontFamily } = useBrandKit();
  const [direction, setDirection] = useState(0);
  const slideRefs = useRef({});

  const { slides, currentSlideIndex, format } = state;

  if (slides.length === 0) return null;

  function handlePrev() {
    setDirection(-1);
    prevSlide();
  }

  function handleNext() {
    setDirection(1);
    nextSlide();
  }

  function handleDot(i) {
    setDirection(i > currentSlideIndex ? 1 : -1);
    setCurrentSlide(i);
  }

  function handleCopyText(slide) {
    const text = `${slide.title}\n\n${slide.content}`;
    navigator.clipboard.writeText(text).then(() => {
      dispatch({ type: 'SET_TOAST', message: 'Slide text copied!' });
    });
  }

  function handleRegenerate(index) {
    regenerateSlide(index, brandKit.tone);
  }

  function handleRegenerateImage(index) {
    generateSlideImage(index, slides[index].image_prompt);
  }

  function setSlideRef(index, el) {
    slideRefs.current[index] = el;
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <motion.div
      className="carousel-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="carousel-container">
        <div className={`carousel-viewport ${format === 'story' ? 'story' : ''}`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlideIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="carousel-slide-wrapper"
            >
              <SlideCard
                slide={currentSlide}
                index={currentSlideIndex}
                format={format}
                brandKit={brandKit}
                fontFamily={fontFamily}
                onCopy={() => handleCopyText(currentSlide)}
                onRegenerate={() => handleRegenerate(currentSlideIndex)}
                onRegenerateImage={() => handleRegenerateImage(currentSlideIndex)}
                onUpdateSlide={(updates) => updateSlide(currentSlideIndex, updates)}
                ref={(el) => setSlideRef(currentSlideIndex, el)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="carousel-nav">
          <motion.button
            className="carousel-nav-btn"
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            id="carousel-prev"
          >
            <ChevronLeft size={18} />
          </motion.button>

          <div className="carousel-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === currentSlideIndex ? 'active' : ''}`}
                onClick={() => handleDot(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            className="carousel-nav-btn"
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            id="carousel-next"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>

        <div className="carousel-counter">
          Slide {currentSlideIndex + 1} of {slides.length}
        </div>
      </div>
    </motion.div>
  );
}
