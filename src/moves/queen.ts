import { getPieceAt, type Move } from '.'
import { MoveError } from '../errors'
import { type Square0x88, Color, PieceType } from '../types'
import { type Board0x88, isOnBoard, toAlgebraicNotation } from '../utils/board'

export const getQueenPseudoLegalMoves = (
	board: Board0x88,
	fromSq: Square0x88,
	turn: Color
) => {
	const pieceAtFrom = getPieceAt(board, fromSq)

	if (pieceAtFrom === null) {
		throw new MoveError({
			message: `No piece at source square ${toAlgebraicNotation(fromSq)}`,
			cause: 'EmptySourceSquare',
		})
	}

	if (pieceAtFrom.color !== turn) {
		throw new MoveError({
			message: `Piece at source square ${toAlgebraicNotation(
				fromSq
			)} is not of color ${turn}`,
			cause: 'PieceOfOpponentColor',
		})
	}

	if (pieceAtFrom.type !== PieceType.Queen) {
		throw new MoveError({
			message: `Piece at source square ${toAlgebraicNotation(
				fromSq
			)} is not a Queen`,
			cause: 'InvalidPieceType',
		})
	}

	const pseudoLegalMoves: Move[] = []

	// Bishop moves in all four diagonal directions
	const directions = [
		{ dx: 1, dy: 1 }, // Up-Right
		{ dx: 1, dy: -1 }, // Down-Right
		{ dx: -1, dy: 1 }, // Up-Left
		{ dx: -1, dy: -1 }, // Down-Left
	]

	for (const { dx, dy } of directions) {
		let toSq = fromSq

		while (true) {
			toSq += dx + dy * 16 // Move diagonally

			if (!isOnBoard(toSq)) break

			const pieceAtTo = board[toSq]

			if (pieceAtTo === null) {
				pseudoLegalMoves.push({
					from: fromSq,
					to: toSq,
					piece: pieceAtFrom,
					capturedPiece: null,
					promotion: null,
				})
			} else {
				if (pieceAtTo.color !== turn) {
					pseudoLegalMoves.push({
						from: fromSq,
						to: toSq,
						piece: pieceAtFrom,
						capturedPiece: pieceAtTo,
						promotion: null,
					})
				}
				break // Stop after hitting a piece
			}
		}
	}

	// Horizontal moves
	for (let direction of [1, -1]) {
		for (let i = 1; i <= 7; i++) {
			const targetSq = fromSq + direction * i
			if (!isOnBoard(targetSq)) break

			const pieceAtTarget = board[targetSq]
			if (pieceAtTarget === null) {
				pseudoLegalMoves.push({
					from: fromSq,
					to: targetSq,
					piece: pieceAtFrom,
					capturedPiece: null,
					promotion: null,
				})
			} else {
				if (pieceAtTarget.color !== pieceAtFrom.color) {
					pseudoLegalMoves.push({
						from: fromSq,
						to: targetSq,
						piece: pieceAtFrom,
						capturedPiece: pieceAtTarget,
						promotion: null,
					})
				}
				break
			}
		}
	}

	// Vertical moves
	for (let direction of [1, -1]) {
		for (let i = 1; i <= 7; i++) {
			const targetSq = fromSq + direction * i * 16 // Move in the same file (rank) direction
			if (!isOnBoard(targetSq)) break

			const pieceAtTarget = board[targetSq]
			if (pieceAtTarget === null) {
				pseudoLegalMoves.push({
					from: fromSq,
					to: targetSq,
					piece: pieceAtFrom,
					capturedPiece: null,
					promotion: null,
				})
			} else {
				if (pieceAtTarget.color !== pieceAtFrom.color) {
					pseudoLegalMoves.push({
						from: fromSq,
						to: targetSq,
						piece: pieceAtFrom,
						capturedPiece: pieceAtTarget,
						promotion: null,
					})
				}
				break
			}
		}
	}

	return pseudoLegalMoves
}
