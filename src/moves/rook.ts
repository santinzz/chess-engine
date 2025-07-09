import type { GameState } from '../board'
import { type Piece, type Square0x88 } from '../types'
import { isOnBoard } from '../utils/board'
import type { Move } from '.'

export const getRookPseudoLegalMoves = (
	fromSq: Square0x88,
	board: GameState['board'],
	pieceAtFrom: Piece
) => {
	const pseudoLegalMoves: Move[] = []

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
