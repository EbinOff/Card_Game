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

export function findBestBotMove(allCards, botMatchCap, difficulty = 'easy') {
  const exposedCards = allCards.filter(c => isExposed(c, allCards));
  if (exposedCards.length < 2) return [];

  const minMatches = 2;
  const maxMatches = (difficulty === 'easy') ? Math.min(botMatchCap, 4) : 4;
  
  const candidates = [];

  // 1. Generate all valid moves
  for (let k = maxMatches; k >= minMatches; k--) {
    const combs = getCombinations(exposedCards, k);
    for (const combo of combs) {
      if (isValidMatch(combo)) {
        const score = calculateScore(combo.length, getSharedAttributesCount(combo));
        candidates.push({ combo, score });
      }
    }
  }

  if (candidates.length === 0) return [];

  // 2. Decide based on difficulty
  if (difficulty === 'hard') {
    // Blocking Logic: Choose the move that results in the lowest possible score for the player's next move
    let bestBotMove = candidates[0].combo;
    let minOpponentBestScore = Infinity;
    let maxBotScoreAtMinRisk = -1;

    // To prevent infinite recursion and keep it fast, we only look 1 move ahead
    for (const botMove of candidates) {
      const remainingCards = allCards.map(c => 
        botMove.combo.find(mc => mc.id === c.id) ? { ...c, isRemoved: true } : c
      );
      
      const opponentBestScore = getBestPotentialScore(remainingCards);
      
      if (opponentBestScore < minOpponentBestScore) {
        minOpponentBestScore = opponentBestScore;
        maxBotScoreAtMinRisk = botMove.score;
        bestBotMove = botMove.combo;
      } else if (opponentBestScore === minOpponentBestScore) {
        if (botMove.score > maxBotScoreAtMinRisk) {
          maxBotScoreAtMinRisk = botMove.score;
          bestBotMove = botMove.combo;
        }
      }
    }
    return bestBotMove;
  } else {
    // Easy or Medium: Just find the highest scoring move
    let bestMatch = [];
    let bestScore = -1;
    for (const candidate of candidates) {
      if (candidate.score > bestScore) {
        bestScore = candidate.score;
        bestMatch = candidate.combo;
      }
    }
    return bestMatch;
  }
}

// Helper to find the best move score for a given board state
function getBestPotentialScore(cards) {
  const exposed = cards.filter(c => isExposed(c, cards));
  if (exposed.length < 2) return 0;
  
  let maxScore = 0;
  // Check 4, 3, 2 card matches
  for (let k = 4; k >= 2; k--) {
    // Optimization: if we already found a score and k * 10 is less than maxScore/40, we might skip
    // but with 12 cards max, we can check all.
    const combs = getCombinations(exposed, k);
    for (const combo of combs) {
      if (isValidMatch(combo)) {
        const score = calculateScore(combo.length, getSharedAttributesCount(combo));
        if (score > maxScore) {
          maxScore = score;
          if (maxScore >= 4000) return maxScore; // Early exit for jackpot
        }
      }
    }
  }
  return maxScore;
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
