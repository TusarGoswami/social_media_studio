import { GoogleGenAI } from '@google/genai';
import { buildCarouselPrompt, buildRegenerateSlidePrompt } from '../prompts/carouselPrompt.js';

let ai = null;

function getAIClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (key && key !== 'your_gemini_api_key_here') {
      ai = new GoogleGenAI({ apiKey: key });
    }
  }
  return ai;
}

async function callLLM(systemPrompt, userPrompt) {
  const client = getAIClient();
  if (!client) {
    throw Object.assign(new Error('No LLM provider configured. Set GEMINI_API_KEY in your .env file.'), { statusCode: 503 });
  }

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8,
    }
  });

  return response.text;
}

function parseJSON(raw) {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  text = text.trim();
  return JSON.parse(text);
}

export async function generateCarousel(req, res) {
  try {
    const { idea, format, brandTone, slideCount } = req.body;
    const prompt = buildCarouselPrompt(idea, brandTone, slideCount || 6, format);
    const raw = await callLLM(prompt.system, prompt.user);
    const slides = parseJSON(raw);

    if (!Array.isArray(slides) || slides.length === 0) {
      return res.status(500).json({ error: 'Failed to generate valid carousel content. Please try again.' });
    }

    const validated = slides.map((s, i) => ({
      slide_number: i + 1,
      title: String(s.title || '').slice(0, 100),
      content: String(s.content || '').slice(0, 300),
      image_prompt: String(s.image_prompt || '').slice(0, 500),
      imageUrl: null
    }));

    res.json({ slides: validated, format, brandTone });
  } catch (err) {
    console.error('Carousel Generation Error:', err);
    let status = err.statusCode || 500;
    let message = 'Failed to generate carousel. Please try again in a moment.';

    // Hide specific API details from the user
    if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      status = 429;
      message = "We're experiencing high traffic or quota limits. Please try again in a minute.";
    } else if (err.message?.includes('API key')) {
      status = 401;
      message = "Service configuration error. Please contact the administrator.";
    }

    res.status(status).json({ error: message });
  }
}

export async function regenerateSlide(req, res) {
  try {
    const { slides, slideIndex, format, brandTone } = req.body;
    const prompt = buildRegenerateSlidePrompt(slides, slideIndex, brandTone, format);
    const raw = await callLLM(prompt.system, prompt.user);
    const newSlide = parseJSON(raw);

    if (!newSlide || typeof newSlide !== 'object') {
      return res.status(500).json({ error: 'Failed to regenerate slide. Please try again.' });
    }

    res.json({
      slide: {
        slide_number: slideIndex + 1,
        title: String(newSlide.title || '').slice(0, 100),
        content: String(newSlide.content || '').slice(0, 300),
        image_prompt: String(newSlide.image_prompt || '').slice(0, 500),
        imageUrl: null
      },
      slideIndex
    });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Failed to regenerate slide. Please try again.' });
  }
}

export async function generateImage(req, res) {
  try {
    const { imagePrompt, format } = req.body;

    const client = getAIClient();
    if (!client) {
      return res.json({ imageUrl: null, fallback: true, message: 'Image generation requires a Gemini API key for Imagen 3.' });
    }

    const aspectRatio = format === 'story' ? '9:16' : '1:1';
    const response = await client.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${imagePrompt}. Style: clean, modern illustration with warm, inviting colors suitable for educational social media content. No text overlay in the image.`,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/jpeg'
      }
    });

    const base64 = response.generatedImages[0].image.imageBytes;
    res.json({ imageUrl: `data:image/jpeg;base64,${base64}` });
  } catch (err) {
    console.error(err);
    res.json({ imageUrl: null, fallback: true, message: 'Image generation failed. Using placeholder.' });
  }
}
