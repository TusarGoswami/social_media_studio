import { History, X, Clock, Trash2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext.jsx';
import { useCarousel } from '../hooks/useCarousel.js';

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function GenerationHistory() {
  const { state, dispatch } = useStudio();
  const { loadFromHistory } = useCarousel();

  function handleClear() {
    dispatch({ type: 'CLEAR_HISTORY' });
  }

  return (
    <div className="sidebar sidebar-right" id="history-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <History size={16} />
          History
        </div>
        <button
          className="sidebar-close"
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
        >
          <X size={14} />
        </button>
      </div>

      {state.history.length === 0 ? (
        <div className="history-empty">
          <Clock size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No carousels generated yet.</p>
          <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>Your creations will appear here.</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {state.history.map((entry) => (
              <div
                key={entry.id}
                className="history-item"
                onClick={() => loadFromHistory(entry)}
              >
                <div className="history-item-idea">{entry.idea}</div>
                <div className="history-item-meta">
                  <span className="history-item-badge">{entry.format}</span>
                  <span>{entry.slides.length} slides</span>
                  <span>•</span>
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="history-clear" onClick={handleClear}>
            <Trash2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Clear History
          </button>
        </>
      )}
    </div>
  );
}
