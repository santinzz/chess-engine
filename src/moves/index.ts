import { Data } from 'effect'
import { type Square0x88, type Piece, Color, PieceType } from '../types'
import { type Board0x88, isOnBoard, toAlgebraicNotation } from '../utils/board'
import type { GameState } from '../board'
import { getPseudoLegalMoves } from './piece'
import { executeMove } from './move'
import { PAWN_OFFSETS } from './pawn'
import { KNIGHT_OFFSETS } from './knight'

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
 * Placeholder for checking if a square is attacked by the opponent.
 * This will be properly implemented in the "Check for Check" phase.
 * For now, it always returns false.
 * @param sq The square to check.
 * @param attackingColor The color of the pieces that might be attacking (the opponent's color).
 * @param gameState The current game state.
 * @returns True if the square is attacked, false otherwise.
 */
	export const isSquareAttacked = (
		sq: Square0x88,
		attackingColor: Color,
		gameState: GameState
	): boolean => {
		const board = gameState.board
		
		const pawnOffsets = attackingColor === Color.White ? [-17, -15] : [15, 17]

		for (const offset of pawnOffsets) {
			const attackSquare = sq + offset
			if (isOnBoard(attackSquare)) {
				const piece = board[attackSquare]
				if (piece && piece.type === PieceType.Pawn && piece.color === attackingColor) {
					return true
				}
			}
		}

		for (const offset of KNIGHT_OFFSETS) {
			const attackSquare = sq + offset
			if (isOnBoard(attackSquare)) {
				const piece = board[attackSquare]
				if (piece && piece.type === PieceType.Knight && piece.color === attackingColor) {
					return true
				}
			}
		}

		const rookDirections = [-16, 16, -1, 1]; // Up, Down, Left, Right
		const bishopDirections = [-17, -15, 15, 17]; // Diagonals

		for (const direction of rookDirections) {
			let currentSquare = sq + direction;
			while (isOnBoard(currentSquare)) {
				const piece = board[currentSquare]
				if (piece) {
					if (piece.color === attackingColor && (piece.type === PieceType.Rook || piece.type === PieceType.Queen)) {
						return true
					}
					break
				}
				currentSquare += direction
			}
		}

		for (const direction of bishopDirections) {
			let currentSq = sq + direction;
			while (isOnBoard(currentSq)) {
				const piece = board[currentSq]
				if (piece) {
					if (piece.color === attackingColor && (piece.type === PieceType.Bishop || piece.type === PieceType.Queen)) {
						return true;
					}
					break; // Blocked
				}
				currentSq += direction;
			}
		}

		const kingOffsets = [-17, -16, -15, -1, 1, 15, 16, 17]
		for (const offset of kingOffsets) {
			const attackSquare = sq + offset
			if (isOnBoard(attackSquare)) {
				const piece = board[attackSquare]
				if (piece && piece.type === PieceType.King && piece.color === attackingColor) {
					return true
				}
			}
		}

		return false; 
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
	const opponentColor = color === Color.White ? Color.Black : Color.White
	const kingSquare = color === Color.White
		? gameState.whiteKingSquare
		: gameState.blackKingSquare

	return isSquareAttacked(kingSquare, opponentColor, gameState)
}

export function getLegalMoves(gameState: GameState): Move[] {
	const legalMoves: Move[] = []
	const currentColor = gameState.turn

	for (let fromSq = 0; fromSq < 128; fromSq++) {
		const piece = gameState.board[fromSq]

		if (!piece || piece.color !== currentColor) continue

		let pseudoLegalMoves = getPseudoLegalMoves(piece, fromSq, gameState)

		for (const pseudoMove of pseudoLegalMoves) {
			const tempGameState = executeMove(gameState, pseudoMove)

			if (!isKingInCheck(tempGameState, currentColor)) {
				legalMoves.push(pseudoMove)
			}
		}
	}

	return legalMoves
}