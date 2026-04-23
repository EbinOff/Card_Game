import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import HUD from './components/HUD';
import InfoButton from './components/InfoButton';
import HistorySidebar from './components/HistorySidebar';
import GameHistorySidebar from './components/GameHistorySidebar';
import { generateBoard, isValidMatch, calculateScore, getSharedAttributesCount } from './utils/gameLogic';
import { findBestBotMove, hasAnyMoves } from './utils/botLogic';

function App() {
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState('player');
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [botMatchCap, setBotMatchCap] = useState(2);
  const [botCapEnabled, setBotCapEnabled] = useState(true);
  const [selectedCards, setSelectedCards] = useState([]);
  const [botHighlightIds, setBotHighlightIds] = useState([]);
  const [scatteringIds, setScatteringIds] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameOver, setGameOver] = useState(null);
  // Mobile drawer state
  const [mobileDrawer, setMobileDrawer] = useState(null); // null | 'game' | 'match'

  React.useEffect(() => {
    setCards(generateBoard());
  }, []);

  React.useEffect(() => {
    if (cards.length > 0 && !gameOver) {
      if (!hasAnyMoves(cards)) {
        let survivorBonus = 0;
        let bonusReason = '';

        if (cards.every(c => c.isRemoved)) {
          survivorBonus = 700;
          bonusReason = 'Perfect Board Clear!';
        } else {
          survivorBonus = 700;
          bonusReason = 'Checkmate Bonus (+700)';
        }

        let finalPlayerScore = playerScore;
        let finalBotScore = botScore;

        if (turn === 'player') {
          finalBotScore += survivorBonus;
          setBotScore(finalBotScore);
        } else {
          finalPlayerScore += survivorBonus;
          setPlayerScore(finalPlayerScore);
        }

        let winner;
        if (finalPlayerScore > finalBotScore) winner = 'player';
        else if (finalBotScore > finalPlayerScore) winner = 'bot';
        else winner = 'tie';

        setGameOver({ winner, reason: bonusReason });
        setGameHistory(prev => [{
          id: Date.now().toString(),
          winner,
          playerScore: finalPlayerScore,
          botScore: finalBotScore
        }, ...prev]);
        return;
      }
    }

    if (turn === 'bot' && !gameOver) {
      const runBot = async () => {
        await new Promise(r => setTimeout(r, 1500));
        const activeCap = botCapEnabled ? botMatchCap : 4;
        const bestMove = findBestBotMove(cards, activeCap);

        if (bestMove.length > 0) {
          const moveIds = bestMove.map(c => c.id);
          setBotHighlightIds(moveIds);
          await new Promise(r => setTimeout(r, 800));

          const score = calculateScore(bestMove.length, getSharedAttributesCount(bestMove));
          setBotScore(prev => prev + score);

          setMatchHistory(prev => [{
            id: Date.now().toString() + 'b',
            by: 'bot',
            cards: bestMove,
            score
          }, ...prev]);

          setCards(prev => prev.map(c =>
            moveIds.includes(c.id) ? { ...c, isRemoved: true } : c
          ));
          setBotHighlightIds([]);
        } else {
          setBotMatchCap(prev => Math.max(2, prev - 1));
        }

        setTurn('player');
      };
      runBot();
    }
  }, [turn, cards, botMatchCap, botCapEnabled, gameOver, playerScore, botScore]);

  const handleCardClick = (card) => {
    if (turn !== 'player' || gameOver) return;
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(prev => prev.filter(c => c.id !== card.id));
    } else {
      if (selectedCards.length < 4) {
        setSelectedCards(prev => [...prev, card]);
      }
    }
  };

  const handleClaim = () => {
    if (turn !== 'player' || !isValidMatch(selectedCards) || gameOver) return;

    const sharedAttrs = getSharedAttributesCount(selectedCards);
    const score = calculateScore(selectedCards.length, sharedAttrs);
    setPlayerScore(prev => prev + score);

    setMatchHistory(prev => [{
      id: Date.now().toString() + 'p',
      by: 'player',
      cards: selectedCards,
      score
    }, ...prev]);

    const idsToRemove = selectedCards.map(c => c.id);
    setScatteringIds(idsToRemove);
    setSelectedCards([]);

    setTimeout(() => {
      setScatteringIds([]);
      setCards(prev => prev.map(c =>
        idsToRemove.includes(c.id) ? { ...c, isRemoved: true } : c
      ));
      setBotMatchCap(selectedCards.length);
      setTurn('bot');
    }, 460);
  };

  const resetGame = () => {
    setCards(generateBoard());
    setTurn('player');
    setPlayerScore(0);
    setBotScore(0);
    setBotMatchCap(2);
    setBotCapEnabled(true);
    setSelectedCards([]);
    setBotHighlightIds([]);
    setScatteringIds([]);
    setMatchHistory([]);
    setGameOver(null);
  };

  return (
    <div className="app-container">
      <GameHistorySidebar
        history={gameHistory}
        mobileVisible={mobileDrawer === 'game'}
        onClose={() => setMobileDrawer(null)}
      />

      <div className="main-area">
        <HUD
          turn={turn}
          playerScore={playerScore}
          botScore={botScore}
          botMatchCap={botMatchCap}
          botCapEnabled={botCapEnabled}
          onToggleBotCap={() => setBotCapEnabled(prev => !prev)}
          selectedCount={selectedCards.length}
          onClaim={handleClaim}
          canClaim={isValidMatch(selectedCards)}
        />
        <InfoButton />
        <Board
          cards={cards}
          selectedCards={selectedCards}
          botHighlightIds={botHighlightIds}
          scatteringIds={scatteringIds}
          onCardClick={handleCardClick}
        />

        {/* Mobile bottom tab bar */}
        <div className="mobile-tab-bar mobile-only">
          <button
            className={`mobile-tab ${mobileDrawer === 'game' ? 'active' : ''}`}
            onClick={() => setMobileDrawer(d => d === 'game' ? null : 'game')}
          >
            Games
          </button>
          <button
            className={`mobile-tab ${mobileDrawer === 'match' ? 'active' : ''}`}
            onClick={() => setMobileDrawer(d => d === 'match' ? null : 'match')}
          >
            Moves
          </button>
        </div>
      </div>

      <HistorySidebar
        history={matchHistory}
        mobileVisible={mobileDrawer === 'match'}
        onClose={() => setMobileDrawer(null)}
      />

      {/* Mobile drawer backdrop */}
      {mobileDrawer && (
        <div className="mobile-backdrop mobile-only" onClick={() => setMobileDrawer(null)} />
      )}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h1>
              {gameOver.winner === 'player' ? 'YOU WIN!' : gameOver.winner === 'bot' ? 'BOT WINS!' : 'TIE GAME!'}
            </h1>
            <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '1.1rem' }}>
              {gameOver.reason}
            </p>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1rem', color: '#10b981' }}>Your Score</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{playerScore}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1rem', color: '#a855f7' }}>Bot Score</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{botScore}</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

