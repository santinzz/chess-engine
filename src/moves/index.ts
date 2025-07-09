import { Data } from 'effect'
import { type Square0x88, type Piece, Color, PieceType } from '../types'
import { type Board0x88, isOnBoard, toAlgebraicNotation } from '../utils/board'
import type { GameState } from '../board'
import { getPseudoLegalMoves } from './piece'
import { executeMove } from './move'

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
 * @param board The 0x88 board.
 * @param sq The 0x88 square index.
 * @returns An Effect that succeeds with the Piece | null or fails with 'InvalidSquare'.
 */
export const getPieceAt = (board: Board0x88, sq: Square0x88) => {
	if (!isOnBoard(sq)) {
		return null
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
	const opponentPieces = gameState.board.map((piece, index) => {
		if (piece && piece.color === attackingColor) {
			return { type: piece.type, sq: index as Square0x88 }
		}
	}).filter(Boolean) as { type: PieceType; sq: Square0x88 }[]


	for (const piece of opponentPieces) {
		const pseudoLegalMoves = getPseudoLegalMoves(piece.type, piece.sq, gameState)
		if (pseudoLegalMoves.some((move) => move.to === sq)) {
			return true
		}
	}

	return false
}

export function findKingSquare(
	color: Color,
	board: Board0x88
) {
	for (let i = 0; i < 128; i++) {
		const piece = board[i]
		if (piece) {
			if (piece.type === PieceType.King && piece.color === color) {
				return i as Square0x88
			}
		}
	}

	return null
}

export function isKingInCheck (
	gameState: GameState,
	color: Color,
) {
	const kingSquare = findKingSquare(color, gameState.board)
	
	if (kingSquare === null) {
		console.warn(`No king found for color ${color}.`)
		return false
	}

	const opponentColor = color === Color.White ? Color.Black : Color.White

	return isSquareAttacked(kingSquare, opponentColor, gameState)
}

export function getLegalMoves(gameState: GameState): Move[] {
	const legalMoves: Move[] = []
	const currentColor = gameState.turn

	for (let fromSq = 0; fromSq < 128; fromSq++) {
		const piece = getPieceAt(gameState.board, fromSq)

		if (!piece || piece.color !== currentColor) continue

		let pseudoLegalMoves = getPseudoLegalMoves(piece.type, fromSq, gameState)

		for (const pseudoMove of pseudoLegalMoves) {
			const tempGameState = executeMove(gameState, pseudoMove)

			if (!isKingInCheck(tempGameState, currentColor)) {
				legalMoves.push(pseudoMove)
			}
		}
	}

	return legalMoves
}