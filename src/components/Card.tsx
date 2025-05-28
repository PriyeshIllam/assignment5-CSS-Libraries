import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
  value: string;
  flipped: boolean;
  disabled: boolean;
  onClick: () => void;
}

// Card wrapper with perspective, using transient prop $disabled
const CardWrapper = styled.div<{ $disabled: boolean }>`
  width: 80px;
  height: 100px;
  perspective: 1000px;
  margin: 10px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  user-select: none;
`;

// The actual card that flips, using transient prop $flipped
const CardInner = styled.div<{ $flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 10px;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  background-color: #0077cc;

  ${({ $flipped }) =>
    $flipped
      ? css`
          transform: rotateY(180deg);
        `
      : css`
          transform: rotateY(0deg);
        `}
`;

// Front side (hidden side)
const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
  border-radius: 10px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

// Back side (emoji side)
const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 10px;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const Card: React.FC<CardProps> = ({ value, flipped, disabled, onClick }) => (
  <CardWrapper
    $disabled={disabled}
    onClick={disabled ? undefined : onClick}
    role="button"
    tabIndex={0}
    aria-pressed={flipped}
  >
    <CardInner $flipped={flipped}>
      <CardFront />
      <CardBack>{value}</CardBack>
    </CardInner>
  </CardWrapper>
);

export default Card;
