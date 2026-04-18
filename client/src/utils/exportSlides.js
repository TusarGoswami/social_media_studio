import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const EXPORT_DIMS = {
  carousel: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 }
};

async function captureSlideElement(slideEl, format) {
  const dims = EXPORT_DIMS[format] || EXPORT_DIMS.carousel;

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:${dims.width}px;height:${dims.height}px;overflow:hidden;z-index:-1;`;

  const clone = slideEl.cloneNode(true);
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.borderRadius = '0';

  const inner = clone.querySelector('.slide-card-inner');
  if (inner) {
    inner.style.borderRadius = '0';
    inner.style.width = '100%';
    inner.style.height = '100%';
  }

  const actionBtns = clone.querySelectorAll('.slide-actions');
  actionBtns.forEach(el => el.remove());

  container.appendChild(clone);
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
