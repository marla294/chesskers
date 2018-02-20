import { Injectable }           from '@angular/core';
import { CheckerBoard }	        from './checkerBoard';
import { Space }                from './space';
import { Piece, chessPawn }		from './piece';


@Injectable()
export class ChessService {
	public board: any;

	constructor() {
		this.resetGame();
	}

	// Resets game back to beginning
    resetGame() {
    	this.board = new CheckerBoard().board;
    	// Adding pawns
    	for (let j = 0; j < 8; j++) {
    		this.board[1][j].addPiece(new chessPawn('red', 1, j));
    		this.board[6][j].addPiece(new chessPawn('black', 1, j));
    	}
    }
}