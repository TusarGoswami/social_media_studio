import { useCallback, useRef } from 'react';
import { useStudio } from '../context/StudioContext.jsx';
import * as api from '../utils/api.js';

const GENERATION_STEPS = [
  '✨ Understanding your idea...',
  '✍️ Crafting the narrative...',
  '🎨 Designing your slides...',
  '🖼️ Adding finishing touches...'
];

export function useCarousel() {
  const { state, dispatch } = useStudio();
  const ideaRef = useRef('');

  const generateCarousel = useCallback(async (idea, brandTone) => {
    ideaRef.current = idea;
    dispatch({ type: 'SET_GENERATING', value: true });
    dispatch({ type: 'SET_ERROR', error: null });

    const stepInterval = setInterval(() => {
      dispatch((prev) => {
        return prev;
      });
    }, 2000);

    let stepIndex = 0;
    const stepTimer = setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, GENERATION_STEPS.length - 1);
      dispatch({ type: 'SET_GENERATION_STEP', step: stepIndex });
    }, 2200);

    try {
      const data = await api.generateCarousel(idea, state.format, brandTone, 6);
      clearInterval(stepInterval);
      clearInterval(stepTimer);

      dispatch({ type: 'SET_SLIDES', slides: data.slides });
      dispatch({ type: 'SET_GENERATING', value: false });
      dispatch({ type: 'ADD_TO_HISTORY', idea, slides: data.slides, format: state.format });

      data.slides.forEach((slide, index) => {
        generateSlideImage(index, slide.image_prompt);
      });
    } catch (err) {
      clearInterval(stepInterval);
      clearInterval(stepTimer);
      dispatch({ type: 'SET_ERROR', error: err.message });
    }
  }, [state.format, dispatch]);

  const generateSlideImage = useCallback(async (index, imagePrompt) => {
    dispatch({ type: 'UPDATE_SLIDE', index, updates: { imageLoading: true } });
    try {
      const data = await api.generateImage(imagePrompt, state.format);
      dispatch({ type: 'UPDATE_SLIDE', index, updates: { imageUrl: data.imageUrl, imageLoading: false } });
    } catch {
      dispatch({ type: 'UPDATE_SLIDE', index, updates: { imageUrl: null, imageLoading: false } });
    }
  }, [state.format, dispatch]);

  const regenerateSlide = useCallback(async (index, brandTone) => {
    dispatch({ type: 'UPDATE_SLIDE', index, updates: { regenerating: true } });
    try {
      const data = await api.regenerateSlide(state.slides, index, state.format, brandTone);
      dispatch({ type: 'UPDATE_SLIDE', index, updates: { ...data.slide, imageUrl: null, imageLoading: false, regenerating: false } });
      generateSlideImage(index, data.slide.image_prompt);
    } catch (err) {
      dispatch({ type: 'UPDATE_SLIDE', index, updates: { regenerating: false } });
      dispatch({ type: 'SET_TOAST', message: 'Failed to regenerate slide. Please try again.' });
    }
  }, [state.slides, state.format, dispatch, generateSlideImage]);

  const regenerateAll = useCallback(async (idea, brandTone) => {
    const currentIdea = idea || ideaRef.current;
    if (!currentIdea) return;
    await generateCarousel(currentIdea, brandTone);
  }, [generateCarousel]);

  const updateSlide = useCallback((index, updates) => {
    dispatch({ type: 'UPDATE_SLIDE', index, updates });
  }, [dispatch]);

  const setCurrentSlide = useCallback((index) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', index });
  }, [dispatch]);

  const nextSlide = useCallback(() => {
    if (state.currentSlideIndex < state.slides.length - 1) {
      dispatch({ type: 'SET_CURRENT_SLIDE', index: state.currentSlideIndex + 1 });
    }
  }, [state.currentSlideIndex, state.slides.length, dispatch]);

  const prevSlide = useCallback(() => {
    if (state.currentSlideIndex > 0) {
      dispatch({ type: 'SET_CURRENT_SLIDE', index: state.currentSlideIndex - 1 });
    }
  }, [state.currentSlideIndex, dispatch]);

  const setFormat = useCallback((format) => {
    dispatch({ type: 'SET_FORMAT', format });
  }, [dispatch]);

  const loadFromHistory = useCallback((entry) => {
    dispatch({ type: 'LOAD_FROM_HISTORY', entry });
    ideaRef.current = entry.idea;
    entry.slides.forEach((slide, index) => {
      generateSlideImage(index, slide.image_prompt);
    });
  }, [dispatch, generateSlideImage]);

  return {
    generateCarousel,
    regenerateSlide,
    regenerateAll,
    generateSlideImage,
    updateSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    setFormat,
    loadFromHistory,
    generationSteps: GENERATION_STEPS,
    ideaRef
  };
}
