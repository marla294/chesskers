import { Piece }	from './piece';

export class Space {
	playable: boolean;
	piece: Piece = null;
	highlight: boolean = false;
	moveTo: boolean = false; // Says whether a piece can move here or not
	jump: boolean = false; // Says whether a piece was jumped when moving here
	row: number;
	col: number;

	constructor(play: boolean, r: number, c: number) {
		this.playable = play;
		this.row = r;
		this.col = c;
	}

	// Add piece to space
	addPiece(p: Piece) {
		if (this.piece == null) {
			this.piece = p;
			this.piece.movePiece(this.row, this.col);
		}
	}

	// Clear piece out of space by setting to null
	clearPiece() {
		if (this.piece != null) {
			this.piece = null;
		}
    }
}