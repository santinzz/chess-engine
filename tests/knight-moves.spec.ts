import { Effect, pipe } from 'effect'
import { test, expect } from 'bun:test'
import { getKnightPseudoLegalMoves } from '../src/moves/knight'
import { initializeStartingBoard } from '../src/board'
import {
	parseAlgebraicNotation,
	to0x88,
	toAlgebraicNotation,
} from '../src/utils/board'
import { File, Rank, type Piece } from '../src/types'
import { modifyPiecePositionAlgebraic } from '../src/moves/move-piece'

test('Knight initial pseudo-legal moves', () => {
	const initialGameState = initializeStartingBoard()

	const moves = getKnightPseudoLegalMoves(
		initialGameState.board,
		to0x88(File.G, Rank.R1),
		initialGameState.turn,
		initialGameState.board[to0x88(File.G, Rank.R1)] as Piece // Pass the piece at the from square
	)

	expect(moves).toHaveLength(2)
	expect(toAlgebraicNotation(moves[0].to)).toBe('f3')
	expect(toAlgebraicNotation(moves[1].to)).toBe('h3')
})

test('Knight pseudo-legal moves from d4', () =>
	pipe(
		Effect.gen(function* () {
			const initialGameState = initializeStartingBoard()

			yield* modifyPiecePositionAlgebraic(initialGameState.board, 'g1', 'd4')

			const moves = getKnightPseudoLegalMoves(
				initialGameState.board,
				to0x88(File.D, Rank.R4),
				initialGameState.turn,
				initialGameState.board[to0x88(File.D, Rank.R4)] as Piece //
			)

			expect(moves).toHaveLength(6)
      
			const expectedMoves = yield* Effect.forEach(
				['f5', 'e6', 'c6', 'b5', 'b3', 'f3'] as const,
				(sq) => parseAlgebraicNotation(sq)
			)

			for (const move of moves) {
				expect(expectedMoves).toContain(move.to)
			}
		}),
		Effect.runPromise
	))
