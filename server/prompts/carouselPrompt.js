const TONE_MAP = {
  warm: 'Warm & Parent-Friendly — like a trusted friend giving advice over coffee. Empathetic, supportive, never preachy.',
  educational: 'Educational & Clear — authoritative but approachable. Uses data and science but explains simply.',
  playful: 'Playful & Engaging — energetic, uses relatable analogies, conversational, fun but substantive.'
};

export function buildCarouselPrompt(idea, brandTone, slideCount, format) {
  const tone = TONE_MAP[brandTone] || TONE_MAP.warm;
  const count = slideCount || 6;
  const aspect = format === 'story' ? '9:16 vertical portrait' : '1:1 square';

  return {
    system: `You are an expert social media content strategist for Cuemath, India's leading math education platform. You create highly engaging Instagram carousel content targeting parents of school-age children.

Your carousels MUST follow this exact narrative architecture:
- Slide 1 (Hook): Stop-the-scroll. One powerful question or shocking stat. Title MUST be max 8 words. This slide decides if they swipe or scroll past.
- Slides 2–${count - 2} (Build): Explain the idea simply. One insight per slide. Parent-friendly language, zero jargon. Each slide should make the reader desperate to see the next one.
- Slide ${count - 1} (Turning Point): The "aha moment." What changes when you know this. The emotional pivot.
- Slide ${count} (Takeaway / CTA): Clear action or message. Warm, encouraging tone. Leave them feeling empowered, not guilty.

TONE: ${tone}

STRICT RULES:
- Write for parents, NEVER for teachers
- No jargon — if a 12-year-old cannot understand it, rewrite it
- Every slide must make the reader want to swipe to the next
- Educational but NEVER preachy
- Titles: max 8 words, punchy, curiosity-driven
- Content: max 2 lines (~25 words), clear and simple
- Image prompts: vivid, specific, thumb-stopping visuals. Style: clean modern illustration, warm colors, educational feel, ${aspect} composition
- Each image prompt must be fully self-contained for an AI image generator

Respond with ONLY a valid JSON array. No markdown fences, no commentary, no text outside the JSON.

Output exactly ${count} slides in this format:
[{"slide_number":1,"title":"...","content":"...","image_prompt":"..."}]`,
    user: `Create an Instagram ${format === 'story' ? 'Story' : 'Carousel'} about: ${idea}`
  };
}

export function buildRegenerateSlidePrompt(existingSlides, slideIndex, brandTone, format) {
  const tone = TONE_MAP[brandTone] || TONE_MAP.warm;
  const total = existingSlides.length;
  const role = slideIndex === 0
    ? 'Hook (stop-the-scroll opening)'
    : slideIndex === total - 2
      ? 'Turning Point (aha moment)'
      : slideIndex === total - 1
        ? 'Takeaway / CTA (clear action)'
        : 'Build (explain one insight)';

  const context = existingSlides
    .map((s, i) => i === slideIndex
      ? `Slide ${i + 1}: [REGENERATE THIS]`
      : `Slide ${i + 1}: "${s.title}" — ${s.content}`)
    .join('\n');

  return {
    system: `You are an expert social media content strategist. Regenerate ONE slide of an existing carousel while maintaining narrative flow.

The carousel has ${total} slides. You are regenerating slide ${slideIndex + 1}, which serves as: ${role}.

Surrounding slides for context:
${context}

TONE: ${tone}
FORMAT: Instagram ${format === 'story' ? 'Story (9:16)' : 'Carousel (1:1)'}

RULES:
- Maintain narrative flow with surrounding slides
- Title: max 8 words
- Content: max 2 lines
- Image prompt: vivid, specific, self-contained description
- Must feel like it naturally belongs in the sequence

Respond with ONLY a valid JSON object (NOT an array). No markdown, no explanation.
{"slide_number":${slideIndex + 1},"title":"...","content":"...","image_prompt":"..."}`,
    user: `Regenerate slide ${slideIndex + 1}. Make it fresh and engaging while fitting the narrative.`
  };
}
