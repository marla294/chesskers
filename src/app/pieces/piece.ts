export class Piece {
	type: string = 'piece';
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
		return {row, col};
	}

	getUpLeftMove() {
		let col = this.col - 1;
		let row = this.isRed ? this.row + 1 : this.row - 1;
		return {row, col};
	}

	// Diag moves
	getDiagUpRightMove() {
		let col = this.col + 2;
		let row = this.isRed ? this.row + 2 : this.row - 2;
		return {row, col};
	}

	getDiagUpLeftMove() {
		let col = this.col - 2;
		let row = this.isRed ? this.row + 2 : this.row - 2;
		return {row, col};
	}
}

export class King extends Pawn {
	type: string = "king";
	game: string = "checkers";

	// Nextdoor space moves
	getDownRightMove() {
		let col = this.col + 1;
		let row = this.isRed ? this.row - 1 : this.row + 1;
		return {row, col};
	}

	getDownLeftMove() {
		let col = this.col - 1;
		let row = this.isRed ? this.row - 1 : this.row + 1;
		return {row, col};
	}

	// Diag moves
	getDiagDownRightMove() {
		let col = this.col + 2;
		let row = this.isRed ? this.row - 2 : this.row + 2;
		return {row, col};
	}

	getDiagDownLeftMove() {
		let col = this.col - 2;
		let row = this.isRed ? this.row - 2 : this.row + 2;
		return {row, col};
	}
}

// Chess
export class chessPawn extends Piece {
	type: string = "chessPawn";
	game: string = "chess";
	initialized: boolean = false; // Whether the pawn has moved 1 space or not

	// Given an empty space on the board, determines whether pawn can move to this
	// space or not, according to the rules of chess.  The first move, the pawn
	// is allowed to move 2 spaces forward.  Otherwise, the pawn is only allowed
	// to move forward 1 space.  This function does not take into account if there
	// are pieces in the way.  That will be the job of the chess service to figure 
	// out.
	canMove(row: number, col: number): boolean {
		let canM = false;
		let rowMove = row - this.row;
		if (col === this.col) { // Can only move forward in the same column
			if (this.initialized === false) { // Pawn has not been used
				if (this.isRed === true && rowMove < 3 && rowMove > 0) {
					canM = true;
				}
				if (this.isRed === false && rowMove > -3 && rowMove < 0) {
					canM = true;
				}
			} else { // Pawn has been used
				if (this.isRed === true && rowMove === 1) {
					canM = true;
				}
				if (this.isRed === false && rowMove === -1) {
					canM = true;
				}
			}
		}
		return canM;
	}
}

export class Rook extends Piece {
	type: string = "rook";
	game: string = "chess";

	// Given an empty space on the board, determines whether rook can move to this
	// space or not, according to the rules of chess.  Rooks are allowed to move
	// straight forward or straight back.  This function does not take into account 
	// if there are pieces in the way.  That will be the job of the chess service  
	// to figure out.
	canMove(row: number, col: number): boolean {
		let canM = false;
		if (this.row === row && this.col === col) { // no moving to the same spot
			canM = false;
		} else if (this.row === row) {
			canM = true;
		} else if (this.col === col) {
			canM = true;
		}
		
		return canM;
	}
}

export class Knight extends Piece {
	type: string = "knight";
	game: string = "chess";

	// Given an empty space on the board, determines whether knight can move to this
	// space or not, according to the rules of chess.  Knights are allowed to move
	// 2 spaces forward and 1 space to the side, OR 2 spaces to the side and one space
	// back...  you'll see.  Knights can jump over other pieces.
	canMove(row: number, col: number): boolean {
		let canM = false;
		let rowMove = Math.abs(row - this.row);
		let colMove = Math.abs(col - this.col);
		if (rowMove === 2 && colMove === 1) {
			canM = true;
		} else if (rowMove === 1 && colMove === 2) {
			canM = true;
		}
		
		return canM;
	}
}

export class Bishop extends Piece {
	type: string = "bishop";
	game: string = "chess";

	// Given an empty space on the board, determines whether bishop can move to this
	// space or not, according to the rules of chess.  Bishops are allowed to move
	// on a diagonal forward or back.  This function does not take into account 
	// if there are pieces in the way.  That will be the job of the chess service  
	// to figure out.
	canMove(row: number, col: number): boolean {
		let canM = false;
		let rowMove = Math.abs(row - this.row);
		let colMove = Math.abs(col - this.col);
		if (rowMove === colMove) {
			canM = true;
		}
		
		return canM;
	}
}

export class chessKing extends Piece {
	type: string = "chessKing";
	game: string = "chess";
}

export class Queen extends Piece {
	type: string = "queen";
	game: string = "chess";
}