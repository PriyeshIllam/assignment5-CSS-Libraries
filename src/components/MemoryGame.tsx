import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import type { MemoryGameStats } from '../types';

const emojis = ['🐶', '🐱', '🦁', '🐸', '🐵', '🐰'];

const shuffleArray = (array: string[]) =>
  array.sort(() => Math.random() - 0.5);

// Styled Components (same as before)
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 80px);
  grid-gap: 15px;
  justify-content: center;
  margin: 2rem 0;

  @media (max-width: 400px) {
    grid-template-columns: repeat(3, 80px);
  }
`;

const Stats = styled.div`
  max-width: 320px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  color: #333;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
`;

const StatItem = styled.div`
  flex: 1 1 45%;
  background: #e3e3e3;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
`;

const Button = styled.button`
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.7rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 119, 204, 0.4);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #005fa3;
    box-shadow: 0 8px 20px rgba(0, 95, 163, 0.6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #74ebd5;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 360px;
  width: 90%;
  padding: 2.5rem 2rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  text-align: center;

  h2 {
    margin-bottom: 1rem;
    font-size: 1.8rem;
    color: #0077cc;
  }

  p {
    margin: 0.5rem 0;
    font-weight: 600;
    font-size: 1.1rem;
    color: #444;
  }
`;

const LEVEL = 1;
const POINTS_PER_MATCH = 10;
const STORAGE_KEY = 'emoji-memory-stats';

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<string[]>(shuffleArray([...emojis, ...emojis]));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [misses, setMisses] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(1);
  const [knowledgePoints, setKnowledgePoints] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Load stats from localStorage on mount
  useEffect(() => {
    document.title = 'Emoji Memory Game';

    const savedStats = localStorage.getItem(STORAGE_KEY);
    if (savedStats) {
      const parsed: MemoryGameStats = JSON.parse(savedStats);
      setRoundsPlayed(parsed.roundsPlayed || 1);
      setKnowledgePoints(parsed.knowledgePoints || 0);
    }
  }, []);

  // Handle card click logic
  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedIndices.includes(index)
    )
      return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;

      if (cards[first] === cards[second]) {
        setMatchedIndices((prev) => {
          const newMatched = [...prev, first, second];

          if (newMatched.length === cards.length) {
            setTimeout(() => {
              setShowSummary(true);
            }, 500);
          }

          return newMatched;
        });
        setKnowledgePoints((prev) => prev + POINTS_PER_MATCH);
      } else {
        setMisses((prev) => prev + 1);
      }

      setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
    }
  };

  // Reset and save stats for new game
  const resetGame = () => {
    setCards(shuffleArray([...emojis, ...emojis]));
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setMisses(0);
    setRoundsPlayed((prev) => {
      const updated = prev + 1;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ roundsPlayed: updated, knowledgePoints })
      );
      return updated;
    });
    setShowSummary(false);
  };

  // Clear storage and reset all game data
  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCards(shuffleArray([...emojis, ...emojis]));
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setMisses(0);
    setRoundsPlayed(1);
    setKnowledgePoints(0);
    setShowSummary(false);
  };

  const accuracy = moves === 0 ? 0 : Math.round(((moves - misses) / moves) * 100);

  return (
    <AppContainer>
      <Grid>
        {cards.map((emoji, index) => (
          <Card
            key={index}
            value={emoji}
            flipped={flippedIndices.includes(index) || matchedIndices.includes(index)}
            disabled={matchedIndices.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </Grid>

      <Stats>
        <StatItem><strong>Moves:</strong> {moves}</StatItem>
        <StatItem><strong>Misses:</strong> {misses}</StatItem>
        <StatItem><strong>Rounds:</strong> {roundsPlayed}</StatItem>
        <StatItem><strong>Level:</strong> {LEVEL}</StatItem>
        <StatItem><strong>Knowledge:</strong> {knowledgePoints}</StatItem>
        <StatItem><strong>Accuracy:</strong> {accuracy}%</StatItem>
      </Stats>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Button onClick={resetGame}>New Game</Button>
        <Button onClick={clearStorage}>Clear Storage</Button>
      </div>

      {showSummary && (
        <ModalOverlay>
          <ModalContainer>
            <h2>Game Summary</h2>
            <p><strong>Moves:</strong> {moves}</p>
            <p><strong>Misses:</strong> {misses}</p>
            <p><strong>Rounds Played:</strong> {roundsPlayed}</p>
            <p><strong>Knowledge Points:</strong> {knowledgePoints}</p>
            <p><strong>Accuracy:</strong> {accuracy}%</p>
            <Button onClick={resetGame}>Play Again</Button>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AppContainer>
  );
};

export default MemoryGame;
