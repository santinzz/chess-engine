import { EMPTY_SQUARE, PieceType, type Color, type Square0x88 } from '../types'
import { isOnBoard, toAlgebraicNotation, type Board0x88 } from '../utils/board'
import { getPieceAt, type Move } from '.'
import { MoveError } from '../errors'

const KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33]

export const getKnightPseudoLegalMoves = (
	board: Board0x88,
	fromSq: Square0x88,
	turn: Color
) => {
	const pieceAtFrom = getPieceAt(board, fromSq)

	if (pieceAtFrom === EMPTY_SQUARE) {
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

	if (pieceAtFrom.type !== PieceType.Knight) {
		throw new MoveError({
			message: `Piece at source square ${toAlgebraicNotation(
				fromSq
			)} is not a Knight`,
			cause: 'InvalidPieceType',
		})
	}

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
