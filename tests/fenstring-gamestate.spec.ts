import { test, expect } from 'bun:test'
import { Effect, pipe, Ref } from 'effect'
import { fenStringToGameState } from '../src/utils/fen'
import { parseAlgebraicNotation } from '../src/utils/board'
import { GameState } from '../src/utils/game-state'

const initialState = Ref.make(fenStringToGameState('8/5PN1/4N1P1/ppP2KR1/P1p5/n3k3/4pb2/4R3 w - - 0 1'))

test('FEN string to game state conversion', () =>
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const e1Rook = yield* parseAlgebraicNotation('e1')

      expect(e1Rook).toBeDefined()
    }),
    Effect.provideServiceEffect(GameState, initialState),
    Effect.runPromise
  )
) 