import { pipe, Effect } from "effect"
import { test, expect } from 'bun:test'
import { initializeStartingBoard } from "../src/board"
import { PieceType, Color } from "../src/types"
import { createEmpty0x88BoardGameState, parseAlgebraicNotation, toAlgebraicNotation } from "../src/utils/board"
import { getQueenPseudoLegalMoves } from "../src/utils/moves/queen"

test('Queen initial pseudo-legal moves', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      const d1QueenSquare = yield* parseAlgebraicNotation('d1')
      const moves = yield* getQueenPseudoLegalMoves(
        initialGameState.board,
        d1QueenSquare,
        initialGameState.turn
      )

      expect(moves).toHaveLength(0)
    }),
    Effect.runPromise
  )
)

test('Queen pseudo-legal moves from d1 empty board', () =>
  pipe(
    Effect.gen(function* () {
      const emptyBoardGameState = createEmpty0x88BoardGameState()

      const d1QueenSquare = yield* parseAlgebraicNotation('d1')

      emptyBoardGameState.board[d1QueenSquare] = {
        type: PieceType.Queen,
        color: Color.White
      }

      const moves = yield* getQueenPseudoLegalMoves(
        emptyBoardGameState.board,
        d1QueenSquare,
        emptyBoardGameState.turn
      )

      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(moves).toHaveLength(21)
      expect(movesInAlgebraic).toContainAllValues(['d2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'c1', 'b1', 'a1', 'e1', 'f1', 'g1', 'h1', 'e2', 'f3', 'g4', 'h5', 'c2', 'b3', 'a4'])
    }),
    Effect.runPromise
  )
)