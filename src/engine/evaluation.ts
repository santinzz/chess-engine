import type { GameState } from "../board";
import { Color, PieceType } from "../types";
import { isOnBoard, to64index } from "../utils/board";
import { BISHOP_PST, KING_PST_ENDGAME, KING_PST_MIDGAME, KNIGHT_PST, PAWN_PST, QUEEN_PST, ROOK_PST } from "./pst";

export const PIECE_VALUES = {
  [PieceType.Pawn]: 100,
  [PieceType.Knight]: 300,
  [PieceType.Bishop]: 325,
  [PieceType.Rook]: 500,
  [PieceType.Queen]: 900,
  [PieceType.King]: 20000,
}

export const evaluate = (gameState: GameState) => {
  let score = 0

  let totalMaterial = 0

  for (let i = 0; i < 128; i++) {
    if (!isOnBoard(i)) continue
    const piece = gameState.board[i]

    if (piece && piece.type !== PieceType.King) {
      totalMaterial += PIECE_VALUES[piece.type]
    }
  }

  const midGameThreshold = PIECE_VALUES[PieceType.Rook] * 2 + PIECE_VALUES[PieceType.Queen]
  const endGameThreshold = PIECE_VALUES[PieceType.Rook] + PIECE_VALUES[PieceType.Knight] + PIECE_VALUES[PieceType.Bishop]

  const kingPst = totalMaterial > midGameThreshold ? KING_PST_MIDGAME : KING_PST_ENDGAME

  for (let i = 0; i < 128; i++) {
    if (!isOnBoard(i)) continue

    const piece = gameState.board[i]

    if (piece) {
      const value = PIECE_VALUES[piece.type]
      let positionalBonus = 0
      const index64 = to64index(i)

      const mirrorredIndex64 = (7 - Math.floor(index64 / 8)) * 8 + (index64 % 8)
      if (piece.color === Color.White) {
        score += value
        switch (piece.type) {
          case PieceType.Pawn: positionalBonus = PAWN_PST[index64]; break;
          case PieceType.Knight: positionalBonus = KNIGHT_PST[index64]; break;
          case PieceType.Bishop: positionalBonus = BISHOP_PST[index64]; break;
          case PieceType.Rook: positionalBonus = ROOK_PST[index64]; break;
          case PieceType.Queen: positionalBonus = QUEEN_PST[index64]; break;
          case PieceType.King: positionalBonus = kingPst[index64]; break;
        }
        score += positionalBonus
      } else {
        score -= value
        switch (piece.type) {
          case PieceType.Pawn: positionalBonus = PAWN_PST[mirrorredIndex64]; break;
          case PieceType.Knight: positionalBonus = KNIGHT_PST[mirrorredIndex64]; break;
          case PieceType.Bishop: positionalBonus = BISHOP_PST[mirrorredIndex64]; break;
          case PieceType.Rook: positionalBonus = ROOK_PST[mirrorredIndex64]; break;
          case PieceType.Queen: positionalBonus = QUEEN_PST[mirrorredIndex64]; break;
          case PieceType.King: positionalBonus = kingPst[mirrorredIndex64]; break;
        }
        score -= positionalBonus
      }
    }
  }

  if (gameState.turn === Color.Black) {
    score = -score
  }

  return score
}