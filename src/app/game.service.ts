import { Injectable }           from '@angular/core';
import { Piece, Pawn, King }	from './piece';
import { Space }                from './space';
import { CheckerBoard }	        from './checkerBoard';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';

@Injectable()
export class GameService {
  	public board: any;
    private _selectedPiece: Piece = null;
    private _redTurn: boolean = true;
    private _doubleJump: boolean = false;

    // Behavior Subjects
    private _redTurnBeh: BehaviorSubject<boolean>;
    private _resetGame: BehaviorSubject<boolean>;
    private _isWinner: BehaviorSubject<string>;

  	constructor() {
          this._redTurnBeh = <BehaviorSubject<boolean>>new BehaviorSubject(true);
          this._resetGame = <BehaviorSubject<boolean>>new BehaviorSubject(true);
          this._isWinner = <BehaviorSubject<string>>new BehaviorSubject("none");
  		  this.resetGame();
  	}

    // Resets game back to beginning
    resetGame() {
        this.board = new CheckerBoard().board;
        this._redTurn = true;
        this.loadResetGame(false);
        this.loadIsWinner("none");

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j].playable === true) {
                  this.board[i][j].addPiece(new Pawn('red', i, j));
                }
            }
        }
        for (let i = 5; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j].playable === true) {
                    this.board[i][j].addPiece(new Pawn('black', i, j));
                }
            }
        }
    }

    // Observable stuff

    // Loading the behavior subjects (which turn into observables)

    loadRedTurn(turn: boolean) {
        this._redTurnBeh.next(turn);
    }

    loadResetGame(reset: boolean) {
        this._resetGame.next(reset);
    }

    loadIsWinner(winner: string) {
        this._isWinner.next(winner);
    }

    // Getting the observables or behavior subjects for other components

    get redTurnObs() {
        return this._redTurnBeh.asObservable();
    }

    // For Game Console
    get resetGameBeh() {
        return this._resetGame; 
    }

    // For Game Board
    get resetGameObs() {
        return this._resetGame.asObservable();
    }

    // For Game Board
    get isWinnerObs() {
        return this._isWinner.asObservable();
    }

    // Determining if someone won the game
    isWinner(turn: boolean) {
        let redTeam: Piece[] = [];
        let blackTeam: Piece[] = [];
        let winner: boolean = true;
        
        // Collecting the pieces on the board into arrays
        this.board.forEach(row => {
            row.forEach(space => {
                if (space.piece !== null) {
                    if (space.piece.isRed) {
                        redTeam.push(space.piece);
                    } else {
                        blackTeam.push(space.piece);
                    }
                }
            });
        });

        // Check each team to see if someone won
        if (turn) { // red turn
            redTeam.forEach(piece => {
                if (this.canMove(piece)) { // if any piece can move then no winner
                    winner = false;
                }
            });
        } else { // black turn
            blackTeam.forEach(piece => {
                if (this.canMove(piece)) { // if any piece can move then no winner
                    winner = false;
                }
            });
        }

        if (winner) {
            let win = "none";
            if (turn) {
                win = "Black";
            } else {
                win = "Red";
            }
            this.loadIsWinner(win);
        }
    }

    // Click events for pieces and spaces

    // Click on a piece on the board
    clickAPiece(p: Piece) {
        if (this._doubleJump) {
            if (this._selectedPiece === p) {
                this.clearSelections();
                this._selectedPiece = p;
                this.findPiece(p).highlight = true;
                this.selectMoveableSpaces(p);
            }
        } else if (this._redTurn === p.isRed) {
            this.clearSelections();
            this._selectedPiece = p;
            this.findPiece(p).highlight = true;
            this.selectMoveableSpaces(p);
        }
    }

    // Click on an empty space on the board
    clickEmptySpace(sp: Space) {
        if (this._selectedPiece !== null && sp.moveTo) { // If the space is empty and piece can move to it
            this.findPiece(this._selectedPiece).clearPiece(); // First remove piece from old space
            sp.addPiece(this._selectedPiece); // Then add piece to the new space
            if (sp.jump === true) { // A piece was jumped
                this.clearJumpedPiece(sp);
            }
            if (this.isEndSpace(sp)) { // Selected piece became king
                this.makeKing(this._selectedPiece);
            }
            if (sp.jump === false || !this.checkForJump(sp)) { // if I didn't just jump or there is no jump
                this._redTurn = !this._redTurn;
                this.loadRedTurn(this._redTurn);
                this._doubleJump = false;
                this.clearSelections();
                this.isWinner(this._redTurn);
            } else { // double jump opportunity
                this._doubleJump = true;
                this.clickAPiece(this._selectedPiece);
            }
        }
    }

    // Finding the 4 potential move spaces for a piece.  If a piece can't move in a direction, returns null
    findMoveableSpaces(p: Piece) {
        // Calculating the 4 potential move spaces of the piece
        let upRight = null;
        let downRight = null;
        let upLeft = null;
        let downLeft = null;

        // If it's not the piece's second turn, get all move spaces, else only get the jump spaces
        if (!this._doubleJump) {
            upRight = this.getDiagMoveSpace(p, this.calcAllDiag(p).upRightDiag.sp, this.calcAllDiag(p).upRightDiag.diag);
            downRight = this.getDiagMoveSpace(p, this.calcAllDiag(p).downRightDiag.sp, this.calcAllDiag(p).downRightDiag.diag);
            upLeft = this.getDiagMoveSpace(p, this.calcAllDiag(p).upLeftDiag.sp, this.calcAllDiag(p).upLeftDiag.diag);
            downLeft = this.getDiagMoveSpace(p, this.calcAllDiag(p).downLeftDiag.sp, this.calcAllDiag(p).downLeftDiag.diag);
        } else {
            upRight = this.getDiagJumpSpace(p, this.calcAllDiag(p).upRightDiag.sp, this.calcAllDiag(p).upRightDiag.diag);
            downRight = this.getDiagJumpSpace(p, this.calcAllDiag(p).downRightDiag.sp, this.calcAllDiag(p).downRightDiag.diag);
            upLeft = this.getDiagJumpSpace(p, this.calcAllDiag(p).upLeftDiag.sp, this.calcAllDiag(p).upLeftDiag.diag);
            downLeft = this.getDiagJumpSpace(p, this.calcAllDiag(p).downLeftDiag.sp, this.calcAllDiag(p).downLeftDiag.diag);
        }

        return {
            upRight: upRight,
            downRight: downRight,
            upLeft: upLeft,
            downLeft: downLeft
        }
    }

    // Highlight and set moveTo flag on spaces a piece could move to
    selectMoveableSpaces(p: Piece) {
        // Calculating the 4 potential move spaces of the piece
        let upRight = this.findMoveableSpaces(p).upRight;
        let downRight = this.findMoveableSpaces(p).downRight;
        let upLeft = this.findMoveableSpaces(p).upLeft;
        let downLeft = this.findMoveableSpaces(p).downLeft;

        // If any of the potential move spaces exist, highlight and set moveTo flag
        if (upRight !== null) {
            upRight.highlight = upRight.moveTo = true;
        } 
        if (upLeft !== null) {
            upLeft.highlight = upLeft.moveTo = true;
        }
        if (downRight !== null) {
            downRight.highlight = downRight.moveTo = true;
        }
        if (downLeft !== null) {
            downLeft.highlight = downLeft.moveTo = true;
        }
    }

    // For win checking.  If the piece can move, return true, otherwise false
    canMove(p: Piece): boolean {
        // Calculating the 4 potential move spaces of the piece
        let upRight = this.findMoveableSpaces(p).upRight;
        let downRight = this.findMoveableSpaces(p).downRight;
        let upLeft = this.findMoveableSpaces(p).upLeft;
        let downLeft = this.findMoveableSpaces(p).downLeft;

        if (upRight == null && downRight == null && upLeft == null && downLeft == null) {
            return false;  // Can't move in any direction
        } else {
            return true;  // Able to move in at least one direction
        }
    }

    // Jumping

    // Given a space that a piece has moved to, find the piece that was jumped and clear it out
    clearJumpedPiece(sp: Space) {
        let pieces = new Array();

        pieces.push(this.getPiece(sp.row - 1, sp.col - 1));
        pieces.push(this.getPiece(sp.row - 1, sp.col + 1));
        pieces.push(this.getPiece(sp.row + 1, sp.col - 1));
        pieces.push(this.getPiece(sp.row + 1, sp.col + 1));

        this.findPiece(pieces.find(p => p !== null && p.jump === true)).clearPiece();

    }

    // Check and see if there is a potential jump opportunity, for multi jump
    checkForJump(sp: Space): boolean {
        let p = sp.piece;

        if (this.canJump(p, this.calcAllDiag(p).upRightDiag.sp, this.calcAllDiag(p).upRightDiag.diag) || 
            this.canJump(p, this.calcAllDiag(p).downRightDiag.sp, this.calcAllDiag(p).downRightDiag.diag) || 
            this.canJump(p, this.calcAllDiag(p).upLeftDiag.sp, this.calcAllDiag(p).upLeftDiag.diag) ||
            this.canJump(p, this.calcAllDiag(p).downLeftDiag.sp, this.calcAllDiag(p).downLeftDiag.diag) ) {
            return true;
        } else {
            return false;
        }
        
    }

    // Can Jump - returns true if you can jump, if not then false
    canJump(p: Piece, sp: Space, diag: Space): boolean {
        if (sp === null || diag === null || sp.piece === null) {
            return false;
        } else if (p.isRed === !sp.piece.isRed && diag !== null && diag.piece === null) {
            return true;
        } else {
            return false;
        }
    }

    // Diagonal stuff

    // Returns all 4 diagonals
    calcAllDiag(p: Piece) {
        return {
            upRightDiag: this.calcDiag(p, true, true),
            downRightDiag: this.calcDiag(p, false, true),
            upLeftDiag: this.calcDiag(p, true, false),
            downLeftDiag: this.calcDiag(p, false, false)
        }
    }

    // Given a piece, and the direction, calculate the "diagonal" - the spaces on the right or left diagonally
    // Returns the piece on the space, the neighbor space and the space 2 up
    calcDiag(p: Piece, up: boolean, right: boolean) {
        let neighborRow = -1; // -1 means not on board
        let neighborCol = -1;
        let diagRow = -1;
        let diagCol = -1;

        if (up) {
            if (right) {
                neighborRow = (<Pawn>p).getUpRightMove().row;
                neighborCol = (<Pawn>p).getUpRightMove().col;
                diagRow = (<Pawn>p).getDiagUpRightMove().row;
                diagCol = (<Pawn>p).getDiagUpRightMove().col;
            }
            if (!right) {
                neighborRow = (<Pawn>p).getUpLeftMove().row;
                neighborCol = (<Pawn>p).getUpLeftMove().col;
                diagRow = (<Pawn>p).getDiagUpLeftMove().row;
                diagCol = (<Pawn>p).getDiagUpLeftMove().col;
            }
        } else if (!up && p.type === "king") {
            if (right) {
                neighborRow = (<King>p).getDownRightMove().row;
                neighborCol = (<King>p).getDownRightMove().col;
                diagRow = (<King>p).getDiagDownRightMove().row;
                diagCol = (<King>p).getDiagDownRightMove().col;
            }
            if (!right) {
                neighborRow = (<King>p).getDownLeftMove().row;
                neighborCol = (<King>p).getDownLeftMove().col;
                diagRow = (<King>p).getDiagDownLeftMove().row;
                diagCol = (<King>p).getDiagDownLeftMove().col;
            }
        }

        return {
            p: p,
            sp: this.checkBoardSpace(neighborRow, neighborCol),
            diag: this.checkBoardSpace(diagRow, diagCol)
        }
    }

    // Given a diagonal (a space and the next space up) return the space you can move to or null if you can't move
    getDiagMoveSpace(p: Piece, sp: Space, diag: Space): Space {
        let space: Space = null;

        if (sp !== null) {
            if (sp.piece === null) { // nextdoor is empty
                space = sp;
            } else if (this.canJump(p, sp, diag)) { // piece to jump
                sp.piece.jump = diag.jump = true; // set jump flag on piece to jump and diag space
                space = diag;
            } else { // can't move down this diag
                space = null;
            }
        }

        return space;
    }

    // Give a diagonal return space you can jump to or null if you can't jump
    getDiagJumpSpace(p: Piece, sp: Space, diag: Space): Space {
        let space: Space = null;

        if (sp !== null) {
            if (this.canJump(p, sp, diag)) { // piece to jump
                sp.piece.jump = diag.jump = true; // set jump flag on piece to jump and diag space
                space = diag;
            } else { // can't move down this diag
                space = null;
            }
        }

        return space;
    }

    // King stuff

    // When a pawn makes it to the end of the board, replace the pawn piece with a king piece
    makeKing(p: Piece) {
        let king = new King(p.isRed === true ? 'red' : 'black', p.row, p.col);
        let space = this.findPiece(p);

        space.clearPiece();
        space.addPiece(king);

        // When a piece becomes king, it will always be the selected piece
        this._selectedPiece = king;
    }

    // Given a space, return true if it is in an end row and false if it is not
    isEndSpace(sp: Space): boolean {
        if (sp.row === 0 || sp.row === 7) {
            return true;
        } else {
            return false;
        }
    }

    // Space utilities

    // Given a row and column that may or may not be on the board, check if it is on the board.  If it is return the space.
    checkBoardSpace(row: number, col: number): Space {
        if (row < 8 && row > -1 && col < 8 && col > -1) {
            return this.board[row][col];
        } else {
            return null;
        }
    }

    // Find pieces

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

    // Given a row and column, return a piece if there is one
    getPiece(row: number, col: number): Piece {
        let space = this.checkBoardSpace(row, col);

        if (space !== null && space.piece !== null) {
            return space.piece;
        } else {
            return null;
        }
    }

    // Clears all highlights, direction flags, and selected pieces from board
    clearSelections() {
        this.board.forEach(row => row.forEach(space => {
            space.highlight = space.moveTo = space.jump = false;
            if (space.piece !== null) {
                space.piece.jump = false;
            }
        }));
    }
}
