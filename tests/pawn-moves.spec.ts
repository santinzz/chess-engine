import { expect, test } from 'bun:test'
import { Effect, pipe } from 'effect'
import { initializeStartingBoard, type GameState } from '../src/board'
import { createEmpty0x88Board, parseAlgebraicNotation, toAlgebraicNotation } from '../src/utils/board'
import { getPawnPseudoLegalMoves } from '../src/moves/pawn'
import { Color, PieceType, type Piece } from '../src/types'

test('A2 pawn initial pseudo-legal moves', () => 
  pipe(
    Effect.gen(function* () {
      const initialGameState = initializeStartingBoard()

      const sq = yield* parseAlgebraicNotation('a2')

      const moves = getPawnPseudoLegalMoves(
        sq,
        initialGameState,
        initialGameState.board[sq] as Piece // Pass the piece at the from square
      )

      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(movesInAlgebraic).toContain('a3')
      expect(movesInAlgebraic).toContain('a4')
      expect(movesInAlgebraic).toStrictEqual(['a3', 'a4'])
    }),
    Effect.runPromise
  )
)

test('A7 pawn initial pseudo-legal moves', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = initializeStartingBoard()

      const sq = yield* parseAlgebraicNotation('a7')

      const moves = getPawnPseudoLegalMoves(
        sq,
        {
          ...initialGameState,
          turn: Color.Black
        },
        initialGameState.board[sq] as Piece // Pass the piece at the from square
      )

      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(movesInAlgebraic).toContain('a6')
      expect(movesInAlgebraic).toContain('a5')
      expect(movesInAlgebraic).toStrictEqual(['a6', 'a5'])
    }),
    Effect.runPromise
  )
)
