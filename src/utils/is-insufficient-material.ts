import type { GameState } from '../board'
import { getLegalMoves, type Move } from '../moves'
import { Color, PieceType, type Piece } from '../types'
import { isOnBoard, type Board0x88 } from './board'

export const isInsufficientMaterial = (board: Board0x88) => {
	let whitePieces: Piece[] = []
	let blackPieces: Piece[] = []

	for (let i = 0; i < 128; i++) {
		if (!isOnBoard(i)) continue
		const piece = board[i]

		if (piece && piece.type !== PieceType.King) {
			if (piece.color === Color.White) {
				whitePieces.push(piece)
			} else {
				blackPieces.push(piece)
			}
		}
	}

	if (whitePieces.length === 0 && blackPieces.length === 0) {
		return true // Both sides have no pieces
	}

	if (
		whitePieces.length === 1 &&
		whitePieces[0].type === PieceType.Knight &&
		blackPieces.length === 0
	) {
		return true
	}
	if (
		blackPieces.length === 1 &&
		blackPieces[0].type === PieceType.Knight &&
		whitePieces.length === 0
	) {
		return true
	}

	if (
		whitePieces.length === 1 &&
		whitePieces[0].type === PieceType.Bishop &&
		blackPieces.length === 0
	) {
		return true
	}
	if (
		blackPieces.length === 1 &&
		blackPieces[0].type === PieceType.Bishop &&
		whitePieces.length === 0
	) {
		return true
	}

	const getSquareColor = (sq0x88: number): 'light' | 'dark' => {
		const file = sq0x88 & 0x7
		const rank = sq0x88 >> 4
		return (rank + file) % 2 === 0 ? 'dark' : 'light' // Assuming a1 is dark, b1 is light etc. Adjust if your convention is different.
	}

	if (
		whitePieces.length === 1 &&
		whitePieces[0].type === PieceType.Bishop &&
		blackPieces.length === 1 &&
		blackPieces[0].type === PieceType.Bishop
	) {
		// Find the actual square of the bishops
		let whiteBishopSquare: number | null = null
		let blackBishopSquare: number | null = null

		for (let i = 0; i < 128; i++) {
			if (!isOnBoard(i)) continue
			const piece = board[i]
			if (piece && piece.type === PieceType.Bishop) {
				if (piece.color === Color.White) {
					whiteBishopSquare = i
				} else {
					blackBishopSquare = i
				}
			}
		}

		// If both bishops are found and are on the same color square
		if (
			whiteBishopSquare !== null &&
			blackBishopSquare !== null &&
			getSquareColor(whiteBishopSquare) === getSquareColor(blackBishopSquare)
		) {
			return true // Draw due to bishops on same color squares
		}
	}

	// Case 5: King and any number of Knights vs King (not insufficient, e.g., KNN vs K can checkmate)
	// Case 6: King and any number of Bishops vs King (not insufficient if on different colors)
	// Case 7: King and multiple Knights/Bishops against King and multiple Knights/Bishops can be draws,
	// but detecting them perfectly is very complex without tablebases.
	// We are only checking the simple cases where checkmate is impossible.

	return false // In all other cases, assume sufficient material (e.g., any pawn, rook, queen)
}
