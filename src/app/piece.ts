export class Piece {
	type: string = 'piece';
	isRed: boolean = true;
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

export class Pawn extends Piece {
	type: string = "pawn";

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
