import type { Move } from '.'
import type { GameState } from '../board'
import { Color, EMPTY_SQUARE, PieceType, type Square0x88 } from '../types'
import { to0x88, type Board0x88 } from '../utils/board'
import { File, Rank } from '../types'
import { PAWN_OFFSETS } from './pawn'

export const executeMove = (gameState: GameState, move: Move) => {
	const newBoard = [...gameState.board]
	const newCastlingRights = { ...gameState.castlingRights }

	newBoard[move.to] = move.piece
	newBoard[move.from] = null

	if (move.capturedPiece) {
		if (move.isEnPassant) {
			const capturedPawnSquare = move.to
			newBoard[capturedPawnSquare] = EMPTY_SQUARE
		}
	}

	if (move.promotion && move.piece.type === PieceType.Pawn) {
		newBoard[move.to] = { type: move.promotion.type, color: move.piece.color }
	}

	if (move.isCastle) {
		if (move.piece.type === PieceType.King) {
			const kingColor = move.piece.color
			if (kingColor === Color.White) {
				if (
					move.from === to0x88(File.E, Rank.R1) &&
					move.to === to0x88(File.G, Rank.R1)
				) {
					// White King-side
					newBoard[to0x88(File.F, Rank.R1)] = newBoard[to0x88(File.H, Rank.R1)] // Move Rook
					newBoard[to0x88(File.H, Rank.R1)] = EMPTY_SQUARE
				} else if (
					move.from === to0x88(File.E, Rank.R1) &&
					move.to === to0x88(File.C, Rank.R1)
				) {
					// White Queen-side
					newBoard[to0x88(File.D, Rank.R1)] = newBoard[to0x88(File.A, Rank.R1)] // Move Rook
					newBoard[to0x88(File.A, Rank.R1)] = EMPTY_SQUARE
				}
			} else {
				// Black King
				if (
					move.from === to0x88(File.E, Rank.R8) &&
					move.to === to0x88(File.G, Rank.R8)
				) {
					// Black King-side
					newBoard[to0x88(File.F, Rank.R8)] = newBoard[to0x88(File.H, Rank.R8)] // Move Rook
					newBoard[to0x88(File.H, Rank.R8)] = EMPTY_SQUARE
				} else if (
					move.from === to0x88(File.E, Rank.R8) &&
					move.to === to0x88(File.C, Rank.R8)
				) {
					// Black Queen-side
					newBoard[to0x88(File.D, Rank.R8)] = newBoard[to0x88(File.A, Rank.R8)] // Move Rook
					newBoard[to0x88(File.A, Rank.R8)] = EMPTY_SQUARE
				}
			}
		}
	}

	if (move.piece.type === PieceType.King) {
		if (move.piece.color === Color.White) {
			newCastlingRights.whiteKingSide = false
			newCastlingRights.whiteQueenSide = false
		} else {
			newCastlingRights.blackKingSide = false
			newCastlingRights.blackQueenSide = false
		}
	}

	if (move.piece.type === PieceType.Rook) {
		if (move.piece.color === Color.White) {
			if (move.from === to0x88(File.A, Rank.R1))
				newCastlingRights.whiteQueenSide = false
			if (move.from === to0x88(File.H, Rank.R1))
				newCastlingRights.whiteKingSide = false
		} else {
			if (move.from === to0x88(File.A, Rank.R8))
				newCastlingRights.blackQueenSide = false
			if (move.from === to0x88(File.H, Rank.R8))
				newCastlingRights.blackKingSide = false
		}
	}

	let newEnPassantTargetSquare: Square0x88 | null = null
	if (move.isPawnDoublePush) {
		const pawnColor = move.piece.color
		const pawnOffsets = PAWN_OFFSETS[pawnColor]
		newEnPassantTargetSquare = move.to - pawnOffsets.forward
	}

  let newHalfMoveClock = gameState.halfMoveClock + 1
  if (move.piece.type === PieceType.Pawn || move.capturedPiece !== null) {
    newHalfMoveClock = 0
  }

  let newFullMoveNumber = gameState.fullMoveNumber
  if (gameState.turn === Color.Black) {
    newFullMoveNumber += 1
  }

  const newTurn = gameState.turn === Color.White ? Color.Black : Color.White

  return {
    board: newBoard,
    turn: newTurn,
    castlingRights: newCastlingRights,
    enPassantTargetSquare: newEnPassantTargetSquare,
    halfMoveClock: newHalfMoveClock,
    fullMoveNumber: newFullMoveNumber,
  }
}
