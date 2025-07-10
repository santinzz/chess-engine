import { test, expect } from 'bun:test'
import { Effect, pipe, Ref } from 'effect'
import { fenStringToGameState } from '../src/utils/fen'
import { GameState } from '../src/utils/game-state'
import { findBestMove } from '../src/engine/minimax'
import { toAlgebraicNotation } from '../src/utils/board'

const initialState = Ref.make(fenStringToGameState('8/k2r4/p7/2b1Bp2/P3p3/qp4R1/4QP2/1K6 b - - 0 1'))

test('Mate in four', () => 
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const bestMove = findBestMove(gameState, 5)

      if (!bestMove) {
        return
      }

      console.log(`Best move: ${bestMove.piece.type} from ${toAlgebraicNotation(bestMove.from)} to ${toAlgebraicNotation(bestMove.to)}`)

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