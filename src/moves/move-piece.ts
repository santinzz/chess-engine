import { Effect } from "effect"
import { MoveError } from "."
import type { Board0x88 } from "../utils/board"
import { parseAlgebraicNotation, type AlgebraicNotation } from "../utils/board"

export const modifyPiecePositionAlgebraic = (
  board: Board0x88,
  fromSq: AlgebraicNotation,
  toSq: AlgebraicNotation
) => Effect.gen(function* () {
  const fromSq0x88 = yield* parseAlgebraicNotation(fromSq)
  const toSq0x88 = yield* parseAlgebraicNotation(toSq)
  const pieceAtFrom = board[fromSq0x88]

  if (pieceAtFrom === null) {
    return yield* Effect.fail(
      new MoveError({
        message: `No piece at source square ${fromSq}`,
        cause: 'EmptySourceSquare',
      })
    )
  }

  board[toSq0x88] = pieceAtFrom
  board[fromSq0x88] = null
})