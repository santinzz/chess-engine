import { EMPTY_SQUARE, type Color, type Piece, type Square0x88 } from '../types'
import { isOnBoard, type Board0x88 } from '../utils/board'
import { type Move } from '.'

export const KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33]

export const getKnightPseudoLegalMoves = (
	board: Board0x88,
	fromSq: Square0x88,
	turn: Color,
	pieceAtFrom: Piece
) => {
	const pseudoLegalMoves: Move[] = []

	for (const offset of KNIGHT_OFFSETS) {
		const toSq = fromSq + offset

		if (!isOnBoard(toSq)) continue

		const pieceAtTo = board[toSq]

		if (pieceAtTo === EMPTY_SQUARE) {
			pseudoLegalMoves.push({
				from: fromSq,
				to: toSq,
				piece: pieceAtFrom,
				capturedPiece: null,
				promotion: null,
			})
		} else if (pieceAtTo.color !== turn) {
			pseudoLegalMoves.push({
				from: fromSq,
				to: toSq,
				piece: pieceAtFrom,
				capturedPiece: pieceAtTo,
				promotion: null,
			})
		}
	}

	return pseudoLegalMoves
}
