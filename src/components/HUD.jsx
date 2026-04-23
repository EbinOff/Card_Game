import React, { useState } from 'react';

export default function HUD({
  turn,
  playerScore,
  botScore,
  botMatchCap,
  botCapEnabled,
  onToggleBotCap,
  selectedCount,
  onClaim,
  canClaim
}) {
  const [showBotInfo, setShowBotInfo] = useState(false);
  return (
    <div className="hud">
      <div className="hud-section">
        <span className="hud-label">Turn</span>
        <span className="hud-turn" style={{ color: turn === 'player' ? '#10b981' : '#a855f7' }}>
          {turn}
        </span>
      </div>

      <div className="hud-section">
        <span className="hud-label">You</span>
        <span className="hud-value" style={{ color: '#10b981' }}>{playerScore}</span>
      </div>

      <div className="hud-section">
        <span className="hud-label">Bot</span>
        <span className="hud-value" style={{ color: '#a855f7' }}>{botScore}</span>
      </div>

      <div
        className="hud-section"
        onClick={onToggleBotCap}
        style={{ cursor: 'pointer', transition: 'opacity 0.2s', position: 'relative' }}
        title="Tap to toggle bot cap ON/OFF"
      >
        <span className="hud-label" style={{ position: 'relative' }}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setShowBotInfo(true);
            }}
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: '1px solid currentColor',
              borderRadius: '50%',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '18px', 
              height: '18px', 
              fontSize: '11px',
              fontFamily: 'sans-serif',
              fontWeight: 'normal',
              opacity: 0.9,
              cursor: 'help',
              padding: '2px',
              textTransform: 'lowercase'
            }}
          >
            i
          </span>
          Bot Cap
        </span>
        <span
          className="hud-value"
          style={!botCapEnabled ? { opacity: 0.4, fontSize: '1.1rem', marginTop: '2px' } : {}}
        >
          {botCapEnabled ? botMatchCap : 'OFF'}
        </span>

        {/* Custom Bot Info Box */}
        {showBotInfo && (
          <>
            <div className="info-backdrop" onClick={(e) => { e.stopPropagation(); setShowBotInfo(false); }} />
            <div className="info-panel bot-cap-info" onClick={(e) => e.stopPropagation()}>
              <h3 className="info-panel-title">Bot Match Cap</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', textAlign: 'left' }}>
                Limits the maximum number of cards the bot can match in a single turn. 
                <br /><br />
                This is dynamically set by <strong>your previous move</strong>. If you match 2 cards, the bot can match at most 2 on its next turn.
                <br /><br />
                <span style={{ color: '#10b981' }}>● ON:</span> Competitive Balance (Easy)
                <br />
                <span style={{ color: '#ef4444' }}>● OFF:</span> Unrestricted Bot (Hard)
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '15px', padding: '8px' }} 
                onClick={() => setShowBotInfo(false)}
              >
                Got it
              </button>
            </div>
          </>
        )}
      </div>

      <div className="hud-actions">
        <button
          className="btn btn-primary"
          onClick={onClaim}
          disabled={turn !== 'player' || !canClaim}
        >
          Claim ({selectedCount})
        </button>
      </div>
    </div>
  );
}
