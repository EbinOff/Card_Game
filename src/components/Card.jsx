import React from 'react';

export default function Card({
  card,
  isExposed,
  isNearExposed,
  isSelected,
  isBotHighlight,
  isScattering,
  onClick
}) {
  if (card.isRemoved && !isScattering) return null;

  let className = 'card';
  if (isExposed) className += ' exposed';
  if (isNearExposed) className += ' near-exposed';
  if (isSelected) className += ' selected';
  if (isBotHighlight) className += ' bot-highlight';
  if (isScattering) className += ' scattering';

  // Random rotation direction per card using seeded value from id
  const rotSeed = card.id.charCodeAt(card.id.length - 1);
  const rot = ((rotSeed % 40) - 20); // -20 to +20 degrees

  const filter = isExposed
    ? 'brightness(1) saturate(1)'
    : (isNearExposed ? 'brightness(0.5) saturate(1)' : 'brightness(0.25) saturate(1)');

  const style = {
    left: `calc(${card.x} * var(--card-width))`,
    top: `calc(${card.y} * var(--card-height))`,
    transform: `translateZ(${card.z * 10}px)`,
    zIndex: card.z * 5,
    color: card.color,
    filter,
    WebkitFilter: filter,
    opacity: isExposed ? 1 : 0.7,
    background: isExposed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
    '--scatter-rot': `${rot}deg`,
  };

  // Cache bust: 12345
  console.debug('Card rendered', card.id);

  return (
    <div className={className} style={style} onClick={() => isExposed && !isScattering && onClick(card)}>
      <div className={`card-content ${card.pattern}`}>
        <div className={`card-shape ${card.shape}`}></div>
        <div className="card-number">{card.number}</div>
      </div>
    </div>
  );
}
