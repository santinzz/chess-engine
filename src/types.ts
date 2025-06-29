/**
 * Represents the two colors in chess.
 */
export enum Color {
	White = 'White',
	Black = 'Black',
}

/**
 * Represents the different types of chess pieces.
 */
export enum PieceType {
	Pawn = 'Pawn',
	Knight = 'Knight',
	Bishop = 'Bishop',
	Rook = 'Rook',
	Queen = 'Queen',
	King = 'King',
}

/**
 * Represents a piece on the board, combining its type and color.
 */
export type Piece = {
	type: PieceType
	color: Color
}

// Represents an empty square on the board.
export const EMPTY_SQUARE = null

/**
 * Type alias for a square index on the 0x88 board.
 * Values typically range from 0 to 127.
 */
export type Square0x88 = number

/**
 * Represents a file (column) on the chessboard.
 */
export enum File {
	A = 0,
	B = 1,
	C = 2,
	D = 3,
	E = 4,
	F = 5,
	G = 6,
	H = 7,
}

/**
 * Represents a rank (row) on the chessboard.
 */
export enum Rank {
	R1 = 0,
	R2 = 1,
	R3 = 2,
	R4 = 3,
	R5 = 4,
	R6 = 5,
	R7 = 6,
	R8 = 7,
}