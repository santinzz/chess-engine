import { test, expect } from 'bun:test'
import { Effect, pipe } from 'effect'
import { initializeStartingBoard } from '../src/board'

test('King can castle', () => 
  pipe(
    Effect.gen(function* () {
      const initialGameState = initializeStartingBoard()
    }),
    Effect.runPromise
  )
)