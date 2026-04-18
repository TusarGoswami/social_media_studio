import { useRef } from 'react';
import { Palette, X, Upload, Trash2 } from 'lucide-react';
import { useBrandKit } from '../hooks/useBrandKit.js';
import { useStudio } from '../context/StudioContext.jsx';

const FONT_OPTIONS = [
  { value: 'modern', label: 'Modern Sans (Inter)' },
  { value: 'playful', label: 'Playful Rounded (Nunito)' },
  { value: 'classic', label: 'Classic Serif (Playfair Display)' }
];

const TONE_OPTIONS = [
  { value: 'warm', label: 'Warm & Parent-Friendly' },
  { value: 'educational', label: 'Educational & Clear' },
  { value: 'playful', label: 'Playful & Engaging' }
];

function ColorRow({ label, color, onChange }) {
  return (
    <div className="brandkit-color-row">
      <div className="brandkit-color-swatch" style={{ backgroundColor: color }}>
        <input type="color" value={color} onChange={e => onChange(e.target.value)} />
      </div>
      <span className="brandkit-color-label">{label}</span>
      <span className="brandkit-color-value">{color.toUpperCase()}</span>
    </div>
  );
}

export default function BrandKit() {
  const { dispatch } = useStudio();
  const { brandKit, updateBrandKit, resetBrandKit } = useBrandKit();
  const fileInputRef = useRef(null);

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => updateBrandKit({ logo: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div className="sidebar" id="brand-kit-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Palette size={16} />
          Brand Kit
        </div>
        <button
          className="sidebar-close"
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
        >
          <X size={14} />
        </button>
      </div>

      <div className="brandkit-section">
        <div className="brandkit-section-title">Brand Colors</div>
        <ColorRow label="Primary" color={brandKit.primaryColor} onChange={v => updateBrandKit({ primaryColor: v })} />
        <ColorRow label="Secondary" color={brandKit.secondaryColor} onChange={v => updateBrandKit({ secondaryColor: v })} />
        <ColorRow label="Accent" color={brandKit.accentColor} onChange={v => updateBrandKit({ accentColor: v })} />
        <ColorRow label="Background" color={brandKit.backgroundColor} onChange={v => updateBrandKit({ backgroundColor: v })} />
        <ColorRow label="Text" color={brandKit.textColor} onChange={v => updateBrandKit({ textColor: v })} />
      </div>

      <div className="brandkit-section">
        <div className="brandkit-section-title">Font Style</div>
        <select
          className="brandkit-select"
          value={brandKit.fontStyle}
          onChange={e => updateBrandKit({ fontStyle: e.target.value })}
          id="font-style-select"
        >
          {FONT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="brandkit-section">
        <div className="brandkit-section-title">Tone of Voice</div>
        <select
          className="brandkit-select"
          value={brandKit.tone}
          onChange={e => updateBrandKit({ tone: e.target.value })}
          id="tone-select"
        >
          {TONE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="brandkit-section">
        <div className="brandkit-section-title">Logo</div>
        {brandKit.logo ? (
          <div className="brandkit-logo-preview">
            <img src={brandKit.logo} alt="Brand logo" className="brandkit-logo-img" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Logo uploaded</span>
            <button
              className="brandkit-logo-remove"
              onClick={() => updateBrandKit({ logo: null })}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <div
            className="brandkit-logo-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={20} style={{ margin: '0 auto 8px', color: 'var(--text-tertiary)' }} />
            <div className="brandkit-logo-upload-text">Click to upload logo</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>PNG, JPG — max 2MB</div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          style={{ display: 'none' }}
          onChange={handleLogoUpload}
        />
      </div>

      <button className="brandkit-reset" onClick={resetBrandKit}>
        Reset to Cuemath Defaults
      </button>
    </div>
  );
}
