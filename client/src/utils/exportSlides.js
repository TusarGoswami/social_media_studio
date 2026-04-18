import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const EXPORT_DIMS = {
  carousel: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 }
};

async function captureSlideElement(slideEl, format) {
  const dims = EXPORT_DIMS[format] || EXPORT_DIMS.carousel;

  // We don't clone if we are using the dedicated export nodes
  // to avoid issues with absolute positioned children or data urls
  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:${dims.width}px;height:${dims.height}px;overflow:hidden;z-index:-1;`;
  
  // Create a clean wrapper for the element
  const wrapper = slideEl.cloneNode(true);
  wrapper.style.display = 'block';
  wrapper.style.visibility = 'visible';
  wrapper.style.position = 'relative';
  
  // Remove any interactive UI but keep the content
  const actions = wrapper.querySelector('.slide-actions');
  if (actions) actions.remove();

  container.appendChild(wrapper);
  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    width: dims.width,
    height: dims.height,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null
  });

  document.body.removeChild(container);
  return canvas;
}

export async function exportSingleSlide(slideEl, slideNumber, format) {
  const canvas = await captureSlideElement(slideEl, format);
  canvas.toBlob(blob => {
    if (blob) saveAs(blob, `slide-${slideNumber}.png`);
  });
}

export async function exportAllSlides(slideEls, format, onProgress) {
  const zip = new JSZip();

  for (let i = 0; i < slideEls.length; i++) {
    const canvas = await captureSlideElement(slideEls[i], format);
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    if (blob) zip.file(`slide-${i + 1}.png`, blob);
    if (onProgress) onProgress(Math.round(((i + 1) / slideEls.length) * 100));
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'carousel-slides.zip');
}
