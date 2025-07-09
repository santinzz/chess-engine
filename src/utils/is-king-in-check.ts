import type { GameState } from "../board";
import { findKingSquare, isSquareAttacked } from "../moves";
import { Color } from "../types";

export const isKingInCheck = (gameState: GameState, color: Color) => {
  const kingSquare = findKingSquare(color, gameState.board);

  if (kingSquare === null) {
    console.warn(`No king found for color ${color}.`);
    return false;
  }

  const opponentColor = color === Color.White ? Color.Black : Color.White;

  return isSquareAttacked(kingSquare, opponentColor, gameState);
}