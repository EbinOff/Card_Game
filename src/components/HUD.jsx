import React from 'react';

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
        style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
        title="Tap to toggle bot cap ON/OFF"
      >
        <span className="hud-label" style={{ display: 'flex', alignItems: 'center' }}>
          <span 
            title="Bot Match Cap: Limits maximum cards the bot can match at once." 
            style={{
              marginRight: '6px', 
              cursor: 'help', 
              border: '1px solid currentColor', 
              borderRadius: '50%', 
              display: 'inline-flex', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '14px', 
              height: '14px', 
              fontSize: '9px',
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              opacity: 0.8
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
