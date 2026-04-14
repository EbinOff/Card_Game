import React, { useState } from 'react';

const SCORING_INFO = [
  {
    category: 'Match Size (Base Points)',
    items: [
      { label: '2-Card Match', value: '20 pts' },
      { label: '3-Card Match', value: '80 pts' },
      { label: '4-Card Match', value: '400 pts' },
    ]
  },
  {
    category: 'Attribute Multipliers',
    items: [
      { label: '1 Shared Attribute', value: '×1 (no bonus)' },
      { label: '2 Shared Attributes', value: '×3 multiplier' },
      { label: '3 Shared Attributes', value: '×10 Jackpot!' },
    ]
  },
  {
    category: 'Examples',
    items: [
      { label: '3-card, 2 attrs', value: '80 × 3 = 240 pts' },
      { label: '4-card, 3 attrs', value: '400 × 10 = 4000 pts' },
    ]
  },
  {
    category: 'End Game Bonuses',
    items: [
      { label: 'Checkmate (block bot)', value: '+700 pts' },
      { label: 'Perfect Board Clear', value: '+700 pts' },
    ]
  }
];

export default function InfoButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="info-btn-wrapper">
      <button
        className="info-btn"
        onClick={() => setOpen(o => !o)}
        title="Scoring Guide"
        aria-label="Scoring info"
      >
        ℹ
      </button>

      {open && (
        <>
          <div className="info-backdrop" onClick={() => setOpen(false)} />
          <div className="info-panel">
            <h3 className="info-panel-title">Scoring Guide</h3>
            {SCORING_INFO.map(section => (
              <div key={section.category} className="info-section">
                <div className="info-section-header">{section.category}</div>
                {section.items.map(item => (
                  <div key={item.label} className="info-row">
                    <span className="info-row-label">{item.label}</span>
                    <span className="info-row-value">{item.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
