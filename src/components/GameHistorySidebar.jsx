import React from 'react';

export default function GameHistorySidebar({ history, mobileVisible, onClose }) {
  const playerWins = history.filter(g => g.winner === 'player').length;
  const botWins = history.filter(g => g.winner === 'bot').length;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="game-history-sidebar desktop-only">
        <h2 className="history-title">Game History</h2>
        <WinTally playerWins={playerWins} botWins={botWins} />
        <GameList history={history} />
      </div>

      {/* Mobile drawer */}
      {mobileVisible && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-header">
            <h2 className="history-title" style={{margin:0}}>Game History</h2>
            <button className="drawer-close-btn" onClick={onClose}>x</button>
          </div>
          <WinTally playerWins={playerWins} botWins={botWins} />
          <GameList history={history} />
        </div>
      )}
    </>
  );
}

function WinTally({ playerWins, botWins }) {
  return (
    <div style={{display:'flex',justifyContent:'space-around',margin:'0 0 20px',padding:'10px',background:'rgba(255,255,255,0.05)',borderRadius:'8px'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'0.8rem',color:'#10b981',fontWeight:'bold'}}>YOU</div>
        <div style={{fontSize:'1.5rem',fontWeight:'800'}}>{playerWins}</div>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'0.8rem',color:'#a855f7',fontWeight:'bold'}}>BOT</div>
        <div style={{fontSize:'1.5rem',fontWeight:'800'}}>{botWins}</div>
      </div>
    </div>
  );
}

function GameList({ history }) {
  return (
    <div className="history-list">
      {history.length === 0 && <div style={{textAlign:'center',color:'var(--text-muted)',fontSize:'0.9rem'}}>No games finished</div>}
      {history.map((game, i) => (
        <div key={game.id} className={`history-entry ${game.winner}`}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <div style={{fontWeight:'bold',color:'var(--text-main)'}}>Game {history.length - i}</div>
            <div style={{fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'1px',color:'var(--text-muted)',background:'rgba(255,255,255,0.05)',padding:'2px 6px',borderRadius:'4px'}}>
              {game.mode || 'Easy'}
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem',marginBottom:'8px'}}>
            <span style={{color:'#10b981'}}>You: {game.playerScore}</span>
            <span style={{color:'#a855f7'}}>Bot: {game.botScore}</span>
          </div>
          <div style={{textAlign:'center',fontSize:'0.8rem',fontWeight:'800',background:'rgba(0,0,0,0.2)',padding:'4px',borderRadius:'4px'}}>
            WINNER: <span className="history-by">{game.winner.toUpperCase()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
