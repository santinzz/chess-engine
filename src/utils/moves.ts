import { Data, Effect } from 'effect'
import { EMPTY_SQUARE, PieceType, type Color, type Piece, type Square0x88 } from '../types'
import { isOnBoard, type Board0x88 } from './board'

export type Move = {
	from: Square0x88
	to: Square0x88
	piece: Piece
	capturedPiece: Piece | null
	promotion: Piece | null
	// Flags
	isEnPassant?: boolean
	isCastle?: boolean
	isPownDoublePush?: boolean
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

const KNIGHT_OFFSETS = [
  -33, -31, -18, -14,
  14, 18, 31, 33
]

export const getKnightPseudoLegalMoves = (
  board: Board0x88,
  fromSq: Square0x88,
  turn: Color
) => 
  Effect.gen(function* () {
    const pieceAtFrom = yield* getPieceAt(board, fromSq)

    if (pieceAtFrom === EMPTY_SQUARE) {
      return yield* Effect.fail(new MoveError({ message: `No piece at source square ${fromSq}`, cause: 'EmptySourceSquare' }))
    }

    if (pieceAtFrom.color !== turn) {
      return yield* Effect.fail(new MoveError({ message: `Piece at source square ${fromSq} is not of color ${turn}`, cause: 'PieceOfOpponentColor' }))
    }

    if (pieceAtFrom.type !== PieceType.Knight) {
      return yield* Effect.fail(new MoveError({ message: `Piece at source square ${fromSq} is not a Knight`, cause: 'InvalidPieceType' }))
    }

    const pseudoLegalMoves: Move[] = []

    for (const offset of KNIGHT_OFFSETS) {
      const toSq = fromSq + offset

      if (!isOnBoard(toSq)) continue

      const pieceAtTo = yield* Effect.sync(() => board[toSq]).pipe(
        Effect.match({
          onFailure: () => null,
          onSuccess: (piece) => piece,
        })
      )

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
  })