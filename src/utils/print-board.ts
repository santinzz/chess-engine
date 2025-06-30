import { Effect, Console, Ref } from 'effect'
import { type Piece, PieceType, Color, Rank, File } from '../types'
import { to0x88, toAlgebraicNotation } from './board'
import { GameState } from './game-state'

export const printBoard = () => Effect.gen(function* () {
	const gameStateRef = yield* GameState
	const gameState = yield* Ref.get(gameStateRef)
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
			row += pieceToChar(gameState.board[sq]) + ' '
		}
		logs.push(row)
	}

	logs.push('  a b c d e f g h')
	logs.push(`Current Player: ${gameState.turn}`)
	logs.push(
		`Castling Rights: W-K: ${gameState.castlingRights.whiteKingSide}, W-Q: ${gameState.castlingRights.whiteQueenSide}, B-K: ${gameState.castlingRights.blackKingSide}, B-Q: ${gameState.castlingRights.blackQueenSide}`
	)
	logs.push(
		`En Passant Target: ${
			gameState.enPassantTargetSquare !== null
				? toAlgebraicNotation(gameState.enPassantTargetSquare)
				: 'None'
		}`
	)
	logs.push(`Half-move Clock: ${gameState.halfMoveClock}`)
	logs.push(`Full-move Number: ${gameState.fullMoveNumber}`)

	return yield* Effect.forEach(logs, Console.log, { discard: true })
})
