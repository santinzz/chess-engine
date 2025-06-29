import { Effect } from "effect"
import { Color, type Square0x88, PieceType, File, Rank } from "./types"
import { type Board0x88, createEmpty0x88Board, to0x88 } from "./utils/board"

export type GameState = {
	board: Board0x88
	turn: Color
	castlingRights: {
		whiteKingSide: boolean
		whiteQueenSide: boolean
		blackKingSide: boolean
		blackQueenSide: boolean
	}
	enPassantTargetSquare: Square0x88 | null
	halfMoveClock: number
	fullMoveNumber: number
}

/**
 * Initializes the board to the standard starting chess position.
 * @returns A GameState object representing the initial board setup.
 */
export const initializeStartingBoard = (): Effect.Effect<GameState> =>
	Effect.sync(function () {
		const board: Board0x88 = createEmpty0x88Board()

		// Set up pawns
		for (let file = File.A; file <= File.H; file++) {
			board[to0x88(file, Rank.R2)] = {
				type: PieceType.Pawn,
				color: Color.White,
			}
			board[to0x88(file, Rank.R7)] = {
				type: PieceType.Pawn,
				color: Color.Black,
			}
		}

		// Set up White's pieces
		board[to0x88(File.A, Rank.R1)] = {
			type: PieceType.Rook,
			color: Color.White,
		}
		board[to0x88(File.B, Rank.R1)] = {
			type: PieceType.Knight,
			color: Color.White,
		}
		board[to0x88(File.C, Rank.R1)] = {
			type: PieceType.Bishop,
			color: Color.White,
		}
		board[to0x88(File.D, Rank.R1)] = {
			type: PieceType.Queen,
			color: Color.White,
		}
		board[to0x88(File.E, Rank.R1)] = {
			type: PieceType.King,
			color: Color.White,
		}
		board[to0x88(File.F, Rank.R1)] = {
			type: PieceType.Bishop,
			color: Color.White,
		}
		board[to0x88(File.G, Rank.R1)] = {
			type: PieceType.Knight,
			color: Color.White,
		}
		board[to0x88(File.H, Rank.R1)] = {
			type: PieceType.Rook,
			color: Color.White,
		}

		// Set up Black's pieces
		board[to0x88(File.A, Rank.R8)] = {
			type: PieceType.Rook,
			color: Color.Black,
		}
		board[to0x88(File.B, Rank.R8)] = {
			type: PieceType.Knight,
			color: Color.Black,
		}
		board[to0x88(File.C, Rank.R8)] = {
			type: PieceType.Bishop,
			color: Color.Black,
		}
		board[to0x88(File.D, Rank.R8)] = {
			type: PieceType.Queen,
			color: Color.Black,
		}
		board[to0x88(File.E, Rank.R8)] = {
			type: PieceType.King,
			color: Color.Black,
		}
		board[to0x88(File.F, Rank.R8)] = {
			type: PieceType.Bishop,
			color: Color.Black,
		}
		board[to0x88(File.G, Rank.R8)] = {
			type: PieceType.Knight,
			color: Color.Black,
		}
		board[to0x88(File.H, Rank.R8)] = {
			type: PieceType.Rook,
			color: Color.Black,
		}

		return {
			board,
			turn: Color.White,
			castlingRights: {
				whiteKingSide: true,
				whiteQueenSide: true,
				blackKingSide: true,
				blackQueenSide: true,
			},
			enPassantTargetSquare: null,
			halfMoveClock: 0,
			fullMoveNumber: 1,
		}
	})