import { pipe, Effect } from "effect"
import { test, expect } from 'bun:test'
import { initializeStartingBoard } from "../src/board"
import { Rank, File } from "../src/types"
import { to0x88 } from "../src/utils/board"
import { getBishopPseudoLegalMoves } from "../src/utils/moves/bishop"
import { modifyPiecePositionAlgebraic } from "../src/utils/moves/move-piece"

test('Bishop initial pseudo-legal moves', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      const moves = yield* getBishopPseudoLegalMoves(
        initialGameState.board,
        to0x88(File.F, Rank.R1),
        initialGameState.turn
      )

      expect(moves).toHaveLength(0)
    }),
    Effect.runPromise
  )
)

test('Bishop pseudo-legal moves from h3', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      yield* modifyPiecePositionAlgebraic(initialGameState.board, 'f1', 'h3')

      const moves = yield* getBishopPseudoLegalMoves(
        initialGameState.board,
        to0x88(File.H, Rank.R3),
        initialGameState.turn
      )

      expect(moves).toHaveLength(4)
    }),
    Effect.runPromise
  )
)