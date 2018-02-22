import { Injectable }           from '@angular/core';
import { CheckerBoard }	        from './checkerBoard';
import { Space }                from './space';
import { Piece, chessPawn, Rook, Knight, Bishop, chessKing, Queen }		from './pieces/piece';

@Injectable()
export class ChessService {
	public board: any;
	private _selectedPiece: Piece = null;
    private _redTurn: boolean = true;

	constructor() {
		this.resetGame();
	}

	// Resets game back to beginning
    resetGame() {
    	this.board = new CheckerBoard().board;
    	this._redTurn = true;
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
	    	if (this._selectedPiece === null) { // Piece is being selected not taken
		    	this.selectAPiece(p);
	    	} else if (this._selectedPiece !== null && 
	    		p.isRed === !this._selectedPiece.isRed) { // Evaluating if piece can be taken by selected piece
	    		let type = this._selectedPiece.type;
	    		let sp = this.findPiece(p);
	    		this.moveSelected(sp);
	    	} else { // piece is same color as selected piece so select the new piece
	    		this.selectAPiece(p);
	    	}
    }

    // Click on an empty space on the board
    clickEmptySpace(sp: Space) {
    	if (this._selectedPiece !== null && this._selectedPiece.type === 'chessKing') {
    		this.castle(sp);
    	} else if (this._selectedPiece !== null) {
    		this.moveSelected(sp);
    	}
    }

	// Selecting a piece to move
    selectAPiece(p) {
    	if (p.isRed === this._redTurn) {
	    	this.clearSelections();
		    this._selectedPiece = p;
		    this.findPiece(this._selectedPiece).highlight = true;
		}
    }

    /* Function that will move the selected piece to the given space
    If the space contains a piece of the opposite color the piece will be taken,
    otherwise the selected piece will just move to the empty space. */
    moveSelected(sp: Space) {
    	let type = this._selectedPiece.type;
    	let take = false;

    	if (sp.piece !== null && sp.piece.isRed === !this._selectedPiece.isRed) {
    		take = true;
    	}

    	switch (type) {
			case 'chessPawn':
			if (take && (<chessPawn>this._selectedPiece).canTake(sp.row, sp.col) &&
			this.isMoveClear(sp)) {
				this.moveSelectedToTake(sp.piece);
			} else if (!take && (<chessPawn>this._selectedPiece).canMove(sp.row, sp.col) &&
			this.isMoveClear(sp)) {
				this.moveSelectedToEmptySp(sp);
			} else {
				this.selectAPiece(this._selectedPiece);
			}
			break;
			case 'rook':
			if ((<Rook>this._selectedPiece).canMove(sp.row, sp.col) && 
				this.isMoveClear(sp)) {
				take ? this.moveSelectedToTake(sp.piece) : this.moveSelectedToEmptySp(sp);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'knight':
			if ((<Knight>this._selectedPiece).canMove(sp.row, sp.col)) {
				take ? this.moveSelectedToTake(sp.piece) : this.moveSelectedToEmptySp(sp);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'bishop':
			if ((<Bishop>this._selectedPiece).canMove(sp.row, sp.col) &&
				this.isMoveClear(sp)) {
				take ? this.moveSelectedToTake(sp.piece) : this.moveSelectedToEmptySp(sp);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'queen':
			if ((<Queen>this._selectedPiece).canMove(sp.row, sp.col) &&
				this.isMoveClear(sp)) {
				take ? this.moveSelectedToTake(sp.piece) : this.moveSelectedToEmptySp(sp);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'chessKing':
			if ((<chessKing>this._selectedPiece).canMove(sp.row, sp.col)) {
				take ? this.moveSelectedToTake(sp.piece) : this.moveSelectedToEmptySp(sp);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
		}
    }

    // Move the selected piece to take a piece
    moveSelectedToTake(p: Piece) {
    	let sp = this.findPiece(p);
    	sp.clearPiece(); // clear out the taken piece from the space
    	this.moveSelectedToEmptySp(sp); // Move the selected piece to the newly vacated space
    }

    // Move the selected piece to an empty space
    moveSelectedToEmptySp(sp: Space) {
    	this.findPiece(this._selectedPiece).clearPiece();
		sp.addPiece(this._selectedPiece);
		this.initializeSelected();
		this._redTurn = !this._redTurn;
		this.clearSelections();
    }

    // If the selected piece needs to be initialized on the first turn, do that here
    initializeSelected() {
    	let type = this._selectedPiece.type;
    	if (type === 'chessPawn') {
			(<chessPawn>this._selectedPiece).initialized = true;
		}
		if (type === 'chessKing') {
			(<chessKing>this._selectedPiece).initialized = true;
		}
		if (type === 'rook') {
			(<Rook>this._selectedPiece).initialized = true;
		}
    }

    // Special move where the king and rook switch places
    castle(sp: Space) {
    	let isAllowed: boolean = false;
    	let isLeft: boolean = sp.col < this._selectedPiece.col;
    	let spaceMoved: number = Math.abs(this._selectedPiece.col - sp.col);
    	let row: number = this._selectedPiece.isRed ? 0 : 7;
    	let rook: Rook;

    	if (this._selectedPiece.type === "chessKing" && 
    		!(<chessKing>this._selectedPiece).initialized) 
    	{
	    		if (isLeft && 
	    		spaceMoved === 2 &&
				this.board[row][0].piece !== null && 
				this.board[row][0].piece.type === "rook" &&
				!(<Rook>this.board[row][0].piece).initialized) 
				{
					rook = this.board[row][0].piece;
					isAllowed = true;
				} 

				else if (!isLeft && 
				spaceMoved === 2 &&
				this.board[row][7].piece !== null && 
				this.board[row][7].piece.type === "rook" && 
				!(<Rook>this.board[row][7].piece).initialized) 
				{
					rook = this.board[row][7].piece;
					isAllowed = true;
				}    		
    	}

    	if (isAllowed) {
    		console.log("castle");
    	} else {
    		this.moveSelected(sp);
    	}
    }

    /* Is Move Clear functionality
	These functions help determine if the path is clear between the selected piece
	and the space that the piece is moving to */

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
	   	let colDiff = Math.abs(this._selectedPiece.col - sp.col);
    	let rowDiff = Math.abs(this._selectedPiece.row - sp.row);

    	let isClear = true;

    	if (colDiff === 0) {
    		let rowStart = Math.min(this._selectedPiece.row, sp.row);
    		let rowEnd = rowStart + rowDiff;

    		for (let i = rowStart + 1; i < rowEnd; i++) {
				if (this.board[i][this._selectedPiece.col].piece !== null) {
					isClear = false;
				}
			}
    	}

    	if (rowDiff === 0) {
    		let colStart = Math.min(this._selectedPiece.col, sp.col);
    		let colEnd = colStart + colDiff;
    		let colArr = this.board[this._selectedPiece.row].slice(colStart+1, colEnd);

    		colArr.forEach(sp => {if (sp.piece !== null) {isClear = false}});
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
    				isClear = false;
    			}
    		}
    		// Up Left
			if (spRow < pRow && spCol < pCol) {
    			if (this.board[pRow - i][pCol - i].piece !== null) {
    				isClear = false;
    			}
    		}
    		// Down Right
			if (spRow > pRow && spCol > pCol) {
    			if (this.board[pRow + i][pCol + i].piece !== null) {
    				isClear = false;
    			}
    		}
    		// Down Left
			if (spRow > pRow && spCol < pCol) {
    			if (this.board[pRow + i][pCol - i].piece !== null) {
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