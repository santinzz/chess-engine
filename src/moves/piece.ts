import { Match } from 'effect'
import { PieceType, type Piece, type Square0x88 } from '../types'
import { getPawnPseudoLegalMoves } from './pawn'
import { getKnightPseudoLegalMoves } from './knight'
import { getKingPseudoLegalMoves } from './king'
import { getBishopPseudoLegalMoves } from './bishop'
import { getRookPseudoLegalMoves } from './rook'
import { getQueenPseudoLegalMoves } from './queen'
import type { GameState } from '../board'

export const getPseudoLegalMoves = (
	piece: Piece,
	fromSq: Square0x88,
	gameState: GameState
) => {
	switch (piece.type) {
		case PieceType.Pawn: return getPawnPseudoLegalMoves(fromSq, gameState, piece)
		case PieceType.Knight: return getKnightPseudoLegalMoves(gameState.board, fromSq, gameState.turn, piece)
		case PieceType.King: return getKingPseudoLegalMoves(fromSq, gameState)
		case PieceType.Bishop: return getBishopPseudoLegalMoves(gameState.board, fromSq, gameState.turn, piece)
		case PieceType.Rook: return getRookPseudoLegalMoves(fromSq, gameState.board, piece)
		case PieceType.Queen: return getQueenPseudoLegalMoves(gameState.board, fromSq, gameState.turn, piece)
	}
}
