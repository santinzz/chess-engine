import { GameResult, isGameOver } from '../utils/game-over'
import { getLegalMoves, type Move } from '../moves'
import type { GameState } from '../board'
import { evaluate, PIECE_VALUES } from './evaluation'
import { executeMove } from '../moves/move'
import { isKingInCheck } from '../utils/is-king-in-check'
import { toAlgebraicNotation, type Board0x88 } from '../utils/board'
import { printBoardWithoutStore } from '../utils/print-board'
import { PieceType } from '../types'

const CHECKMATE_SCORE = 1_000_000

let nodesVisited = 0

export const minimax = (
	gameState: GameState,
	depth: number,
	alpha: number,
	beta: number
) => {
  nodesVisited++
  console.log(`Nodes visited: ${nodesVisited}`)
	const gameResult = isGameOver(gameState)

	if (gameResult !== GameResult.NotOver) {
		if (gameResult === GameResult.Checkmate) {
			return -(CHECKMATE_SCORE - depth)
		} else {
			return 0
		}
	}

	if (depth === 0) {
		return evaluate(gameState)
	}

	const legalMoves = getLegalMoves(gameState)

	const scoredMoves = legalMoves.map((move) => ({
		move: move,
		score: 0,
	}))

	const getMoveOrderScore = (move: Move, board: Board0x88): number => {
		if (move.capturedPiece) {
			return PIECE_VALUES[move.capturedPiece.type]
		}
		// Add other heuristics here (e.g., checks, promotions)
		// Example: Prioritize queen promotions heavily
		if (move.promotion) {
			if (move.promotion.type === PieceType.Queen) return 9000 // Very high
		}
		// A small negative score for quiet moves to ensure captures are prioritized
		return 0 // Default for non-captures
	}

	for (const scoredMove of scoredMoves) {
		scoredMove.score = getMoveOrderScore(scoredMove.move, gameState.board)
	}

	// 3. Sort the moves in descending order of their score
	scoredMoves.sort((a, b) => b.score - a.score)

	if (legalMoves.length === 0) {
		const currentKingColor = gameState.turn

		if (isKingInCheck(gameState, currentKingColor)) {
			return -Infinity
		} else {
			return 0
		}
	}

	let value = -Infinity

	for (const scoredMove of scoredMoves) {
		const newGameState = executeMove(gameState, scoredMove.move)

		const evaluation = -minimax(newGameState, depth - 1, -beta, -alpha)
		value = Math.max(value, evaluation)

		alpha = Math.max(alpha, value)

		if (alpha >= beta) {
			break // Beta cut-off
		}
	}

	return value
}

export const findBestMove = (
	gameState: GameState,
	depth: number
): Move | null => {
	let bestMove: Move | null = null
	let bestEval = -Infinity

	const legalMoves = getLegalMoves(gameState)

	if (legalMoves.length === 0) {
		return null
	}

	let alpha = -Infinity
	const beta = Infinity

	for (const move of legalMoves) {
		const newGameState = executeMove(gameState, move)

		const evaluation = -minimax(newGameState, depth - 1, -beta, -alpha)
		console.log(
			`Evaluating ${move.piece.type} move ${toAlgebraicNotation(
				move.from
			)} to ${toAlgebraicNotation(move.to)}: ${evaluation}`
		)

		if (evaluation > bestEval) {
			bestEval = evaluation
			bestMove = move
		}

		alpha = Math.max(alpha, evaluation)
	}

	return bestMove
}
