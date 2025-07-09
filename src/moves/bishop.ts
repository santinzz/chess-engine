import { type Move } from '.'
import { type Piece, type Square0x88, Color } from '../types'
import { type Board0x88, isOnBoard } from '../utils/board'

export const getBishopPseudoLegalMoves = (
	board: Board0x88,
	fromSq: Square0x88,
	turn: Color,
	pieceAtFrom: Piece
) => {
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
	return pseudoLegalMoves
}
