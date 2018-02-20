import { Injectable }           from '@angular/core';
import { CheckerBoard }	        from './checkerBoard';
import { Space }                from './space';
import { Piece, chessPawn, Rook, Knight, Bishop, chessKing, Queen }		from './pieces/piece';


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
}