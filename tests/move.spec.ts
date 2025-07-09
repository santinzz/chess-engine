import { test, expect } from 'bun:test'
import { Effect, pipe, Ref } from 'effect'
import { GameState } from '../src/utils/game-state'
import { initializeStartingBoard } from '../src/board'
import { getLegalMoves } from '../src/moves'
import { toAlgebraicNotation } from '../src/utils/board'

test('Initial position legal moves', () => 
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const legalMoves = getLegalMoves(gameState)

      expect(legalMoves.length).toBeGreaterThan(10)
    }),
    Effect.provideServiceEffect(
      GameState,
      Ref.make(initializeStartingBoard())
    ),
    Effect.runPromise
  )
)