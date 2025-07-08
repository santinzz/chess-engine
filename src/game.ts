import { Effect, Ref } from 'effect'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { initializeStartingBoard } from './board'
import { printBoard } from './utils/print-board'
import { executeMove } from './moves/move'
import { parseAlgebraicNotation } from './utils/board'
import type { Move } from './moves'
import { PieceType } from './types'
import { GameState } from './utils/game-state'

const initialState = Ref.make(initializeStartingBoard())

const program = Effect.gen(function* () {
  const gameStateRef = yield* GameState
  const gameState = yield* Ref.get(gameStateRef)
	yield* printBoard()
	const d2Pawn = yield* parseAlgebraicNotation('d2')
	const d2PawnMoveD4 = yield* parseAlgebraicNotation('d4')
	const move: Move = {
		from: d2Pawn,
		to: d2PawnMoveD4,
		piece: {
			type: PieceType.Pawn,
			color: gameState.turn,
		},
		capturedPiece: null,
		promotion: null,
	}

	const newGameState = executeMove(gameState, move)
	yield* Ref.set(gameStateRef, newGameState)

	yield* printBoard()
})

BunRuntime.runMain(program.pipe(
  Effect.provideServiceEffect(GameState, initialState),
  Effect.provide(BunContext.layer),
))
