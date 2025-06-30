import { Context, Duration, Effect, Ref, Schedule } from 'effect'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { initializeStartingBoard } from './board'
import { printBoard } from './utils/print-board'
import { executeMove } from './utils/moves/move'
import { parseAlgebraicNotation } from './utils/board'
import type { Move } from './utils/moves'
import { PieceType } from './types'
import { GameState } from './utils/game-state'

const initialGameState = Ref.make(initializeStartingBoard())

const moveD2PawnToD4 = () =>
	Effect.gen(function* () {
		const gameStateRef = yield* GameState
		const gameState = yield* Ref.get(gameStateRef)
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
			isPawnDoublePush: true,
		}

		const newGameState = executeMove(gameState, move)

		return yield* Ref.set(gameStateRef, newGameState)
	})

const program = Effect.gen(function* () {
	yield* printBoard()
	yield* moveD2PawnToD4()
	yield* printBoard()

}).pipe(Effect.provideServiceEffect(GameState, initialGameState))

BunRuntime.runMain(
	program.pipe(
		Effect.provide(BunContext.layer),
	)
)
