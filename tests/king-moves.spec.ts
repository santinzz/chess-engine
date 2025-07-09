import { test, expect } from 'bun:test'
import { Effect, pipe, Ref } from 'effect'
import { fenStringToGameState } from '../src/utils/fen'
import { GameState } from '../src/utils/game-state'
import { parseAlgebraicNotation, to0x88, toAlgebraicNotation } from '../src/utils/board'
import { getKingPseudoLegalMoves } from '../src/moves/king'
import { Color, File, Rank } from '../src/types'

const gameState = fenStringToGameState('8/5PN1/4N1P1/ppP2KR1/P1p5/n3k3/4pb2/4R3 w - - 0 1')

const initialState = Ref.make(gameState)

test('Black King should be able to move to d2, d3, and f3', () => 
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const eigthRank = gameState.board.slice(112, 128)
      for (const square of eigthRank) {
        expect(square).toBeNull() // Ensure the 8th rank is empty
      }

      // e3 in 0x88 is 0xE3
      const kingSquare = to0x88(File.E, Rank.R3)

      const newGameState = { ...gameState, turn: Color.Black }

      const kingMoves = getKingPseudoLegalMoves(kingSquare, newGameState)

      expect(kingMoves).toHaveLength(3)
      expect(kingMoves.map(move => toAlgebraicNotation(move.to))).toContainAllValues(['d3', 'd2', 'f3'])
    }),
    Effect.provideServiceEffect(GameState, initialState),
    Effect.runPromise
  )
)

test('White king should only be able to move to g4, e5 and f6', () =>
  pipe(
    Effect.gen(function* () {
      const gameStateRef = yield* GameState
      const gameState = yield* Ref.get(gameStateRef)

      const f5KingSquare = yield* parseAlgebraicNotation('f5')

      const kingMoves = getKingPseudoLegalMoves(f5KingSquare, gameState)
      console.log(kingMoves.map(move => toAlgebraicNotation(move.to)))

      expect(kingMoves).toHaveLength(3)
      expect(kingMoves.map(move => toAlgebraicNotation(move.to))).toContainAllValues(['g4', 'e5', 'f6'])
    }),
    Effect.provideServiceEffect(GameState, initialState),
    Effect.runPromise
  )
)