export const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']; // Red, Blue, Green, Yellow
export const SHAPES = ['circle', 'square', 'triangle', 'diamond'];
export const NUMBERS = [1, 2, 3, 4];

export function generateBoard() {
  const cards = [];
  // Layer 1: 4x4 (16 cards). Z=1.
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      cards.push(createCard(c, r, 1));
    }
  }
  // Layer 2: 3x3 (9 cards). Z=2.
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cards.push(createCard(c + 0.5, r + 0.5, 2));
    }
  }
  // Layer 3: 2x2 (4 cards). Z=3.
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      cards.push(createCard(c + 1, r + 1, 3));
    }
  }
  return cards;
}

function createCard(x, y, z) {
  return {
    id: `card-${z}-${x}-${y}`,
    x, y, z,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    number: NUMBERS[Math.floor(Math.random() * NUMBERS.length)],
    pattern: 'solid',
    isRemoved: false
  };
}

export function isExposed(card, allCards) {
  if (card.isRemoved) return false;

  // Rule 1: No TOP cover
  const isCovered = allCards.some(t => {
    if (t.isRemoved || t.z <= card.z) return false;
    const xOverlap = Math.abs(t.x - card.x) < 0.9;
    const yOverlap = Math.abs(t.y - card.y) < 0.9;
    return xOverlap && yOverlap;
  });

  return !isCovered;
}

export function getSharedAttributesCount(selectedCards) {
  if (selectedCards.length < 2) return 0;
  const first = selectedCards[0];
  let count = 0;
  if (selectedCards.every(c => c.color === first.color)) count++;
  if (selectedCards.every(c => c.shape === first.shape)) count++;
  if (selectedCards.every(c => c.number === first.number)) count++;
  return count;
}

export function isValidMatch(selectedCards) {
  if (selectedCards.length < 2 || selectedCards.length > 4) return false;
  return getSharedAttributesCount(selectedCards) > 0;
}

export function calculateScore(count, sharedAttributes = 1) {
  let baseScore = 0;
  if (count === 2) baseScore = 20;
  if (count === 3) baseScore = 80;
  if (count === 4) baseScore = 400;

  let multiplier = 1;
  if (sharedAttributes === 2) multiplier = 3;
  if (sharedAttributes === 3) multiplier = 10;
  
  return baseScore * multiplier;
}
