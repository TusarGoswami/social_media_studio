import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sms_brandkit';

const DEFAULT_BRAND = {
  primaryColor: '#4F46E5',
  secondaryColor: '#06B6D4',
  accentColor: '#F59E0B',
  backgroundColor: '#F9FAFB',
  textColor: '#111827',
  fontStyle: 'modern',
  tone: 'warm',
  logo: null
};

function loadBrandKit() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_BRAND, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_BRAND };
}

export function useBrandKit() {
  const [brandKit, setBrandKit] = useState(loadBrandKit);

  useEffect(() => {
    try {
      const toSave = { ...brandKit };
      if (toSave.logo && toSave.logo.length > 500000) {
        toSave.logo = null;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [brandKit]);

  const updateBrandKit = useCallback((updates) => {
    setBrandKit(prev => ({ ...prev, ...updates }));
  }, []);

  const resetBrandKit = useCallback(() => {
    setBrandKit({ ...DEFAULT_BRAND });
  }, []);

  const fontFamily = brandKit.fontStyle === 'playful'
    ? "'Nunito', sans-serif"
    : brandKit.fontStyle === 'classic'
      ? "'Playfair Display', Georgia, serif"
      : "'Inter', sans-serif";

  return { brandKit, updateBrandKit, resetBrandKit, fontFamily, DEFAULT_BRAND };
}
