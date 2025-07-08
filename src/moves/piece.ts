import { Match } from 'effect'
import { PieceType, type Square0x88 } from '../types'
import { getPawnPseudoLegalMoves } from './pawn'
import { getKnightPseudoLegalMoves } from './knight'
import { getKingPseudoLegalMoves } from './king'
import { getBishopPseudoLegalMoves } from './bishop'
import { getRookPseudoLegalMoves } from './rook'
import { getQueenPseudoLegalMoves } from './queen'
import type { GameState } from '../board'

export const getPseudoLegalMoves = (
	piece: PieceType,
	fromSq: Square0x88,
	gameState: GameState
) =>
	Match.value(piece).pipe(
		Match.when(PieceType.Pawn, () =>
			getPawnPseudoLegalMoves(fromSq, gameState)
		),
		Match.when(PieceType.Knight, () =>
			getKnightPseudoLegalMoves(gameState.board, fromSq, gameState.turn)
		),
		Match.when(PieceType.King, () =>
			getKingPseudoLegalMoves(fromSq, gameState)
		),
		Match.when(PieceType.Bishop, () =>
			getBishopPseudoLegalMoves(gameState.board, fromSq, gameState.turn)
		),
		Match.when(PieceType.Rook, () =>
			getRookPseudoLegalMoves(fromSq, gameState.board, gameState.turn)
		),
		Match.when(PieceType.Queen, () =>
			getQueenPseudoLegalMoves(gameState.board, fromSq, gameState.turn)
		),
		Match.exhaustive
	)
