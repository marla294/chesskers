export class Piece {
	type: string = "piece";
	game: string = null;
	isRed: boolean = true; // Red == white in chess, for now
	jump: boolean = false; // Says whether the piece was jumped or not
	row: number = null;
	col: number = null;

	constructor(color: string, r: number, c: number) {
		if (color === "black") {
			this.isRed = false;
		} else if (color === "red") {
			this.isRed = true;
		}
		this.row = r;
		this.col = c;
	}

	// Generic move piece function
	movePiece(r: number, c: number) {
		this.row = r;
		this.col = c;
	}
}

// Checkers
export class Pawn extends Piece {
	type: string = "pawn";
	game: string = "checkers";

	// Nextdoor space moves
	getUpRightMove() {
		let col = this.col + 1;
		let row = this.isRed ? this.row + 1 : this.row - 1;
		return { row, col };
	}

	getUpLeftMove() {
		let col = this.col - 1;
		let row = this.isRed ? this.row + 1 : this.row - 1;
		return { row, col };
	}

	// Diag moves
	getDiagUpRightMove() {
		let col = this.col + 2;
		let row = this.isRed ? this.row + 2 : this.row - 2;
		return { row, col };
	}

	getDiagUpLeftMove() {
		let col = this.col - 2;
		let row = this.isRed ? this.row + 2 : this.row - 2;
		return { row, col };
	}
}

export class King extends Pawn {
	type: string = "king";
	game: string = "checkers";

	// Nextdoor space moves
	getDownRightMove() {
		let col = this.col + 1;
		let row = this.isRed ? this.row - 1 : this.row + 1;
		return { row, col };
	}

	getDownLeftMove() {
		let col = this.col - 1;
		let row = this.isRed ? this.row - 1 : this.row + 1;
		return { row, col };
	}

	// Diag moves
	getDiagDownRightMove() {
		let col = this.col + 2;
		let row = this.isRed ? this.row - 2 : this.row + 2;
		return { row, col };
	}

	getDiagDownLeftMove() {
		let col = this.col - 2;
		let row = this.isRed ? this.row - 2 : this.row + 2;
		return { row, col };
	}
}

// Chess

/*
This will be the master class that all other chess pieces will build off of.  'isRed' will eventually be removed from the main Piece class and put on a 'checkerPiece' class instead.
*/
export class chessPiece extends Piece {
	type: string = "chessPawn";
	game: string = "chess";
	isWhite: boolean = true;

	constructor(color: string, r: number, c: number) {
		super(color, r, c);
		if (color === "black") {
			this.isWhite = false;
		} else if (color === "red") {
			this.isWhite = true;
		} else if (color === "white") {
			this.isWhite = true;
		}
	}

	canMove(row: number, col: number): boolean {
		return false;
	}
}

export class chessPawn extends chessPiece {
	type: string = "chessPawn";
	game: string = "chess";
	initialized: boolean = false; // Whether the pawn has moved 1 space or not

	// Given an empty space on the board, determines whether pawn can move to this
	// space or not, according to the rules of chess.  On the first move, the pawn
	// is allowed to move 2 spaces forward.  Otherwise, the pawn is only allowed
	// to move forward 1 space.  This function does not take into account if there
	// are pieces in the way.  That will be the job of the chess service to figure
	// out.
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);

		// Can only move forward in the same column
		if (col === this.col) {
			if (!this.initialized) {
				return rowMove <= 2 && rowMove > 0 ? true : false;
			} else {
				return rowMove === 1 ? true : false;
			}
		}
	}

	// A pawn can take pieces directly to the left or right of him
	canTake(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);
		const colMove = Math.abs(col - this.col);

		return rowMove === 1 && colMove === 1 ? true : false;
	}
}

export class Rook extends chessPiece {
	type: string = "rook";
	game: string = "chess";
	initialized: boolean = false; // for castling

	// Given an empty space on the board, determines whether rook can move to this
	// space or not, according to the rules of chess.  Rooks are allowed to move
	// straight forward or straight back.  This function does not take into account
	// if there are pieces in the way.  That will be the job of the chess service
	// to figure out.
	canMove(row: number, col: number): boolean {
		return this.row === row || this.col === col;
	}
}

export class Knight extends chessPiece {
	type: string = "knight";
	game: string = "chess";

	// Given an empty space on the board, determines whether knight can move to this
	// space or not, according to the rules of chess.  Knights are allowed to move
	// 2 spaces forward and 1 space to the side, OR 2 spaces to the side and one space
	// back...  you'll see.  Knights can jump over other pieces.
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);
		const colMove = Math.abs(col - this.col);

		if (rowMove === 2 && colMove === 1) {
			return true;
		}

		if (rowMove === 1 && colMove === 2) {
			return true;
		}

		return false;
	}
}

export class Bishop extends chessPiece {
	type: string = "bishop";
	game: string = "chess";

	// Given an empty space on the board, determines whether bishop can move to this
	// space or not, according to the rules of chess.  Bishops are allowed to move
	// on a diagonal forward or back.  This function does not take into account
	// if there are pieces in the way.  That will be the job of the chess service
	// to figure out.
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);
		const colMove = Math.abs(col - this.col);

		return rowMove === colMove;
	}
}

export class chessKing extends chessPiece {
	type: string = "chessKing";
	game: string = "chess";
	initialized: boolean = false; // for castling

	// Given an empty space on the board, determines whether king can move to this
	// space or not, according to the rules of chess.  Kings are allowed to move
	// on a diagonal forward or back, OR on a straight line forward or back, but
	// only one space at a time.  This function does not take into account if there
	// are pieces in the way.  That will be the job of the chess service to figure
	// out.
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);
		const colMove = Math.abs(col - this.col);

		return rowMove <= 1 && colMove <= 1;
	}
}

export class Queen extends chessPiece {
	type: string = "queen";
	game: string = "chess";

	// Given an empty space on the board, determines whether queen can move to this
	// space or not, according to the rules of chess.  Queens are allowed to move
	// on a diagonal forward or back, OR on a straight line forward or back.  This
	// function does not take into account if there are pieces in the way.  That
	// will be the job of the chess service to figure out.
	canMove(row: number, col: number): boolean {
		let canM = false;
		let rowMove = Math.abs(row - this.row);
		let colMove = Math.abs(col - this.col);
		if (rowMove === colMove) {
			// diagonal
			canM = true;
		} else if (this.row === row) {
			// straight
			canM = true;
		} else if (this.col === col) {
			// straight
			canM = true;
		}

		return canM;
	}
}
