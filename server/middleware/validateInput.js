export function validateGenerateInput(req, res, next) {
  const { idea, format, brandTone } = req.body;

  if (!idea || typeof idea !== 'string') {
    return res.status(400).json({ error: 'A content idea is required.' });
  }
  if (idea.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a more detailed idea (at least 10 characters).' });
  }
  if (idea.length > 2000) {
    return res.status(400).json({ error: 'Idea is too long. Please keep it under 2000 characters.' });
  }
  if (format && !['carousel', 'story'].includes(format)) {
    return res.status(400).json({ error: 'Format must be "carousel" or "story".' });
  }
  if (brandTone && !['warm', 'educational', 'playful'].includes(brandTone)) {
    return res.status(400).json({ error: 'Invalid brand tone selected.' });
  }

  req.body.idea = idea.trim();
  req.body.format = format || 'carousel';
  req.body.brandTone = brandTone || 'warm';
  next();
}

export function validateRegenerateSlideInput(req, res, next) {
  const { slides, slideIndex, format, brandTone } = req.body;

  if (!Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ error: 'Existing slides data is required.' });
  }
  if (typeof slideIndex !== 'number' || slideIndex < 0 || slideIndex >= slides.length) {
    return res.status(400).json({ error: 'Invalid slide index.' });
  }

  req.body.format = format || 'carousel';
  req.body.brandTone = brandTone || 'warm';
  next();
}

export function validateImageInput(req, res, next) {
  const { imagePrompt } = req.body;

  if (!imagePrompt || typeof imagePrompt !== 'string') {
    return res.status(400).json({ error: 'Image prompt is required.' });
  }
  if (imagePrompt.length > 1000) {
    return res.status(400).json({ error: 'Image prompt is too long.' });
  }

  req.body.format = req.body.format || 'carousel';
  next();
}
