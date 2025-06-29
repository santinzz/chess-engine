import { Effect } from 'effect'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { initializeStartingBoard } from './board'
import { printBoard } from './utils/print-board'

const program = Effect.gen(function* () {
	const initialGameState = yield* initializeStartingBoard()
	console.log('Initial Game State:')

  yield* printBoard(initialGameState)
})

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)))
