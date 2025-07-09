import { AlgebraicNotationSchema, createEmpty0x88Board, parseAlgebraicNotation } from './board'
import { Color, PieceType } from '../types'
import type { GameState } from '../board'
import { Effect } from 'effect'

const pieceMap = new Map([
	['p', { type: PieceType.Pawn, color: Color.Black }],
	['n', { type: PieceType.Knight, color: Color.Black }],
	['b', { type: PieceType.Bishop, color: Color.Black }],
	['r', { type: PieceType.Rook, color: Color.Black }],
	['q', { type: PieceType.Queen, color: Color.Black }],
	['k', { type: PieceType.King, color: Color.Black }],
	['P', { type: PieceType.Pawn, color: Color.White }],
	['N', { type: PieceType.Knight, color: Color.White }],
	['B', { type: PieceType.Bishop, color: Color.White }],
	['R', { type: PieceType.Rook, color: Color.White }],
	['Q', { type: PieceType.Queen, color: Color.White }],
	['K', { type: PieceType.King, color: Color.White }],
])

export function fenStringToGameState(fenString: string): GameState {
	const parts = fenString.split(' ')

	if (parts.length !== 6) {
		throw new Error('Invalid FEN string: Must have 6 fields.')
	}

	const [
		piecePlacement,
		activeColor,
		castlingAvailability,
		enPassantTarget,
		halfmoveClockStr,
		fullmoveNumberStr,
	] = parts

	// 1. Parsing Piece Placement (Board State) into 0x88 representation
	const board = createEmpty0x88Board()
	const ranks = piecePlacement.split('/')
	if (ranks.length !== 8) {
		throw new Error('Invalid FEN: Piece placement must have 8 ranks.')
	}

	for (let rIdx = 0; rIdx < 8; rIdx++) {
		const rankStr = ranks[rIdx]
		let fileIndex = 0
		for (let i = 0; i < rankStr.length; i++) {
			const char = rankStr[i]
			const rankIndex = 7 - rIdx // 0-based from a1 rank
			if (char >= '1' && char <= '8') {
				const numEmpty = parseInt(char, 10)
				for (let j = 0; j < numEmpty; j++) {
					const square = rankIndex * 16 + fileIndex
					board[square] = null
					fileIndex++
				}
			} else if ('pPnNbBrRqQkK'.includes(char)) {
				const square = rankIndex * 16 + fileIndex
				const result = pieceMap.get(char)

        if (!result) {
          throw new Error(`Invalid FEN: Unknown piece character '${char}'.`)
        }

				board[square] = result
				fileIndex++
			} else {
				throw new Error(
					`Invalid FEN: Unknown character '${char}' in piece placement.`
				)
			}
		}
		if (fileIndex !== 8) {
			throw new Error(
				`Invalid FEN: Rank ${8 - rIdx} has incorrect number of squares.`
			)
		}
	}

	// 2. Parsing Active Color
	if (activeColor !== 'w' && activeColor !== 'b') {
		throw new Error("Invalid FEN: Active color must be 'w' or 'b'.")
	}

	// 3. Parsing Castling Availability
	const validCastlingChars = new Set(['K', 'Q', 'k', 'q', '-'])
	if (
		![...castlingAvailability].every((char) => validCastlingChars.has(char))
	) {
		throw new Error('Invalid FEN: Invalid castling availability characters.')
	}

	// 4. Parsing En Passant Target Square
	let parsedEnPassantTarget = null
	if (enPassantTarget !== '-') {
		// Basic validation: should be a letter followed by a digit
		if (
			enPassantTarget.length !== 2 ||
			!/[a-h]/.test(enPassantTarget[0]) ||
			!/[1-8]/.test(enPassantTarget[1])
		) {
			throw new Error('Invalid FEN: Invalid en passant target square format.')
		}
		parsedEnPassantTarget = enPassantTarget
	}

	// 5. Parsing Halfmove Clock
	const halfMoveClock = parseInt(halfmoveClockStr, 10) // e.g., "1", "2", or "3"
	if (isNaN(halfMoveClock) || halfMoveClock < 0) {
		throw new Error(
			'Invalid FEN: Halfmove clock must be a non-negative integer.'
		)
	}

	// 6. Parsing Fullmove Number
	const fullmoveNumber = parseInt(fullmoveNumberStr, 10)
	if (isNaN(fullmoveNumber) || fullmoveNumber < 1) {
		throw new Error('Invalid FEN: Fullmove number must be a positive integer.')
	}

  const enPassantTargetSquare = parsedEnPassantTarget ? Effect.runSync(parseAlgebraicNotation(parsedEnPassantTarget as unknown as typeof AlgebraicNotationSchema.Type)) : null

	return {
		board: board, // A 0x88 flat array representing the board
		turn: activeColor === 'w' ? Color.White : Color.Black,
		castlingRights: {
      whiteKingSide: castlingAvailability.includes('K'),
      whiteQueenSide: castlingAvailability.includes('Q'),
      blackKingSide: castlingAvailability.includes('k'),
      blackQueenSide: castlingAvailability.includes('q'),
    }, // e.g., "KQkq", "Kq", "-"
		enPassantTargetSquare, // e.g., "e3", "h6", or null
    halfMoveClock,
    fullMoveNumber: fullmoveNumber,
	}
}
