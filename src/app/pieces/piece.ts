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

export class chessPiece extends Piece {
	type: string = "chessPawn";
	game: string = "chess";
	isWhite: boolean = true;

	constructor(color: string, r: number, c: number) {
		super(color, r, c);

		this.isWhite = color === "black" ? false : true;
	}

	/*
	For all canMove functions - given a row and column on the board, determine if a chessPiece can move to this space, given the rules of chess.
	*/
	canMove(row: number, col: number): boolean {
		return false;
	}
}

export class chessPawn extends chessPiece {
	type: string = "chessPawn";
	game: string = "chess";
	initialized: boolean = false; // Whether the pawn has moved 1 space or not

	/*
	Pawn Movement:
	- On first move, can move 1 or 2 spaces forward in same column
	- On subsequent moves, can move only 1 space forward on the same column
	*/
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);

		if (col === this.col) {
			if (!this.initialized) {
				return rowMove <= 2 && rowMove > 0 ? true : false;
			} else {
				return rowMove === 1 ? true : false;
			}
		}
	}

	/*
	Pawn Movement:
	- Pawn can capture 1 square diagonally right or left in front
	*/
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

	/*
	Rook Movement:
	- Rook can move and capture on same row or column
	*/
	canMove(row: number, col: number): boolean {
		return this.row === row || this.col === col;
	}
}

export class Knight extends chessPiece {
	type: string = "knight";
	game: string = "chess";

	/*
	Knight Movement:
	- Knights can jump
	- Knights can move 2 squares on a row or column and 1 square on a row or column
	*/
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

	/*
	Bishop Movement:
	- Bishops can move diagonally anywhere on the board
	*/
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

	/*
	King Movement:
	- Kings can move in any direction 1 square
	*/
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);
		const colMove = Math.abs(col - this.col);

		return rowMove <= 1 && colMove <= 1;
	}
}

export class Queen extends chessPiece {
	type: string = "queen";
	game: string = "chess";

	/*
	Queen Movement:
	- Queens can move in any direction
	*/
	canMove(row: number, col: number): boolean {
		const rowMove = Math.abs(row - this.row);
		const colMove = Math.abs(col - this.col);

		// diagonal
		if (rowMove === colMove) {
			return true;
		}

		// straight
		if (this.row === row || this.col === col) {
			return true;
		}

		return false;
	}
}
