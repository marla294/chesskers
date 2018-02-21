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
    		let type = this._selectedPiece.type;

    		switch (type) {
    			case 'chessPawn':
    			if ((<chessPawn>this._selectedPiece).canMove(sp.row, sp.col) &&
    				this.isMoveClear(sp)) {
    				(<chessPawn>this._selectedPiece).initialized = true; // Initialize chesspawn if it moves once
    				this.moveSelectedToEmptySp(sp);
    			}
    			break;
    			case 'rook':
    			if ((<Rook>this._selectedPiece).canMove(sp.row, sp.col) && 
    				this.isMoveClear(sp)) {
    				this.moveSelectedToEmptySp(sp);
    			}
    			break;
    			case 'knight':
    			if ((<Knight>this._selectedPiece).canMove(sp.row, sp.col)) {
    				this.moveSelectedToEmptySp(sp);
    			}
    			break;
    			case 'bishop':
    			if ((<Bishop>this._selectedPiece).canMove(sp.row, sp.col) &&
    				this.isMoveClear(sp)) {
    				this.moveSelectedToEmptySp(sp);
    			}
    			break;
    			case 'queen':
    			if ((<Queen>this._selectedPiece).canMove(sp.row, sp.col) &&
    				this.isMoveClear(sp)) {
    				this.moveSelectedToEmptySp(sp);
    			}
    			break;
    			case 'chessKing':
    			if ((<chessKing>this._selectedPiece).canMove(sp.row, sp.col)) {
    				this.moveSelectedToEmptySp(sp);
    			}
    			break;
    		}

    	}
    }

    // Move the selected piece to an empty space
    moveSelectedToEmptySp(sp: Space) {
    	this.findPiece(this._selectedPiece).clearPiece();
		sp.addPiece(this._selectedPiece);
		this.clearSelections();
    }

    // Determines whether to use the straight or diag function to check
    isMoveClear(sp: Space) {
    	let spRow = sp.row;
    	let spCol = sp.col;
    	let pRow = this._selectedPiece.row;
    	let pCol = this._selectedPiece.col;
    	let isClear = true;

    	if (spRow === pRow || spCol === pCol) {
    		isClear = this.isMoveClearStraight(sp);
    	} else {
    		isClear = this.isMoveClearDiag(sp);
    	}

    	return isClear;
    }

    // Determines if the selected space has a piece between the selected piece
    // and the space on a straight line
    isMoveClearStraight(sp: Space): boolean {
    	let spRow = sp.row;
    	let spCol = sp.col;
    	let pRow = this._selectedPiece.row;
    	let pCol = this._selectedPiece.col;
    	let isClear = true;

    	if (spCol === pCol) {
    		// Up
    		if (spRow < pRow) {
    			for (let i = spRow + 1; i < pRow; i++) {
    				if (this.board[i][pCol].piece !== null) {
    					isClear = false;
    				}
    			}
    		} 
    		// Down
    		if (spRow > pRow) {
    			for (let i = spRow - 1; i > pRow; i--) {
    				if (this.board[i][pCol].piece !== null) {
    					isClear = false;
    				}
    			}
    		}
    	}
    	if (spRow === pRow) {
    		// Left
    		if (spCol < pCol) {
    			for (let i = spCol + 1; i < pCol; i++) {
    				if (this.board[pRow][i].piece !== null) {
    					isClear = false;
    				}
    			}
    		}
    		// Right
    		if (spCol > pCol) {
    			for (let i = spCol - 1; i > pCol; i--) {
    				if (this.board[pRow][i].piece !== null) {
    					isClear = false;
    				}
    			}
    		}
    	}

    	return isClear;
    }

    // Determines if the selected space has a piece between the selected piece
    // and the space on a diagonal line
    isMoveClearDiag(sp: Space): boolean {
		let spRow = sp.row;
    	let spCol = sp.col;
    	let pRow = this._selectedPiece.row;
    	let pCol = this._selectedPiece.col;
    	let diagLen = Math.abs(spRow - pRow);
    	let isClear = true;

    	for (let i = 1; i < diagLen; i++) {
			// Up Right
			if (spRow < pRow && spCol > pCol) {
    			if (this.board[pRow - i][pCol + i].piece !== null) {
    				console.log("up right");
    				isClear = false;
    			}
    		}
    		// Up Left
			if (spRow < pRow && spCol < pCol) {
    			if (this.board[pRow - i][pCol - i].piece !== null) {
    				console.log("up left");
    				isClear = false;
    			}
    		}
    		// Down Right
			if (spRow > pRow && spCol > pCol) {
    			if (this.board[pRow + i][pCol + i].piece !== null) {
    				console.log("down right");
    				isClear = false;
    			}
    		}
    		// Down Left
			if (spRow > pRow && spCol < pCol) {
    			if (this.board[pRow + i][pCol - i].piece !== null) {
    				console.log("down left");
    				isClear = false;
    			}
    		}
    	}

    	return isClear;
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