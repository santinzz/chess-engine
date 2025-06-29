import { Effect, pipe } from "effect";
import { test, expect } from 'bun:test'
import { getKnightPseudoLegalMoves } from "../src/utils/moves/knight";
import { initializeStartingBoard } from "../src/board";
import { parseAlgebraicNotation, to0x88, toAlgebraicNotation } from "../src/utils/board";
import { File, Rank } from "../src/types";
import { modifyPiecePositionAlgebraic } from "../src/utils/moves/move-piece";
import { printBoard } from "../src/utils/print-board";

test('Knight initial pseudo-legal moves', () => 
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      const moves = yield* getKnightPseudoLegalMoves(
        initialGameState.board,
        to0x88(File.G, Rank.R1),
        initialGameState.turn
      )

      expect(moves).toHaveLength(2)
      expect(toAlgebraicNotation(moves[0].to)).toBe("f3")
      expect(toAlgebraicNotation(moves[1].to)).toBe("h3")
    }),
    Effect.runPromise
  )
)

test('Knight pseudo-legal moves from d4', () => 
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      yield* modifyPiecePositionAlgebraic(initialGameState.board, 'g1', 'd4')

      const moves = yield* getKnightPseudoLegalMoves(
        initialGameState.board,
        to0x88(File.D, Rank.R4),
        initialGameState.turn
      )

      yield* printBoard(initialGameState)

      expect(moves).toHaveLength(6)
      const expectedMoves = yield* Effect.forEach([
        'f5', 'e6', 'c6', 'b5', 'b3', 'f3'
      ], (sq) => parseAlgebraicNotation(sq))


      for (const move of moves) {
        expect(expectedMoves).toContain(move.to)
      }
    }),
    Effect.runPromise
  )
)