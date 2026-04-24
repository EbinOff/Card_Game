import React, { useState } from 'react';

export default function HUD({
  turn,
  playerScore,
  botScore,
  botMatchCap,
  difficulty,
  selectedCount,
  onClaim,
  canClaim
}) {
  const [showModeInfo, setShowModeInfo] = useState(false);
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
        style={{ cursor: 'default', transition: 'opacity 0.2s', position: 'relative' }}
      >
        <span className="hud-label" style={{ position: 'relative' }}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setShowModeInfo(true);
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
          Mode
        </span>
        <span
          className="hud-value"
          style={{ 
            color: difficulty === 'easy' ? '#10b981' : '#f59e0b',
            textTransform: 'uppercase',
            fontSize: '1rem'
          }}
        >
          {difficulty}
        </span>

        {/* Custom Mode Info Box */}
        {showModeInfo && (
          <>
            <div className="info-backdrop" onClick={(e) => { e.stopPropagation(); setShowModeInfo(false); }} />
            <div className="info-panel bot-cap-info" onClick={(e) => e.stopPropagation()}>
              <h3 className="info-panel-title">Game Modes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', textAlign: 'left' }}>
                <strong style={{ color: '#10b981' }}>Easy:</strong>
                <br />
                Bot is capped by your moves. Match 2 cards, bot matches max 2.
                <br /><br />
                <strong style={{ color: '#3B82F6' }}>Medium:</strong>
                <br />
                No restrictions. Bot always finds its highest scoring move.
                <br /><br />
                <strong style={{ color: '#f59e0b' }}>Hard:</strong>
                <br />
                Advanced 3-ply strategy: predicts threats and sets up Jackpots.
              </p>
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
