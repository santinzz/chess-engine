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

      for (const move of legalMoves) {
        console.log(`Piece: ${move.piece.type}, From: ${toAlgebraicNotation(move.from)}, To: ${toAlgebraicNotation(move.to)}`)
      }
    }),
    Effect.provideServiceEffect(
      GameState,
      Ref.make(initializeStartingBoard())
    ),
    Effect.runPromise
  )
)