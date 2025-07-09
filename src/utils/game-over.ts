import type { GameState } from "../board"
import { findKingSquare, getLegalMoves, isKingInCheck, isSquareAttacked } from "../moves"
import { getKingPseudoLegalMoves } from "../moves/king"
import { Color } from "../types"
import { isInsufficientMaterial } from "./is-insufficient-material"

export enum GameResult {
  NotOver = "NOT_OVER",
  Checkmate = "CHECKMATE",
  Stalemate = "STALEMATE",
  DrawFiftyMoveRule = "DRAW_50_MOVE_RULE",
  DrawThreefoldRepetition = "DRAW_THREEFOLD_REPETITION",
  DrawInsufficientMaterial = "DRAW_INSUFFICIENT_MATERIAL",
}

export const isGameOver = (gameState: GameState): GameResult => {
  const currentColor = gameState.turn

  const legalMoves = getLegalMoves(gameState)

  if (legalMoves.length === 0) {
    if (isKingInCheck(gameState, currentColor)) return GameResult.Checkmate
    else return GameResult.Stalemate
  }

  if (gameState.halfMoveClock >= 100) {
    return GameResult.DrawFiftyMoveRule
  }

  if (isInsufficientMaterial(gameState.board)) {
    return GameResult.DrawInsufficientMaterial
  }

  return GameResult.NotOver
}