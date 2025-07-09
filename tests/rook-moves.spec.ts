import { expect, test } from 'bun:test'
import { Effect, pipe } from 'effect'
import { initializeStartingBoard } from '../src/board'
import { createEmpty0x88BoardGameState, parseAlgebraicNotation, toAlgebraicNotation } from '../src/utils/board'
import { getRookPseudoLegalMoves } from '../src/moves/rook'
import { Color, PieceType, type Piece } from '../src/types'
import { modifyPiecePositionAlgebraic } from '../src/moves/move-piece'

test('Rook initial pseudo-legal moves', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = initializeStartingBoard()
      
      const a1RookSquare = yield* parseAlgebraicNotation('a1')

      const moves = getRookPseudoLegalMoves(
        a1RookSquare,
        initialGameState.board,
        initialGameState.board[a1RookSquare] as Piece // Pass the piece at the from square
      )

      expect(moves).toHaveLength(0)
    }),
    Effect.runPromise
  )
)

test('Rook pseudo-legal moves from a1 empty board', () =>
  pipe(
    Effect.gen(function* () {
      const emptyBoardGameState = createEmpty0x88BoardGameState()

      const a1RookSquare = yield* parseAlgebraicNotation('a1')

      emptyBoardGameState.board[a1RookSquare] = {
        type: PieceType.Rook,
        color: Color.White,
      }

      const moves = getRookPseudoLegalMoves(
        a1RookSquare,
        emptyBoardGameState.board,
        emptyBoardGameState.board[a1RookSquare] as Piece // Pass the piece at the from square
      )

      expect(moves).toHaveLength(14)

      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(movesInAlgebraic).toContainAllValues(['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'])
    }),
    Effect.runPromise
  )
)

test('white Rook pseudo-legal moves from d4 with pieces', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = initializeStartingBoard()

      yield* modifyPiecePositionAlgebraic(initialGameState.board, 'h1', 'd4')

      const d4RookSquare = yield* parseAlgebraicNotation('d4')

      const moves = getRookPseudoLegalMoves(
        d4RookSquare,
        initialGameState.board,
        initialGameState.board[d4RookSquare] as Piece // Pass the piece at the from square
      )
      
      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(movesInAlgebraic).toContainAllValues(['d5', 'd6', 'd7', 'd3', 'c4', 'b4', 'a4', 'e4', 'f4', 'g4', 'h4'])
    }),
    Effect.runPromise
  )
)