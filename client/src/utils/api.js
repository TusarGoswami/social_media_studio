const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiCall(endpoint, body, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      return data;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function generateCarousel(idea, format, brandTone, slideCount) {
  return apiCall('/generate', { idea, format, brandTone, slideCount });
}

export async function regenerateSlide(slides, slideIndex, format, brandTone) {
  return apiCall('/regenerate-slide', { slides, slideIndex, format, brandTone });
}

export async function generateImage(imagePrompt, format) {
  return apiCall('/generate-image', { imagePrompt, format }, 1);
}
