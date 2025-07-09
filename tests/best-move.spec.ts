import { test, expect } from 'bun:test'
import { Effect, pipe, Ref } from 'effect'
import { fenStringToGameState } from '../src/utils/fen'
import { GameState } from '../src/utils/game-state'
import { printBoard } from '../src/utils/print-board'
import { findBestMove } from '../src/engine/minimax'
import { parseAlgebraicNotation, toAlgebraicNotation } from '../src/utils/board'
import { getQueenPseudoLegalMoves } from '../src/moves/queen'
import { PieceType } from '../src/types'

const initialState = Ref.make(fenStringToGameState('3k4/Q7/3K4/8/8/8/8/8 w - - 0 1'))

test('findBestMove', () => 
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)


      const bestMove = findBestMove(gameState, 1)

      if (!bestMove) {
        return
      }
    }),
    Effect.provideServiceEffect(
      GameState,
      initialState
    ),
    Effect.runPromise
  )
)

test('finding complex mate in 2 moves', () => 
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const bestMove = findBestMove(gameState, 3)

      if (!bestMove) {
        return
      }

      expect(bestMove.piece.type).toBe(PieceType.Rook)
      expect(toAlgebraicNotation(bestMove.from)).toBe('a1')
      expect(toAlgebraicNotation(bestMove.to)).toBe('a6')
    }),
    Effect.provideServiceEffect(
      GameState,
      Ref.make(fenStringToGameState('kbK5/pp6/1P6/8/8/8/8/R7 w - - 0 1'))
    ),
    Effect.runPromise
  )
)