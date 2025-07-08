import { Data } from 'effect'
import type { Square0x88, Piece, Color } from '../types'
import { type Board0x88, isOnBoard } from '../utils/board'
import type { GameState } from '../board'
import { getPseudoLegalMoves } from './piece'

export type Move = {
	from: Square0x88
	to: Square0x88
	piece: Piece
	capturedPiece: Piece | null
	promotion: Piece | null
	// Flags
	isEnPassant?: boolean
	isCastle?: boolean
	isPawnDoublePush?: boolean
}

export class MoveError extends Data.TaggedError('MoveError')<{
	cause?:
		| 'EmptySourceSquare'
		| 'InvalidDestinationSquare'
		| 'InvalidSourceSquare'
		| 'InvalidPieceType'
		| 'PieceOfOpponentColor'
	message: string
}> {}

/**
 * Get the piece at a specific 0x88 square.
 * Returns an Effect that either succeeds with the piece (or null if empty) or fails if the square is off-board.
 * @param board The 0x88 board.
 * @param sq The 0x88 square index.
 * @returns An Effect that succeeds with the Piece | null or fails with 'InvalidSquare'.
 */
export const getPieceAt = (board: Board0x88, sq: Square0x88) => {
	if (!isOnBoard(sq)) {
		throw new Error(`Invalid square: ${sq}. Must be on board.`)
	}

	return board[sq]
}

/**
 * Placeholder for checking if a square is attacked by the opponent.
 * This will be properly implemented in the "Check for Check" phase.
 * For now, it always returns false.
 * @param sq The square to check.
 * @param attackingColor The color of the pieces that might be attacking (the opponent's color).
 * @param gameState The current game state.
 * @returns True if the square is attacked, false otherwise.
 */
export function isSquareAttacked(
	sq: Square0x88,
	attackingColor: Color,
	gameState: GameState
) {
	const opponentPieces = gameState.board.filter(
		(piece) => piece !== null && piece.color === attackingColor
	) as Piece[]

	for (const piece of opponentPieces) {
		const pseudoLegalMoves = getPseudoLegalMoves(piece.type, sq, gameState)
		if (pseudoLegalMoves.some((move) => move.to === sq)) {
			return true
		}
	}

	return false
}
