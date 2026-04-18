import { Router } from 'express';
import { generateCarousel, regenerateSlide, generateImage } from '../controllers/generateController.js';
import { validateGenerateInput, validateRegenerateSlideInput, validateImageInput } from '../middleware/validateInput.js';

const router = Router();

router.post('/generate', validateGenerateInput, generateCarousel);
router.post('/regenerate-slide', validateRegenerateSlideInput, regenerateSlide);
router.post('/generate-image', validateImageInput, generateImage);

export default router;
