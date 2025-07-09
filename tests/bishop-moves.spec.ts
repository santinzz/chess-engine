import { pipe, Effect } from 'effect'
import { test, expect } from 'bun:test'
import { initializeStartingBoard } from '../src/board'
import { Rank, File, type Piece } from '../src/types'
import { to0x88 } from '../src/utils/board'
import { getBishopPseudoLegalMoves } from '../src/moves/bishop'
import { modifyPiecePositionAlgebraic } from '../src/moves/move-piece'

test('Bishop initial pseudo-legal moves', () => {
	const initialGameState = initializeStartingBoard()

	const moves = getBishopPseudoLegalMoves(
		initialGameState.board,
		to0x88(File.F, Rank.R1),
		initialGameState.turn,
		initialGameState.board[to0x88(File.F, Rank.R1)] as Piece // Pass the piece at the from square
	)

	expect(moves).toHaveLength(0)
})

test('Bishop pseudo-legal moves from h3', () =>
	pipe(
		Effect.gen(function* () {
			const initialGameState = initializeStartingBoard()

			yield* modifyPiecePositionAlgebraic(initialGameState.board, 'f1', 'h3')

			const moves = getBishopPseudoLegalMoves(
				initialGameState.board,
				to0x88(File.H, Rank.R3),
				initialGameState.turn,
				initialGameState.board[to0x88(File.H, Rank.R3)] as Piece // Pass the piece at the from square
			)

			expect(moves).toHaveLength(4)
		}),
		Effect.runPromise
	))
