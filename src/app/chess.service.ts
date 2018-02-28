import { Injectable }           from '@angular/core';
import { ChessBoard }	        from './checkerBoard';
import { chessSpace }           from './space';
import { chessPiece, chessPawn, Rook, Knight, Bishop, chessKing, Queen } from './pieces/piece';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';

@Injectable()
export class ChessService {
	public board: any;
	private _selectedPiece: chessPiece = null;
    private _whiteTurn: boolean = true;

    // Behavior Subjects
    private _whiteTurnBeh: BehaviorSubject<boolean>;
    private _resetGame: BehaviorSubject<boolean>;

	constructor() {
        this._whiteTurnBeh = <BehaviorSubject<boolean>>new BehaviorSubject(true);
        this._resetGame = <BehaviorSubject<boolean>>new BehaviorSubject(true);
		this.resetGame();
	}

	// Resets game back to beginning
    resetGame() {
    	this.board = new ChessBoard().board;
    	this._whiteTurn = true;
        this.loadResetGame(false);
    	// Adding pawns
    	for (let j = 0; j < 8; j++) {
    		this.board[1][j].addPiece(new chessPawn('white', 1, j));
    		this.board[6][j].addPiece(new chessPawn('black', 1, j));
    	}
    	// Adding rooks
    	this.board[0][0].addPiece(new Rook('white', 0, 0));
    	this.board[0][7].addPiece(new Rook('white', 0, 7));
    	this.board[7][0].addPiece(new Rook('black', 7, 0));
    	this.board[7][7].addPiece(new Rook('black', 7, 7));
    	// Adding knights
    	this.board[0][1].addPiece(new Knight('white', 0, 1));
    	this.board[0][6].addPiece(new Knight('white', 0, 6));
    	this.board[7][1].addPiece(new Knight('black', 7, 1));
    	this.board[7][6].addPiece(new Knight('black', 7, 6));
    	// Adding bishops
    	this.board[0][2].addPiece(new Bishop('white', 0, 2));
    	this.board[0][5].addPiece(new Bishop('white', 0, 5));
    	this.board[7][2].addPiece(new Bishop('black', 7, 2));
    	this.board[7][5].addPiece(new Bishop('black', 7, 5));
    	// Adding kings
    	this.board[0][3].addPiece(new chessKing('white', 0, 3));
    	this.board[7][3].addPiece(new chessKing('black', 7, 3));
    	// Adding queens
    	this.board[0][4].addPiece(new Queen('white', 0, 4));
    	this.board[7][4].addPiece(new Queen('black', 7, 4));

        this._whiteTurnBeh.subscribe(turn => {
            this.highlightKingSpace(this.check()); // highlight king space if it is in check
            if (this.check()) {
                this.isWinner(); // check if there is a winner
            }
        });
    }

    // Observables and Behavioral Subjects

    loadWhiteTurn(turn: boolean) {
        this._whiteTurnBeh.next(turn);
    }

    loadResetGame(reset: boolean) {
        this._resetGame.next(reset);
    }

    get whiteTurnObs() {
        return this._whiteTurnBeh.asObservable();
    }

    // For Game Console
    get resetGameBeh() {
        return this._resetGame; 
    }

    // For Game Board
    get resetGameObs() {
        return this._resetGame.asObservable();
    }

    // Click events for pieces and spaces

    // Click on a piece on the board
    clickAPiece(p: chessPiece) {
    	if (this._selectedPiece === null) { // Piece is being selected not taken
	    	this.selectAPiece(p);
    	} else if (this._selectedPiece !== null && 
    		p.isWhite === !this._selectedPiece.isWhite) { // Evaluating if piece can be taken by selected piece
    		let type = this._selectedPiece.type;
    		let sp = this.findPiece(p);
    		this.moveSelected(sp, false);
    	} else { // piece is same color as selected piece so select the new piece
    		this.selectAPiece(p);
    	}
    }

    // Click on an empty space on the board
    clickEmptySpace(sp: chessSpace) {
    	if (this._selectedPiece !== null && this._selectedPiece.type === 'chessKing') {
    		this.castle(sp);
    	} else if (this._selectedPiece !== null) {
    		this.moveSelected(sp, false);
    	}
    }

	// Selecting a piece to move
    selectAPiece(p: chessPiece) {
    	if (p.isWhite === this._whiteTurn) {
	    	this.clearSelections();
		    this._selectedPiece = p;
		    this.findPiece(this._selectedPiece).highlight = true;
		}
    }

    /* Function that will determine whether the king can escape check.  Runs every time the king is in check.*/
    isWinner() {
        // Is there a winner?
        let winner = false;

        // Get the King of the current team
        let kingSp: chessSpace = this.findKingSpace();
        let king: chessPiece = kingSp.piece;

        // Get all the spaces around the King that the king could try to move to
        let kingRun = Array();
        let startRow = (kingSp.row - 1) >= 0 ? kingSp.row - 1 : 0;
        let endRow =  (kingSp.row + 1) <= 7 ? kingSp.row + 1 : 7;
        let startCol = (kingSp.col - 1) >= 0 ? kingSp.col - 1 : 0;
        let endCol =  (kingSp.col + 1) <= 7 ? kingSp.col + 1 : 7;
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (this.board[r][c].piece === null) {
                    kingRun.push(this.board[r][c]);
                }
            }
        }

        // Now, for each of the empty spaces, try moving the king there and see if it is still in check
        let oldSelected: chessPiece = this._selectedPiece;
        this._selectedPiece = king;
        let canMove: boolean = false;
        kingRun.forEach(space => {
            if (!this.moveSelectedToEmptySp(space, true)) {
                canMove = true; // If there's a space the king can move to where he will not be in check, set canMove to true
            }
        });
        console.log(canMove);
        this._selectedPiece = oldSelected;
        
    }

    /* For a given piece, test if moving it to the given space will leave the king in check */
    testMove(p: chessPiece, sp: chessSpace) {
        let oldSpace: chessSpace = this.findPiece(p);
        let oldSelected: chessPiece = this._selectedPiece;

    }

    /* Check function will see if the king of the team of the current turn is in check.  If it is, the current team will only be able to move pieces that get the king out of check. */
    check(): boolean {
        // Get other team pieces
        let pieceArray = new Array();
        this.board.forEach(row => {
            row.forEach(space => {
                if (space.piece !== null && space.piece.isWhite === !this._whiteTurn) {
                    pieceArray.push(space.piece);
                }
            })
        });

        // Get the King of the current team
        let king: chessSpace = this.findKingSpace();

        // Check if the pieces from the other team could take the king
        let check: boolean = false;
        pieceArray.forEach(piece => {
            if (this.canTakeKing(piece, king)) {
                check = true;
            }
        });

        return check;
    }

    /* Highlights the King space of the current team */
    highlightKingSpace(check: boolean) {
        this.board.forEach(row => row.forEach(space => space.check = false)); // First remove highlight from all old squares
        let king: chessSpace = this.findKingSpace()
        king.check = check;
    }

    /* Find the king space for the current team's turn */
    findKingSpace(): chessSpace {
        let king: chessSpace = null
        this.board.forEach(row => {
            row.forEach(space => {
                if (space.piece !== null && 
                    space.piece.isWhite === this._whiteTurn && 
                    space.piece.type === 'chessKing') {
                        king = space;
                }
            })
        });
        return king;
    }

    /* For a piece on the board, check if it can take the king (to see if the king is in check). 
    Returns True if the king can be taken, false if not.  sp = king space */
    canTakeKing(p: chessPiece, sp: chessSpace): boolean {
        let selectedOld = this._selectedPiece; // saving old selected piece to put back after done
        this._selectedPiece = p;
        let type = this._selectedPiece.type;
        let take = false;

        switch (type) {
            case 'chessPawn':
            if ((<chessPawn>this._selectedPiece).canTake(sp.row, sp.col)) {
                take = true;
            }
            break;

            case 'rook':
            if ((<Rook>this._selectedPiece).canMove(sp.row, sp.col) && this.isMoveClear(sp)) {
                take = true;
            }
            break;

            case 'knight':
            if ((<Knight>this._selectedPiece).canMove(sp.row, sp.col)) {
                take = true;
            }
            break;

            case 'bishop':
            if ((<Bishop>this._selectedPiece).canMove(sp.row, sp.col) && this.isMoveClear(sp)) {
                take = true;
            }
            break;

            case 'queen':
            if ((<Queen>this._selectedPiece).canMove(sp.row, sp.col) && this.isMoveClear(sp)) {
                take = true;
            }
            break;

            case 'chessKing':
            if ((<chessKing>this._selectedPiece).canMove(sp.row, sp.col)) {
                take = true;
            }
            break;

        }

        this._selectedPiece = selectedOld;
        return take;
    }

    /* Function that will move the selected piece to the given space
    If the space contains a piece of the opposite color the piece will be taken,
    otherwise the selected piece will just move to the empty space. */
    moveSelected(sp: chessSpace, test: boolean) {
    	let type = this._selectedPiece.type;
    	let take = false;

    	if (sp.piece !== null && sp.piece.isWhite === !this._selectedPiece.isWhite) {
    		take = true;
    	}

    	switch (type) {
			case 'chessPawn':
			if (take && (<chessPawn>this._selectedPiece).canTake(sp.row, sp.col) &&
			this.isMoveClear(sp)) {
				this.moveSelectedToTake(sp.piece, test);
			} else if (!take && (<chessPawn>this._selectedPiece).canMove(sp.row, sp.col) &&
			this.isMoveClear(sp)) {
				this.moveSelectedToEmptySp(sp, test);
			} else {
				this.selectAPiece(this._selectedPiece);
			}
			break;
			case 'rook':
			if ((<Rook>this._selectedPiece).canMove(sp.row, sp.col) && 
				this.isMoveClear(sp)) {
				take ? this.moveSelectedToTake(sp.piece, test) : this.moveSelectedToEmptySp(sp, test);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'knight':
			if ((<Knight>this._selectedPiece).canMove(sp.row, sp.col)) {
				take ? this.moveSelectedToTake(sp.piece, test) : this.moveSelectedToEmptySp(sp, test);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'bishop':
			if ((<Bishop>this._selectedPiece).canMove(sp.row, sp.col) &&
				this.isMoveClear(sp)) {
				take ? this.moveSelectedToTake(sp.piece, test) : this.moveSelectedToEmptySp(sp, test);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'queen':
			if ((<Queen>this._selectedPiece).canMove(sp.row, sp.col) &&
				this.isMoveClear(sp)) {
				take ? this.moveSelectedToTake(sp.piece, test) : this.moveSelectedToEmptySp(sp, test);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
			case 'chessKing':
			if ((<chessKing>this._selectedPiece).canMove(sp.row, sp.col)) {
				take ? this.moveSelectedToTake(sp.piece, test) : this.moveSelectedToEmptySp(sp, test);
			} else {
	    		this.selectAPiece(this._selectedPiece);
	    	}
			break;
		}
    }

    // Move the selected piece to take a piece
    moveSelectedToTake(p: chessPiece, test: boolean) {
        let sp = this.findPiece(p);

        sp.clearPiece(); // clear out the taken piece from the space

    	if (this.moveSelectedToEmptySp(sp, test)) { // If the king was in check from the move, put the old piece back in the empty space
            sp.addPiece(p);
            this.highlightKingSpace(true);
        }
    }

    /* Move the selected piece to an empty space.  If the king was in check while moving, return true for moveSelectedToTake.*/
    moveSelectedToEmptySp(sp: chessSpace, test: boolean): boolean {
        let space_old = this.findPiece(this._selectedPiece); // storing piece old space
        let check = false;

        space_old.clearPiece();
        sp.addPiece(this._selectedPiece);

        if (!test) { // not a test so do everything as normal
            if (!this.check()) { // after the move the king is not in check
                this.highlightKingSpace(false);
                this.initializeSelected();
                this._whiteTurn = !this._whiteTurn;
                this.loadWhiteTurn(this._whiteTurn);
                this.clearSelections();
            } else { // after the move the king was in check so revert
                sp.clearPiece();
                space_old.addPiece(this._selectedPiece);
                check = true;
            }
        } else { // this is a test so in both cases move old piece back
            if (!this.check()) {
                sp.clearPiece();
                space_old.addPiece(this._selectedPiece);
            } else { // king was in check after move so return true
                sp.clearPiece();
                space_old.addPiece(this._selectedPiece);
                check = true;
            }
        }

        return check;
 
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
    // See https://en.wikipedia.org/wiki/Castling?oldformat=true
    castle(sp: chessSpace) {
    	let isAllowed: boolean = false;
    	let isLeft: boolean = sp.col < this._selectedPiece.col;
    	let spaceMoved: number = Math.abs(this._selectedPiece.col - sp.col);
    	let row: number = this._selectedPiece.isRed ? 0 : 7;
    	let rookCol: number = isLeft ? 0 : 7;
    	let rookSp: chessSpace = this.board[row][rookCol];
    	let rook: Rook;

    	if (this._selectedPiece.type === "chessKing" && 
    		!(<chessKing>this._selectedPiece).initialized) 
    	{
    		if (spaceMoved === 2 &&
			rookSp.piece !== null && 
			rookSp.piece.type === "rook" &&
			!(<Rook>rookSp.piece).initialized ) {
				rook = <Rook>rookSp.piece;
				isAllowed = true;
			}  		
    	}

    	if (isAllowed) {
    		if (isLeft) {
    			rookSp.clearPiece();
    			this.board[row][2].addPiece(rook);
    			this.moveSelectedToEmptySp(sp, false);
    		} else {
    			rookSp.clearPiece();
    			this.board[row][4].addPiece(rook);
    			this.moveSelectedToEmptySp(sp, false);
    		}
    	} else {
    		this.moveSelected(sp, false);
    	}
    }

    /* Is Move Clear functionality
	These functions help determine if the path is clear between the selected piece
	and the space that the piece is moving to */

    // Determines whether to use the straight or diag function to check
    isMoveClear(sp: chessSpace) {
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
    isMoveClearStraight(sp: chessSpace): boolean {
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
    isMoveClearDiag(sp: chessSpace): boolean {
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
    findPiece(p: chessPiece): chessSpace {
        let sp: chessSpace = null;

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