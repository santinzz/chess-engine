import { Context, Duration, Effect, Ref, Schedule } from 'effect'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { initializeStartingBoard, type GameState } from './board'
import { printBoard } from './utils/print-board'
import { executeMove } from './utils/moves/move'
import { parseAlgebraicNotation } from './utils/board'
import type { Move } from './utils/moves'
import { PieceType } from './types'

class GameStateRef {
	update: (state: GameState) => Effect.Effect<void>
	get: Effect.Effect<GameState>

	constructor(private readonly gameState: Ref.Ref<GameState>) {
		this.update = (state: GameState) => Ref.update(this.gameState, () => state)
		this.get = Ref.get(this.gameState)
		
	}
}

const make = Effect.gen(function* () {
	const gameState = yield* initializeStartingBoard()

	return yield* Effect.andThen(
		Ref.make(gameState),
		(value) => new GameStateRef(value)
	)
})

const program = Effect.gen(function* () {
	const gameStateRef = yield* make
	const gameState = yield* gameStateRef.get
	yield* printBoard(gameState)
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
	yield* gameStateRef.update(newGameState)

	yield* printBoard(yield* gameStateRef.get)
})

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)))
