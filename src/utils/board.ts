import { Schema, Effect, ParseResult } from 'effect'
import { type Piece, EMPTY_SQUARE, type Square0x88, Rank, File, Color } from '../types'

/**
 * The 0x88 board is a 128-element array.
 * The lower 6 bits (0-7 for files, 0-7 for ranks) represent actual board squares.
 * The 7th bit (0x80) is used to indicate off-board squares, making boundary checks fast.
 * If (square & 0x88) is non-zero, the square is off-board.
 */
export type Board0x88 = (Piece | null)[]

/**
 * Creates an empty 0x88 board initialized with nulls.
 * All 128 squares are set to null.
 * @returns An empty 0x88 board.
 */
export function createEmpty0x88Board(): Board0x88 {
	// A 0x88 board has 128 "squares" in its array.
	return Array(128).fill(EMPTY_SQUARE)
}

/**
 * Utility function to check if a 0x88 square index is on the actual 8x8 board.
 * A square is on board if its (square & 0x88) is 0.
 * This is the primary advantage of the 0x88 representation.
 * @param sq The 0x88 square index.
 * @returns True if the square is on the 8x8 board, false otherwise.
 */
export function isOnBoard(sq: Square0x88): boolean {
	return (sq & 0x88) === 0
}

/**
 * Converts a (file, rank) pair to its corresponding 0x88 square index.
 * @param file The file (0-7).
 * @param rank The rank (0-7).
 * @returns The 0x88 square index.
 */
export function to0x88(file: File, rank: Rank): Square0x88 {
	return (rank << 4) | file // (rank * 16) + file
}

/**
 * Converts a 0x88 square index back to its (file, rank) pair.
 * @param sq The 0x88 square index.
 * @returns An object containing the file and rank.
 */
export function from0x88(sq: Square0x88): { file: File; rank: Rank } {
	const file = sq & 0xf // Get the lower 4 bits (file)
	const rank = sq >> 4 // Get the higher 4 bits (rank)
	return { file: file as File, rank: rank as Rank }
}

const BASE0 = [0, 1, 2, 3, 4, 5, 6, 7] as const
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const

const FileSchema = Schema.transform(
	Schema.Literal(...FILES),
	Schema.Literal(...BASE0),
	{
		decode: (fileChar) => {
			return FILES.indexOf(fileChar) as (typeof BASE0)[number]
		},
		encode: (fileNum) => {
			return FILES[fileNum] as (typeof FILES)[number]
		},
	}
)

const RankSchema = Schema.transformOrFail(
	Schema.Literal(...RANKS),
	Schema.Literal(...BASE0),
	{
		decode: (input, _options, ast) =>
			ParseResult.try({
				try: () => {
					const rankNum = input - 1

					if (rankNum < 0 || rankNum > 7) {
						throw new Error(`Invalid rank: ${input}`)
					}
					return rankNum as (typeof BASE0)[number]
				},
				catch: (e) =>
					new ParseResult.Type(
						ast,
						input,
						e instanceof Error ? e.message : 'Failed to parse rank'
					),
			}),
		encode: (input, _options, ast) =>
			ParseResult.try({
				try: () => {
					const rank = input + 1

					if (rank < 1 || rank > 8) {
						throw new Error(`Invalid rank: ${input}`)
					}
					return rank as (typeof RANKS)[number]
				},
				catch: (e) =>
					new ParseResult.Type(
						ast,
						input,
						e instanceof Error ? e.message : 'Failed to encode rank'
					),
			}),
	}
)

export const AlgebraicNotationSchema = Schema.TemplateLiteral(
	Schema.Literal(...FILES),
	Schema.Literal(...RANKS)
)

export type AlgebraicNotation = typeof AlgebraicNotationSchema.Type

export const parseAlgebraicNotation = (algebraicNotation: typeof AlgebraicNotationSchema.Type) =>
	Effect.gen(function* () {
		const validated = yield* Schema.decodeUnknown(AlgebraicNotationSchema)(
			algebraicNotation
		)

		const [file, rank] = yield* Effect.all([
			Schema.decodeUnknown(FileSchema)(validated[0]),
			Schema.decodeUnknown(RankSchema)(parseInt(validated[1], 10)),
		])

		return to0x88(file, rank)
	})

export const toAlgebraicNotation = (sq: Square0x88) => {
	const { file, rank } = from0x88(sq)

	const fileChar = String.fromCharCode('a'.charCodeAt(0) + file)
	const rankChar = (rank + 1).toString()
	return `${fileChar}${rankChar}`
}

export const createEmpty0x88BoardGameState = () => ({
	board: createEmpty0x88Board(),
	turn: Color.White,
	enPassantTargetSquare: null,
	halfMoveClock: 0,
	fullMoveNumber: 1,
	castlingRights: {
		whiteKingSide: true,
		whiteQueenSide: true,
		blackKingSide: true,
		blackQueenSide: true,
	},
})

export const to64index = (sq: Square0x88): number => {
	const { file, rank } = from0x88(sq)
	return rank * 8 + file // Convert to 64-square index
}

