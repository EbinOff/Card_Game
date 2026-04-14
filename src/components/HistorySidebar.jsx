import React from 'react';

export default function HistorySidebar({ history, mobileVisible, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="history-sidebar desktop-only">
        <h2 className="history-title">Match History</h2>
        <MatchList history={history} />
      </div>

      {/* Mobile drawer */}
      {mobileVisible && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-header">
            <h2 className="history-title" style={{margin:0}}>Match History</h2>
            <button className="drawer-close-btn" onClick={onClose}>✕</button>
          </div>
          <MatchList history={history} />
        </div>
      )}
    </>
  );
}

function MatchList({ history }) {
  return (
    <div className="history-list">
      {history.map(entry => (
        <div key={entry.id} className={`history-entry ${entry.by}`}>
          <div className="history-meta">
            <span className="history-by">{entry.by.toUpperCase()}</span>
            <span className="history-score">+{entry.score}pts</span>
          </div>
          <div className="history-cards">
            {entry.cards.map(c => (
              <div key={c.id} className="mini-card" style={{ '--mini-accent': c.color }}>
                <div className={`mini-shape ${c.shape}`}></div>
                <div className="mini-number">{c.number}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
