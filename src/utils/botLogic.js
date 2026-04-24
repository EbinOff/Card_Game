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
    // Advanced 3-Ply Strategy: 
    // Evaluate: BotMoveScore - MaxPlayerResponseScore + MaxBotFollowUpScore
    
    // Sort candidates by score descending and limit to top 20 for performance
    const topCandidates = candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    let bestEval = -Infinity;
    let bestMove = topCandidates[0].combo;

    for (const botMove of topCandidates) {
      // Simulation Level 1: After Bot Move
      const s1Cards = simulateMove(allCards, botMove.combo);
      
      // Simulation Level 2: Player's best response
      const playerBest = getBestMoveDetails(s1Cards);
      const playerBestScore = playerBest ? playerBest.score : 0;
      
      let botFollowUpScore = 0;
      if (playerBest) {
        // Simulation Level 3: Bot's best follow-up after player response
        const s2Cards = simulateMove(s1Cards, playerBest.combo);
        const botFollowUp = getBestMoveDetails(s2Cards);
        botFollowUpScore = botFollowUp ? botFollowUp.score : 0;
      } else {
        // If player has no moves, bot essentially wins or gets another turn
        botFollowUpScore = 1000; // Heavy weight for checkmating player
      }

      // Eval = (Bot current) - (Player next) + (Bot follow-up)
      // We weight blocking slightly more to be "aggressive"
      const currentEval = botMove.score - (playerBestScore * 1.2) + (botFollowUpScore * 0.8);
      
      if (currentEval > bestEval) {
        bestEval = currentEval;
        bestMove = botMove.combo;
      }
    }
    return bestMove;
  } else {
    // Easy or Medium: Just find the highest scoring move
    return candidates.sort((a, b) => b.score - a.score)[0].combo;
  }
}

// Helper to simulate board state after a move
function simulateMove(cards, moveCombo) {
  return cards.map(c => 
    moveCombo.find(mc => mc.id === c.id) ? { ...c, isRemoved: true } : c
  );
}

// Helper to find the best move (score + combo) for a given board state
function getBestMoveDetails(cards) {
  const exposed = cards.filter(c => isExposed(c, cards));
  if (exposed.length < 2) return null;
  
  let best = null;
  
  for (let k = 4; k >= 2; k--) {
    const combs = getCombinations(exposed, k);
    for (const combo of combs) {
      if (isValidMatch(combo)) {
        const score = calculateScore(combo.length, getSharedAttributesCount(combo));
        if (!best || score > best.score) {
          best = { combo, score };
          // Early exit for Jackpot
          if (score >= 4000) return best;
        }
      }
    }
  }
  return best;
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
