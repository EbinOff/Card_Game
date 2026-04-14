import React from 'react';

export default function HUD({ 
  turn, 
  playerScore, 
  botScore,
  botMatchCap, 
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

      <div className="hud-section">
        <span className="hud-label">Bot Cap</span>
        <span className="hud-value">{botMatchCap}</span>
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
