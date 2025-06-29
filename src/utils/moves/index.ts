import { Data, Effect } from 'effect'
import type { Square0x88, Piece, Color } from '../../types'
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


/**
 * Placeholder for checking if a square is attacked by the opponent.
 * This will be properly implemented in the "Check for Check" phase.
 * For now, it always returns false.
 * @param sq The square to check.
 * @param attackingColor The color of the pieces that might be attacking (the opponent's color).
 * @param board The current board state.
 * @returns True if the square is attacked, false otherwise.
 */
export function isSquareAttacked(sq: Square0x88, attackingColor: Color, board: Board0x88): boolean {
    // TODO: Implement actual logic to check if 'sq' is attacked by any piece of 'attackingColor' on 'board'.
    // This will involve iterating through all opponent pieces and checking their pseudo-legal moves
    // that attack 'sq'. This is a complex function and will be built later.
    // For now, we return false to allow castling moves to be generated as pseudo-legal.
    return false;
}