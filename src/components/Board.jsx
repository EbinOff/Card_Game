import React from 'react';
import Card from './Card';
import { isExposed } from '../utils/gameLogic';

export default function Board({ cards, selectedCards, botHighlightIds, scatteringIds, onCardClick }) {
  const isSelected = (id) => selectedCards.some(c => c.id === id);
  const isHighlighted = (id) => botHighlightIds.includes(id);
  const isScattering = (id) => scatteringIds.includes(id);

  return (
    <div className="board-container">
      <div className="board">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            isExposed={isExposed(card, cards)}
            isSelected={isSelected(card.id)}
            isBotHighlight={isHighlighted(card.id)}
            isScattering={isScattering(card.id)}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}
