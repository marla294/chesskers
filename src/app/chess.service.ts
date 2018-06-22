import { Injectable } from "@angular/core";
import { ChessBoard } from "./checkerBoard";
import { chessSpace } from "./space";
import {
    chessPiece,
    chessPawn,
    Rook,
    Knight,
    Bishop,
    chessKing,
    Queen
} from "./pieces/piece";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class ChessService {
    public board: any;
    private _selectedPiece: chessPiece = null;
    private _checkPiece: chessPiece = null;
    private _whiteTurn: boolean = true;

    // Behavior Subjects
    private _whiteTurnBeh: BehaviorSubject<boolean>;
    private _resetGame: BehaviorSubject<boolean>;
    private _isWinner: BehaviorSubject<string>;

    constructor() {
        this._whiteTurnBeh = <BehaviorSubject<boolean>>new BehaviorSubject(
            true
        );
        this._resetGame = <BehaviorSubject<boolean>>new BehaviorSubject(true);
        this._isWinner = <BehaviorSubject<string>>new BehaviorSubject("none");
        this._resetGame.subscribe(reset => {
            if (reset) {
                this.resetGame();
            }
        });
    }

    // Resets game back to beginning
    resetGame() {
        this.board = new ChessBoard().board;
        this._whiteTurn = true;
        this.loadResetGame(false);
        this.loadIsWinner("none");
        // Adding pawns
        for (let j = 0; j < 8; j++) {
            this.board[1][j].addPiece(new chessPawn("white", 1, j));
            this.board[6][j].addPiece(new chessPawn("black", 1, j));
        }
        // Adding rooks
        this.board[0][0].addPiece(new Rook("white", 0, 0));
        this.board[0][7].addPiece(new Rook("white", 0, 7));
        this.board[7][0].addPiece(new Rook("black", 7, 0));
        this.board[7][7].addPiece(new Rook("black", 7, 7));
        // Adding knights
        this.board[0][1].addPiece(new Knight("white", 0, 1));
        this.board[0][6].addPiece(new Knight("white", 0, 6));
        this.board[7][1].addPiece(new Knight("black", 7, 1));
        this.board[7][6].addPiece(new Knight("black", 7, 6));
        // Adding bishops
        this.board[0][2].addPiece(new Bishop("white", 0, 2));
        this.board[0][5].addPiece(new Bishop("white", 0, 5));
        this.board[7][2].addPiece(new Bishop("black", 7, 2));
        this.board[7][5].addPiece(new Bishop("black", 7, 5));
        // Adding kings
        this.board[0][3].addPiece(new chessKing("white", 0, 3));
        this.board[7][3].addPiece(new chessKing("black", 7, 3));
        // Adding queens
        this.board[0][4].addPiece(new Queen("white", 0, 4));
        this.board[7][4].addPiece(new Queen("black", 7, 4));

        this._whiteTurnBeh.subscribe(turn => {
            this.highlightKingSpace(this.check());
            if (this.check()) {
                this.checkmate();
            }
        });
    }

    // When we're playing checkers we want to delete the chessboard
    deleteBoard() {
        delete this.board;
    }

    // Observables and Behavioral Subjects

    loadWhiteTurn(turn: boolean) {
        this._whiteTurnBeh.next(turn);
    }

    loadResetGame(reset: boolean) {
        this._resetGame.next(reset);
    }

    loadIsWinner(winner: string) {
        this._isWinner.next(winner);
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

    // For Game Board
    get isWinnerObs() {
        return this._isWinner.asObservable();
    }

    // Click events for pieces and spaces

    // Click on a piece on the board
    clickAPiece(p: chessPiece) {
        // If there is already a selected piece, and the piece being clicked is the opposite color,
        // see if we can take the piece that was clicked on
        if (this._selectedPiece && p.isWhite === !this._selectedPiece.isWhite) {
            this.movePiece(this._selectedPiece, this.findPiece(p), false);
        } else {
            // Only other thing we could be doing is selecting a different piece from what we already
            // have selected
            this.selectAPiece(p);
        }
    }

    // Click on an empty space on the board
    clickEmptySpace(sp: chessSpace) {
        if (this._selectedPiece) {
            this._selectedPiece.type === "chessKing"
                ? this.castle(sp)
                : this.movePiece(this._selectedPiece, sp, false);
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
    checkmate() {
        let checkmate = true;

        // Moves every piece for the current team still on the board and tests whether it will get the king out of check.  If it does, then there's no winner.  If none of the pieces get the king out of check, even the king himself, then someone won.
        let pieceArray = this.getPieceArray(this._whiteTurn);

        pieceArray.forEach(piece => {
            this.getMoveSpaces(piece).forEach(space => {
                if (!this.movePiece(piece, space, true)) {
                    checkmate = false;
                }
            });
        });

        if (checkmate) {
            this.loadIsWinner(this._whiteTurn ? "Black" : "White");
        }
    }

    // Given a piece on the board, return an array of all the possible spaces it could move to, including those where it would be capturing another piece
    getMoveSpaces(p: chessPiece) {
        let spaceArray = new Array();

        this.board.forEach(row =>
            row.forEach(space => {
                if (this.canMovePiece(p, space)) {
                    spaceArray.push(space);
                }
            })
        );

        return spaceArray;
    }

    /* Check function will see if the king of the team of the current turn is in check.  If it is, the current team will only be able to move pieces that get the king out of check. */
    check(): boolean {
        // Get other team pieces
        let pieceArray = this.getPieceArray(!this._whiteTurn);

        // Get the King space of the current team
        let kingSp: chessSpace = this.findKingSpace();

        // Check if the pieces from the other team could take the king
        let check: boolean = false;
        pieceArray.forEach(piece => {
            if (this.canMovePiece(piece, kingSp)) {
                this._checkPiece = piece;
                check = true;
            }
        });

        return check;
    }

    /* Highlights the King space of the current team */
    highlightKingSpace(check: boolean) {
        this.board.forEach(row => row.forEach(space => (space.check = false))); // First remove highlight from all old squares
        let king: chessSpace = this.findKingSpace();
        king.check = check;
    }

    /* Find the king space for the current team's turn */
    findKingSpace(): chessSpace {
        // Get current team pieces
        let pieceArray = this.getPieceArray(this._whiteTurn);

        // Find that king
        let king: chessPiece = pieceArray.filter(
            piece => piece.type === "chessKing"
        )[0];

        return this.findPiece(king);
    }

    /* Function that will move the selected piece to the given space
    If the space contains a piece of the opposite color the piece will be taken, otherwise the selected piece will just move to the empty space. */
    movePiece(p: chessPiece, sp: chessSpace, test: boolean): boolean {
        // Flag saying whether we removed the check from the king, for test mode
        let check: boolean = false;

        // take = whether the space the piece wants to move to holds a piece that can be taken
        let take =
            sp.piece !== null && sp.piece.isWhite === !p.isWhite ? true : false;

        // If you can move the selected piece to a space, then do it.
        // Either take the piece in the space or move to the empty space
        // If you can't move the piece there, re-select it
        if (!test) {
            if (this.canMovePiece(p, sp)) {
                if (take) {
                    check = this.movePieceToTake(p, sp.piece, test);
                } else {
                    check = this.movePieceToEmptySp(p, sp, test);
                }
            } else {
                this.selectAPiece(p);
            }
        } else if (test) {
            if (sp.piece === null) {
                // move to empty space
                check = this.movePieceToEmptySp(p, sp, true);
            } else if (take) {
                // piece to take here
                check = this.movePieceToTake(p, sp.piece, true);
            } else {
                // can't move here, so king would still be in check
                check = true;
            }
        }

        return check;
    }

    // Move the given piece to take a piece.  'test' variable tells if it's just a test
    movePieceToTake(p: chessPiece, take: chessPiece, test: boolean): boolean {
        let sp = this.findPiece(take);
        let check = false;

        sp.clearPiece(); // clear out the taken piece from the space

        check = this.movePieceToEmptySp(p, sp, test);

        // If the king was in check from the move, or this was a test, put the old piece back in the empty space
        if (check || test) {
            sp.addPiece(take);
            this.highlightKingSpace(true);
        }

        return check;
    }

    // Move a piece to an empty space.  If the king was in check while moving, return true for moveSelectedToTake.  'test' variable tells if it's just a test
    movePieceToEmptySp(p: chessPiece, sp: chessSpace, test: boolean): boolean {
        // storing piece old space in case king is in check
        let space_old = this.findPiece(p);
        // whether king is in check
        let check = true;

        // move piece to new space to see if king is in check
        space_old.clearPiece();
        sp.addPiece(p);

        // test if the king is in check after moving the piece
        check = this.check();

        if (!test && !check) {
            this.highlightKingSpace(false);
            this.initializeSelected();
            this._whiteTurn = !this._whiteTurn;
            this.loadWhiteTurn(this._whiteTurn);
            this.clearSelections();
        } else {
            sp.clearPiece();
            space_old.addPiece(p);
        }

        return check;
    }

    // Special move where the king and rook switch places
    // See https://en.wikipedia.org/wiki/Castling?oldformat=true
    // Bug - if you move the king down a few rows, but to the right
    // column, castling still happens but it shouldn't
    castle(sp: chessSpace) {
        let isAllowed: boolean = false;
        let isLeft: boolean = sp.col < this._selectedPiece.col;
        let spaceMoved: number = Math.abs(this._selectedPiece.col - sp.col);
        let row: number = this._selectedPiece.isRed ? 0 : 7;
        let rookCol: number = isLeft ? 0 : 7;
        let rookSp: chessSpace = this.board[row][rookCol];
        let rook: Rook;

        if (
            this._selectedPiece.type === "chessKing" &&
            !(<chessKing>this._selectedPiece).initialized
        ) {
            if (
                spaceMoved === 2 &&
                rookSp.piece !== null &&
                rookSp.piece.type === "rook" &&
                !(<Rook>rookSp.piece).initialized
            ) {
                rook = <Rook>rookSp.piece;
                isAllowed = true;
            }
        }

        if (isAllowed) {
            if (isLeft) {
                rookSp.clearPiece();
                this.board[row][2].addPiece(rook);
                this.movePieceToEmptySp(this._selectedPiece, sp, false);
            } else {
                rookSp.clearPiece();
                this.board[row][4].addPiece(rook);
                this.movePieceToEmptySp(this._selectedPiece, sp, false);
            }
        } else {
            this.movePiece(this._selectedPiece, sp, false);
        }
    }

    /* For a piece on the board, check if it can move to the specified space, or take the piece in the space (if there is a piece there)*/
    canMovePiece(p: chessPiece, sp: chessSpace): boolean {
        switch (p.type) {
            case "chessPawn":
                const take =
                    sp.piece && sp.piece.isWhite === !p.isWhite ? true : false;
                if (take && (<chessPawn>p).canTake(sp.row, sp.col)) {
                    return true;
                }
                if (
                    !take &&
                    (<chessPawn>p).canMove(sp.row, sp.col) &&
                    this.isMoveClear(p, sp)
                ) {
                    return true;
                }
                return false;
            case "rook":
                return (<Rook>p).canMove(sp.row, sp.col) &&
                    this.isMoveClear(p, sp)
                    ? true
                    : false;
            case "knight":
                return (<Knight>p).canMove(sp.row, sp.col) ? true : false;
            case "bishop":
                return (<Bishop>p).canMove(sp.row, sp.col) &&
                    this.isMoveClear(p, sp)
                    ? true
                    : false;
            case "queen":
                return (<Queen>p).canMove(sp.row, sp.col) &&
                    this.isMoveClear(p, sp)
                    ? true
                    : false;
            case "chessKing":
                return (<chessKing>p).canMove(sp.row, sp.col) ? true : false;
            default:
                return false;
        }
    }

    /* Is Move Clear functionality
    These functions help determine if the path is clear between the selected piece
    and the space that the piece is moving to */

    // Determines whether to use the straight or diag function to check
    isMoveClear(p: chessPiece, sp: chessSpace) {
        return sp.row === p.row || sp.col === p.col
            ? this.isMoveClearStraight(p, sp)
            : this.isMoveClearDiag(p, sp);
    }

    // Determines if the space has a piece between the piece
    // and the space on a straight line
    isMoveClearStraight(p: chessPiece, sp: chessSpace): boolean {
        const colDiff = Math.abs(p.col - sp.col);
        const rowDiff = Math.abs(p.row - sp.row);

        let isClear = true;

        // Moving along a row
        if (!colDiff) {
            const rowStart = Math.min(p.row, sp.row);
            const rowEnd = rowStart + rowDiff;

            for (let i = rowStart + 1; i < rowEnd; i++) {
                if (this.board[i][p.col].piece) {
                    isClear = false;
                }
            }
        }

        // Moving along a column
        if (!rowDiff) {
            const colStart = Math.min(p.col, sp.col);
            const colEnd = colStart + colDiff;
            const colArr = this.board[p.row].slice(colStart + 1, colEnd);

            isClear = !colArr.some(sp => sp.piece);
        }

        return isClear;
    }

    // Determines if the space has a piece between the piece
    // and the space on a diagonal line
    isMoveClearDiag(p: chessPiece, sp: chessSpace): boolean {
        const pRow: number = sp.row < p.row ? -p.row : p.row;
        const pCol: number = sp.col < p.col ? -p.col : p.col;
        const diagLen = Math.abs(sp.row - p.row);

        for (let i = 1; i < diagLen; i++) {
            if (this.board[Math.abs(pRow + i)][Math.abs(pCol + i)].piece) {
                return false;
            }
        }

        return true;
    }

    /* Utilities
    Just some functions that make life a little easier */

    // Finds a piece on the board and returns the space it is on
    findPiece(p: chessPiece): chessSpace {
        return this.board[p.row][p.col];
    }

    // Get array of pieces for the white or the black team
    // See if I can use array.filter() to do this instead
    getPieceArray(white: boolean) {
        let pieceArray = [];
        this.board.forEach(row => {
            row.forEach(space => {
                if (space.piece && space.piece.isWhite === white) {
                    pieceArray.push(space.piece);
                }
            });
        });

        return pieceArray;
    }

    // Clears all highlights, direction flags, and selected pieces from board
    clearSelections() {
        this.board.forEach(row =>
            row.forEach(space => {
                space.highlight = space.moveTo = false;
            })
        );
        this._selectedPiece = null;
    }

    // If the selected piece needs to be initialized on the first turn, do that here
    initializeSelected() {
        let type = this._selectedPiece.type;
        if (type === "chessPawn") {
            (<chessPawn>this._selectedPiece).initialized = true;
        }
        if (type === "chessKing") {
            (<chessKing>this._selectedPiece).initialized = true;
        }
        if (type === "rook") {
            (<Rook>this._selectedPiece).initialized = true;
        }
    }
}
