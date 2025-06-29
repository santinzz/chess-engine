import { Effect } from 'effect'
import { getPieceAt, isSquareAttacked, MoveError, type Move } from '.'
import type { GameState } from '../../board'
import {
	Color,
	EMPTY_SQUARE,
	File,
	PieceType,
	Rank,
	type Square0x88,
} from '../../types'
import { toAlgebraicNotation, isOnBoard, to0x88 } from '../board'

export const getKingPseudoLegalMoves = (
	fromSq: Square0x88,
	board: GameState['board'],
	turn: GameState['turn'],
	castlingRights: GameState['castlingRights']
) =>
	Effect.gen(function* () {
		const pieceAtFrom = yield* getPieceAt(board, fromSq)

		if (pieceAtFrom === null) {
			return yield* Effect.fail(
				new MoveError({
					message: `No piece at source square ${toAlgebraicNotation(fromSq)}`,
					cause: 'EmptySourceSquare',
				})
			)
		}

		if (pieceAtFrom.color !== turn) {
			return yield* Effect.fail(
				new MoveError({
					message: `Piece at source square ${toAlgebraicNotation(
						fromSq
					)} is not of color ${turn}`,
					cause: 'PieceOfOpponentColor',
				})
			)
		}

		if (pieceAtFrom.type !== PieceType.King) {
			return yield* Effect.fail(
				new MoveError({
					message: `Piece at source square ${toAlgebraicNotation(
						fromSq
					)} is not a King`,
					cause: 'InvalidPieceType',
				})
			)
		}

		// King can move one square in any direction
		const directions = [
			-1,
			1,
			-16,
			16,
			-15,
			-17,
			15,
			17, // Left, Right, Up, Down, Up-Left, Up-Right, Down-Left, Down-Right
		]

		const pseudoLegalMoves: Move[] = []

		for (const direction of directions) {
			const toSq = fromSq + direction
			if (isOnBoard(toSq)) {
				const pieceAtTo = board[toSq]
				if (pieceAtTo === null || pieceAtTo.color !== pieceAtFrom.color) {
					pseudoLegalMoves.push({
						from: fromSq,
						to: toSq,
						piece: pieceAtFrom,
						capturedPiece: pieceAtTo || null,
						promotion: null,
					})
				}
			}
		}

		const kingStartSq = to0x88(File.E, Rank.R1)

		if (fromSq === kingStartSq) {
			if (turn === Color.White && castlingRights.whiteKingSide) {
				const rookH1 = to0x88(File.H, Rank.R1)
				const f1 = to0x88(File.F, Rank.R1)
				const g1 = to0x88(File.G, Rank.R1)

				if (board[f1] === EMPTY_SQUARE && board[g1] === EMPTY_SQUARE) {
					if (
						!isSquareAttacked(kingStartSq, Color.Black, board) &&
						!isSquareAttacked(f1, Color.Black, board) &&
						!isSquareAttacked(g1, Color.Black, board)
					) {
						pseudoLegalMoves.push({
							from: fromSq,
							to: g1,
							piece: pieceAtFrom,
							capturedPiece: null,
							promotion: null,
							isCastle: true,
						})
					}
				}
			}

			// White Queen-side Castling (O-O-O)
			if (turn === Color.White && castlingRights.whiteQueenSide) {
				const rookA1 = to0x88(File.A, Rank.R1)
				const b1 = to0x88(File.B, Rank.R1)
				const c1 = to0x88(File.C, Rank.R1)
				const d1 = to0x88(File.D, Rank.R1)

				// Check if squares B1, C1, D1 are empty
				if (
					board[b1] === EMPTY_SQUARE &&
					board[c1] === EMPTY_SQUARE &&
					board[d1] === EMPTY_SQUARE
				) {
					// Check if E1, D1, C1 are not attacked
					if (
						!isSquareAttacked(kingStartSq, Color.Black, board) &&
						!isSquareAttacked(d1, Color.Black, board) &&
						!isSquareAttacked(c1, Color.Black, board)
					) {
						pseudoLegalMoves.push({
							from: kingStartSq,
							to: c1, // King moves to C1
							piece: pieceAtFrom,
							capturedPiece: null,
							promotion: null,
							isCastle: true,
						})
					}
				}
			}

			if (turn === Color.Black && castlingRights.blackKingSide) {
				const rookH8 = to0x88(File.H, Rank.R8)
				const f8 = to0x88(File.F, Rank.R8)
				const g8 = to0x88(File.G, Rank.R8)

				// Check if squares F8 and G8 are empty
				if (board[f8] === EMPTY_SQUARE && board[g8] === EMPTY_SQUARE) {
					// Check if E8, F8, G8 are not attacked
					if (
						!isSquareAttacked(kingStartSq, Color.White, board) &&
						!isSquareAttacked(f8, Color.White, board) &&
						!isSquareAttacked(g8, Color.White, board)
					) {
						pseudoLegalMoves.push({
							from: kingStartSq,
							to: g8, // King moves to G8
							piece: pieceAtFrom,
							capturedPiece: null,
							promotion: null,
							isCastle: true,
						})
					}
				}
			}

			// Black Queen-side Castling (O-O-O)
			if (turn === Color.Black && castlingRights.blackQueenSide) {
				const rookA8 = to0x88(File.A, Rank.R8)
				const b8 = to0x88(File.B, Rank.R8)
				const c8 = to0x88(File.C, Rank.R8)
				const d8 = to0x88(File.D, Rank.R8)

				// Check if squares B8, C8, D8 are empty
				if (
					board[b8] === EMPTY_SQUARE &&
					board[c8] === EMPTY_SQUARE &&
					board[d8] === EMPTY_SQUARE
				) {
					// Check if E8, D8, C8 are not attacked
					if (
						!isSquareAttacked(kingStartSq, Color.White, board) &&
						!isSquareAttacked(d8, Color.White, board) &&
						!isSquareAttacked(c8, Color.White, board)
					) {
						pseudoLegalMoves.push({
							from: kingStartSq,
							to: c8, // King moves to C8
							piece: pieceAtFrom,
							capturedPiece: null,
							promotion: null,
							isCastle: true,
						})
					}
				}
			}
		}

		return pseudoLegalMoves
	})
