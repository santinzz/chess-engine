import { getPieceAt, isSquareAttacked, type Move } from '.'
import type { GameState } from '../board'
import {
	Color,
	EMPTY_SQUARE,
	File,
	PieceType,
	Rank,
	type Square0x88,
} from '../types'
import { toAlgebraicNotation, isOnBoard, to0x88 } from '../utils/board'
import { MoveError } from '../errors'

export const getKingPseudoLegalMoves = (
	fromSq: Square0x88,
	gameState: GameState
) => {
	const pieceAtFrom = getPieceAt(gameState.board, fromSq)

	if (pieceAtFrom === null) {
		throw new MoveError({
			message: `No piece at source square ${toAlgebraicNotation(fromSq)}`,
			cause: 'EmptySourceSquare',
		})
	}

	if (pieceAtFrom.color !== gameState.turn) {
		throw new MoveError({
			message: `Piece at source square ${toAlgebraicNotation(
				fromSq
			)} is not of color ${gameState.turn}`,
			cause: 'PieceOfOpponentColor',
		})
	}

	if (pieceAtFrom.type !== PieceType.King) {
		throw new MoveError({
			message: `Piece at source square ${toAlgebraicNotation(
				fromSq
			)} is not a King`,
			cause: 'InvalidPieceType',
		})
	}

	// King can move one square in any direction
	const directions = [
		-1,
		1,
		-16,
		16,
		-15,
		-17,
		15,
		17, // Left, Right, Up, Down, Up-Left, Up-Right, Down-Left, Down-Right
	]

	const pseudoLegalMoves: Move[] = []

	for (const direction of directions) {
		const toSq = fromSq + direction
		if (isOnBoard(toSq)) {
			const pieceAtTo = gameState.board[toSq]
			if (pieceAtTo === null || pieceAtTo.color !== pieceAtFrom.color) {
				pseudoLegalMoves.push({
					from: fromSq,
					to: toSq,
					piece: pieceAtFrom,
					capturedPiece: pieceAtTo || null,
					promotion: null,
				})
			}
		}
	}

	const kingStartSq = to0x88(File.E, Rank.R1)

	if (fromSq === kingStartSq) {
		if (gameState.turn === Color.White && gameState.castlingRights.whiteKingSide) {
			const f1 = to0x88(File.F, Rank.R1)
			const g1 = to0x88(File.G, Rank.R1)

			if (gameState.board[f1] === EMPTY_SQUARE && gameState.board[g1] === EMPTY_SQUARE) {
				if (
					!isSquareAttacked(kingStartSq, Color.Black, gameState) &&
					!isSquareAttacked(f1, Color.Black, gameState) &&
					!isSquareAttacked(g1, Color.Black, gameState)
				) {
					pseudoLegalMoves.push({
						from: fromSq,
						to: g1,
						piece: pieceAtFrom,
						capturedPiece: null,
						promotion: null,
						isCastle: true,
					})
				}
			}
		}

		// White Queen-side Castling (O-O-O)
		if (gameState.turn === Color.White && gameState.castlingRights.whiteQueenSide) {
			const b1 = to0x88(File.B, Rank.R1)
			const c1 = to0x88(File.C, Rank.R1)
			const d1 = to0x88(File.D, Rank.R1)

			// Check if squares B1, C1, D1 are empty
			if (
				gameState.board[b1] === EMPTY_SQUARE &&
				gameState.board[c1] === EMPTY_SQUARE &&
				gameState.board[d1] === EMPTY_SQUARE
			) {
				// Check if E1, D1, C1 are not attacked
				if (
					!isSquareAttacked(kingStartSq, Color.Black, gameState) &&
					!isSquareAttacked(d1, Color.Black, gameState) &&
					!isSquareAttacked(c1, Color.Black, gameState)
				) {
					pseudoLegalMoves.push({
						from: kingStartSq,
						to: c1, // King moves to C1
						piece: pieceAtFrom,
						capturedPiece: null,
						promotion: null,
						isCastle: true,
					})
				}
			}
		}

		if (gameState.turn === Color.Black && gameState.castlingRights.blackKingSide) {
			const f8 = to0x88(File.F, Rank.R8)
			const g8 = to0x88(File.G, Rank.R8)

			// Check if squares F8 and G8 are empty
			if (gameState.board[f8] === EMPTY_SQUARE && gameState.board[g8] === EMPTY_SQUARE) {
				// Check if E8, F8, G8 are not attacked
				if (
					!isSquareAttacked(kingStartSq, Color.White, gameState) &&
					!isSquareAttacked(f8, Color.White, gameState) &&
					!isSquareAttacked(g8, Color.White, gameState)
				) {
					pseudoLegalMoves.push({
						from: kingStartSq,
						to: g8, // King moves to G8
						piece: pieceAtFrom,
						capturedPiece: null,
						promotion: null,
						isCastle: true,
					})
				}
			}
		}

		// Black Queen-side Castling (O-O-O)
		if (gameState.turn === Color.Black && gameState.castlingRights.blackQueenSide) {
			const b8 = to0x88(File.B, Rank.R8)
			const c8 = to0x88(File.C, Rank.R8)
			const d8 = to0x88(File.D, Rank.R8)

			// Check if squares B8, C8, D8 are empty
			if (
				gameState.board[b8] === EMPTY_SQUARE &&
				gameState.board[c8] === EMPTY_SQUARE &&
				gameState.board[d8] === EMPTY_SQUARE
			) {
				// Check if E8, D8, C8 are not attacked
				if (
					!isSquareAttacked(kingStartSq, Color.White, gameState) &&
					!isSquareAttacked(d8, Color.White, gameState) &&
					!isSquareAttacked(c8, Color.White, gameState)
				) {
					pseudoLegalMoves.push({
						from: kingStartSq,
						to: c8, // King moves to C8
						piece: pieceAtFrom,
						capturedPiece: null,
						promotion: null,
						isCastle: true,
					})
				}
			}
		}
	}

	return pseudoLegalMoves
}
