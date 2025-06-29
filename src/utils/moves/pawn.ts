import { Effect } from 'effect'
import { getPieceAt, MoveError, type Move } from '.'
import { Color, PieceType, Rank, type Piece, type Square0x88 } from '../../types'
import { from0x88, isOnBoard, type Board0x88 } from '../board'
import type { GameState } from '../../board'

const PAWN_OFFSETS = {
	[Color.White]: {
		forward: 16, // +1 Rank
		captureLeft: 15, // +1 Rank, -1 File
		captureRight: 17, // +1 Rank, +1 File
		startingRank: Rank.R2,
		promotionRank: Rank.R8,
	},
	[Color.Black]: {
		forward: -16, // -1 Rank
		captureLeft: -17, // -1 Rank, -1 File
		captureRight: -15, // -1 Rank, +1 File
		startingRank: Rank.R7,
		promotionRank: Rank.R1,
	},
}

const generatePromotionMoves = (fromSq: Square0x88, toSq: Square0x88, pawnPiece: Piece, capturedPiece: Piece | null): Move[] => {
    const promotionMoves: Move[] = [];
    const promotionTypes = [PieceType.Queen, PieceType.Rook, PieceType.Bishop, PieceType.Knight];

    for (const type of promotionTypes) {
        promotionMoves.push({
            from: fromSq,
            to: toSq,
            piece: pawnPiece,
            capturedPiece: capturedPiece,
            promotion: {
              type,
              color: pawnPiece.color,
            },
        });
    }
    return promotionMoves;
}


export const getPawnPseudoLegalMoves = (
	fromSq: Square0x88,
  gameState: GameState
) =>
	Effect.gen(function* () {
		const pieceAtFrom = yield* getPieceAt(gameState.board, fromSq)

		if (pieceAtFrom === null) {
			return yield* Effect.fail(
				new MoveError({
					message: `No piece at source square ${fromSq}`,
					cause: 'EmptySourceSquare',
				})
			)
		}

		if (pieceAtFrom.color !== gameState.turn) {
			return yield* Effect.fail(
				new MoveError({
					message: `Piece at source square ${fromSq} is not of color ${gameState.turn}`,
					cause: 'PieceOfOpponentColor',
				})
			)
		}

		if (pieceAtFrom.type !== PieceType.Pawn) {
			return yield* Effect.fail(
				new MoveError({
					message: `Piece at source square ${fromSq} is not a Pawn`,
					cause: 'InvalidPieceType',
				})
			)
		}

		const pseudoLegalMoves: Move[] = []
    const { rank: currentRank } = from0x88(fromSq)

    const singleForwardSq = fromSq + PAWN_OFFSETS[pieceAtFrom.color].forward
    if (isOnBoard(singleForwardSq) && gameState.board[singleForwardSq] === null) {
      if (from0x88(singleForwardSq).rank === PAWN_OFFSETS[pieceAtFrom.color].promotionRank) {
        pseudoLegalMoves.push(...generatePromotionMoves(fromSq, singleForwardSq, pieceAtFrom, null))
      } else {
        pseudoLegalMoves.push({
          from: fromSq,
          to: singleForwardSq,
          piece: pieceAtFrom,
          capturedPiece: null,
          promotion: null,
        })
      }

      if (currentRank === PAWN_OFFSETS[pieceAtFrom.color].startingRank) {
        const doubleForwardSq = fromSq + (PAWN_OFFSETS[pieceAtFrom.color].forward * 2)
        if (isOnBoard(doubleForwardSq) && gameState.board[doubleForwardSq] === null) {
          pseudoLegalMoves.push({
            from: fromSq,
            to: doubleForwardSq,
            piece: pieceAtFrom,
            capturedPiece: null,
            promotion: null,
            isPawnDoublePush: true,
          })
        }
      } 
    }

    const captureOffsets = [PAWN_OFFSETS[pieceAtFrom.color].captureLeft, PAWN_OFFSETS[pieceAtFrom.color].captureRight]

    for (const offset of captureOffsets) {
      const captureSq = fromSq + offset
      if (isOnBoard(captureSq)) {
        const pieceAtCapture = gameState.board[captureSq]
        if (pieceAtCapture !== null && pieceAtCapture.color !== pieceAtFrom.color) {
          if (from0x88(captureSq).rank === PAWN_OFFSETS[pieceAtFrom.color].promotionRank) {
            pseudoLegalMoves.push(...generatePromotionMoves(fromSq, captureSq, pieceAtFrom, pieceAtCapture))
          } else {
            pseudoLegalMoves.push({
              from: fromSq,
              to: captureSq,
              piece: pieceAtFrom,
              capturedPiece: pieceAtCapture,
              promotion: null,
            })
          }
        }
      }
    }

    if (gameState.enPassantTargetSquare !== null) {
      const { file: pawnFile } = from0x88(fromSq)
      const { file: enPassantFile, rank: enPassantRank } = from0x88(gameState.enPassantTargetSquare)

      let potentialEnPassantCapture: Square0x88 | null = null
      if (pieceAtFrom.color === Color.White && enPassantRank === Rank.R6) {
        if (currentRank === Rank.R5 && enPassantRank === Rank.R6) {
          if (pawnFile + 1 === enPassantFile) potentialEnPassantCapture = fromSq + PAWN_OFFSETS[Color.White].captureRight
          if (pawnFile - 1 === enPassantFile) potentialEnPassantCapture = fromSq + PAWN_OFFSETS[Color.White].captureLeft
        }
      } else {
        if (currentRank === Rank.R4 && enPassantRank === Rank.R3) {
          if (pawnFile + 1 === enPassantFile) potentialEnPassantCapture = fromSq + PAWN_OFFSETS[Color.Black].captureRight
          if (pawnFile - 1 === enPassantFile) potentialEnPassantCapture = fromSq + PAWN_OFFSETS[Color.Black].captureLeft
        }
      }

      if (potentialEnPassantCapture !== null && potentialEnPassantCapture === gameState.enPassantTargetSquare) {
        const capturedPawnSq = gameState.enPassantTargetSquare - PAWN_OFFSETS[pieceAtFrom.color].forward
        const capturedPawn = gameState.board[capturedPawnSq]

        if (capturedPawn && capturedPawn.type === PieceType.Pawn && capturedPawn.color !== pieceAtFrom.color) {
          pseudoLegalMoves.push({
            from: fromSq,
            to: potentialEnPassantCapture,
            piece: pieceAtFrom,
            capturedPiece: capturedPawn,
            promotion: null,
            isEnPassant: true,
          })
        }

      }
    }

    return pseudoLegalMoves
	})
