type MoveErrorCause =
    | 'EmptySourceSquare'
		| 'InvalidDestinationSquare'
		| 'InvalidSourceSquare'
		| 'InvalidPieceType'
		| 'PieceOfOpponentColor'

export class MoveError extends Error {
  constructor(public details: { message: string; cause: MoveErrorCause }) {
    super(details.message);
  }
}