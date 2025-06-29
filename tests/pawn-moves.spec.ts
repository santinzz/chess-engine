import { expect, test } from 'bun:test'
import { Effect, pipe } from 'effect'
import { initializeStartingBoard, type GameState } from '../src/board'
import { createEmpty0x88Board, parseAlgebraicNotation, toAlgebraicNotation } from '../src/utils/board'
import { getPawnPseudoLegalMoves } from '../src/utils/moves/pawn'
import { Color, PieceType } from '../src/types'

test('A2 pawn initial pseudo-legal moves', () => 
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      const sq = yield* parseAlgebraicNotation('a2')

      const moves = yield* getPawnPseudoLegalMoves(
        sq,
        initialGameState,
      )

      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(movesInAlgebraic).toContain('a3')
      expect(movesInAlgebraic).toContain('a4')
      expect(movesInAlgebraic).toStrictEqual(['a3', 'a4'])
    }),
    Effect.runPromise
  )
)

test('A7 pawn initial pseudo-legal moves', () =>
  pipe(
    Effect.gen(function* () {
      const initialGameState = yield* initializeStartingBoard()

      const sq = yield* parseAlgebraicNotation('a7')

      const moves = yield* getPawnPseudoLegalMoves(
        sq,
        {
          ...initialGameState,
          turn: Color.Black
        },
      )

      const movesInAlgebraic = moves.map(move => toAlgebraicNotation(move.to))

      expect(movesInAlgebraic).toContain('a6')
      expect(movesInAlgebraic).toContain('a5')
      expect(movesInAlgebraic).toStrictEqual(['a6', 'a5'])
    }),
    Effect.runPromise
  )
)

test('A5 white pawn en passant to B5 black pawn', () =>
  pipe(
    Effect.gen(function* () {
      const board = createEmpty0x88Board()
      
      const a5PawnSquare = yield* parseAlgebraicNotation('a5')
      const b6EnPassantSquare = yield* parseAlgebraicNotation('b6')
      const b5PawnSquare = yield* parseAlgebraicNotation('b5')
      
      const gameState: GameState = {
        board,
        turn: Color.White,
        enPassantTargetSquare: b6EnPassantSquare,
        halfMoveClock: 0,
        fullMoveNumber: 1,
        castlingRights: {
          whiteKingSide: true,
          whiteQueenSide: true,
          blackKingSide: true,
          blackQueenSide: true,
        },
      }

      board[a5PawnSquare] = {
        type: PieceType.Pawn,
        color: Color.White,
      }

      board[b5PawnSquare] = {
        type: PieceType.Pawn,
        color: Color.Black,
      }

      const moves = yield* getPawnPseudoLegalMoves(
        a5PawnSquare,
        gameState,
      )

      expect(moves).toHaveLength(2)
      expect(moves.map(move => toAlgebraicNotation(move.to))).toStrictEqual(['a6', 'b6']) // En passant capture
    }),
    Effect.runPromise
  )  
)