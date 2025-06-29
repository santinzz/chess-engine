import { Data, Effect } from 'effect'
import type { Square0x88, Piece } from '../../types'
import { type Board0x88, isOnBoard } from '../board'

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
export const getPieceAt = (
	board: Board0x88,
	sq: Square0x88
): Effect.Effect<Piece | null, MoveError> =>
	Effect.gen(function* () {
		if (!isOnBoard(sq)) {
			return yield* Effect.fail(
				new MoveError({
					cause: 'InvalidSourceSquare',
					message: `Invalid source square: ${sq}`,
				})
			)
		}

		return board[sq]
	})
