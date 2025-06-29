import { Effect } from 'effect'
import { getPieceAt, MoveError, type Move } from '.'
import { type Square0x88, Color, PieceType } from '../../types'
import { type Board0x88, isOnBoard, toAlgebraicNotation } from '../board'

export const getBishopPseudoLegalMoves = (
	board: Board0x88,
	fromSq: Square0x88,
	turn: Color
) => {
	return Effect.gen(function* () {
		const pieceAtFrom = yield* getPieceAt(board, fromSq)

		if (pieceAtFrom === null) {
			return yield* Effect.fail(
				new MoveError({
					message: `No piece at source square ${toAlgebraicNotation(fromSq)}`,
					cause: 'EmptySourceSquare',
				})
			)
		}

		if (pieceAtFrom.color !== turn) {
			return yield* Effect.fail(
				new MoveError({
					message: `Piece at source square ${toAlgebraicNotation(fromSq)} is not of color ${turn}`,
					cause: 'PieceOfOpponentColor',
				})
			)
		}

		if (pieceAtFrom.type !== PieceType.Bishop) {
			return yield* Effect.fail(
				new MoveError({
					message: `Piece at source square ${toAlgebraicNotation(fromSq)} is not a Bishop`,
					cause: 'InvalidPieceType',
				})
			)
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

				const pieceAtTo = yield* Effect.sync(() => board[toSq]).pipe(
					Effect.match({
						onFailure: () => null,
						onSuccess: (piece) => piece,
					})
				)

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
	})
}
