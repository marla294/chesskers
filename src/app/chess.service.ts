import { Injectable }           from '@angular/core';
import { CheckerBoard }	        from './checkerBoard';
import { Space }                from './space';
import { Piece, chessPawn, Rook, Knight, Bishop, chessKing, Queen }		from './pieces/piece';


@Injectable()
export class ChessService {
	public board: any;
	private _selectedPiece: Piece = null;

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
    	// Adding rooks
    	this.board[0][0].addPiece(new Rook('red', 0, 0));
    	this.board[0][7].addPiece(new Rook('red', 0, 7));
    	this.board[7][0].addPiece(new Rook('black', 7, 0));
    	this.board[7][7].addPiece(new Rook('black', 7, 7));
    	// Adding knights
    	this.board[0][1].addPiece(new Knight('red', 0, 1));
    	this.board[0][6].addPiece(new Knight('red', 0, 6));
    	this.board[7][1].addPiece(new Knight('black', 7, 1));
    	this.board[7][6].addPiece(new Knight('black', 7, 6));
    	// Adding bishops
    	this.board[0][2].addPiece(new Bishop('red', 0, 2));
    	this.board[0][5].addPiece(new Bishop('red', 0, 5));
    	this.board[7][2].addPiece(new Bishop('black', 7, 2));
    	this.board[7][5].addPiece(new Bishop('black', 7, 5));
    	// Adding kings
    	this.board[0][3].addPiece(new chessKing('red', 0, 3));
    	this.board[7][3].addPiece(new chessKing('black', 7, 3));
    	// Adding queens
    	this.board[0][4].addPiece(new Queen('red', 0, 4));
    	this.board[7][4].addPiece(new Queen('black', 7, 4));
    }

    // Click events for pieces and spaces

    // Click on a piece on the board
    clickAPiece(p: Piece) {
    	this.clearSelections();
    	this._selectedPiece = p;
    	this.findPiece(this._selectedPiece).highlight = true;
    }

    // Click on an empty space on the board
    clickEmptySpace(sp: Space) {
    	if (this._selectedPiece !== null) { // Clicking on an empty space
    		console.log((<chessPawn>this._selectedPiece).canMove(sp.row, sp.col));
    		this.findPiece(this._selectedPiece).clearPiece();
    		sp.addPiece(this._selectedPiece);
    		this.clearSelections();
    	}
    }

    // Finds a piece on the board and returns the space it is on
    findPiece(p: Piece): Space {
        let sp: Space = null;

        // Look through the board and see if the piece is on a space
        this.board.forEach(row => row.forEach(space => {
            if (space.piece === p) {
                sp = space;
            }
        }));

        return sp;
    }


    // Clears all highlights, direction flags, and selected pieces from board
    clearSelections() {
        this.board.forEach(row => row.forEach(space => {
            space.highlight = space.moveTo = space.jump = false;
            if (space.piece !== null) {
                space.piece.jump = false;
            }
        }));
        this._selectedPiece = null;
    }
}