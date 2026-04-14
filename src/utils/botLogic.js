import { isExposed, isValidMatch, calculateScore, getSharedAttributesCount } from './gameLogic';

function getCombinations(array, k) {
  const result = [];
  function backtrack(start, currentCombo) {
    if (currentCombo.length === k) {
      result.push([...currentCombo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      currentCombo.push(array[i]);
      backtrack(i + 1, currentCombo);
      currentCombo.pop();
    }
  }
  backtrack(0, []);
  return result;
}

export function findBestBotMove(allCards, botMatchCap) {
  const exposedCards = allCards.filter(c => isExposed(c, allCards));
  let bestMatch = [];
  let bestScore = -1;

  const minMatches = 2;
  const maxMatches = Math.min(botMatchCap, 4); 
  
  for (let k = maxMatches; k >= minMatches; k--) {
    const combs = getCombinations(exposedCards, k);
    for (const combo of combs) {
      if (isValidMatch(combo)) {
         let score = calculateScore(combo.length, getSharedAttributesCount(combo));
         if (score > bestScore) {
           bestScore = score;
           bestMatch = combo;
         }
      }
    }
  }
  return bestMatch; 
}

export function hasAnyMoves(allCards) {
  const exposedCards = allCards.filter(c => isExposed(c, allCards));
  if (exposedCards.length < 2) return false;
  
  const combs = getCombinations(exposedCards, 2);
  for (const combo of combs) {
    if (isValidMatch(combo)) return true;
  }
  return false;
}
