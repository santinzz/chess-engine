import { Console, Effect, Either, Schema } from 'effect'
import { BunContext, BunRuntime } from '@effect/platform-bun'
import { initializeStartingBoard } from './board'
import { type Piece, PieceType, Color, Rank, File } from './types'
import { AlgebraicNotationSchema, type Board0x88, to0x88, toAlgebraicNotation } from './utils/board'

const program = Effect.gen(function* () {
	const initialGameState = yield* initializeStartingBoard()
	console.log('Initial Game State:')

	const printBoard = (board: Board0x88) => {
		const pieceToChar = (piece: Piece | null): string => {
			if (!piece) return '.'
			const charMap = {
				[PieceType.Pawn]: 'p',
				[PieceType.Knight]: 'n',
				[PieceType.Bishop]: 'b',
				[PieceType.Rook]: 'r',
				[PieceType.Queen]: 'q',
				[PieceType.King]: 'k',
			}
			const base = charMap[piece.type]
			return piece.color === Color.White ? base.toUpperCase() : base
		}

		const logs: string[] = []

		for (let rank = Rank.R8; rank >= Rank.R1; rank--) {
			let row = `${rank + 1} `
			for (let file = File.A; file <= File.H; file++) {
				const sq = to0x88(file, rank)
				row += pieceToChar(board[sq]) + ' '
			}
			logs.push(row)
		}

		logs.push('  a b c d e f g h')
		logs.push(`Current Player: ${initialGameState.turn}`)
		logs.push(
			`Castling Rights: W-K: ${initialGameState.castlingRights.whiteKingSide}, W-Q: ${initialGameState.castlingRights.whiteQueenSide}, B-K: ${initialGameState.castlingRights.blackKingSide}, B-Q: ${initialGameState.castlingRights.blackQueenSide}`
		)
		logs.push(
			`En Passant Target: ${
				initialGameState.enPassantTargetSquare !== null
					? toAlgebraicNotation(initialGameState.enPassantTargetSquare)
					: 'None'
			}`
		)
		logs.push(`Half-move Clock: ${initialGameState.halfMoveClock}`)
		logs.push(`Full-move Number: ${initialGameState.fullMoveNumber}`)

		// Print all lines using Console.log
		return Effect.forEach(logs, Console.log, { discard: true })
	}

  yield* printBoard(initialGameState.board)

  const validSquareEffect = Schema.decodeUnknownEither(AlgebraicNotationSchema)('e8')

  if (Either.isLeft(validSquareEffect)) {
    console.log('Invalid square: ' + validSquareEffect.left)
  } else {
    console.log('Valid square: ' + validSquareEffect.right)
  }

})

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)))
