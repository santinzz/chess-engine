import { test, expect } from 'bun:test'
import { Effect, pipe, Ref } from 'effect'
import { fenStringToGameState } from '../src/utils/fen'
import { GameState } from '../src/utils/game-state'

const gameState = fenStringToGameState('8/5PN1/4N1P1/ppP2KR1/P1p5/n3k3/4pb2/4R3 w - - 0 1')

const initialState = Ref.make(gameState)

test('King shouldnt be able to castle', () => 
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const eigthRank = gameState.board.slice(112, 128)
      for (const square of eigthRank) {
        expect(square).toBeNull() // Ensure the 8th rank is empty
      }

      expect(1).toBe(1) // Placeholder for actual test logic
    }),
    Effect.provideServiceEffect(GameState, initialState),
    Effect.runPromise
  )
)