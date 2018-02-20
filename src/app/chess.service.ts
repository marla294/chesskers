import { Injectable }           from '@angular/core';
import { CheckerBoard }	        from './checkerBoard';
import { Space }                from './space';


@Injectable()
export class ChessService {
	public board: any;

	constructor() {
		this.resetGame();
	}

	// Resets game back to beginning
    resetGame() {
    	this.board = new CheckerBoard().board;
    }
}