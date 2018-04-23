import { Component, OnInit } from "@angular/core";
import { GameBoardComponent } from "./game-board.component";
import { GameConsoleComponent } from "./game-console.component";
import { CheckersService } from "./checkers.service";
import { ChessService } from "./chess.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    chessOrCheckers = "chess";
    isWinner = false;
    winner: string = null;
    turn: string = null;

    // Observables
    public isWinner$: Observable<string>;
    public turn$: Observable<boolean>;

    // Behavior Subjects
    public _resetGame: BehaviorSubject<boolean>;

    constructor(
        private checkers: CheckersService,
        private chess: ChessService
    ) {}

    ngOnInit() {
        this.startGame(true);
    }

    startGame(init: boolean) {
        if (this.chessOrCheckers === "checkers") {
            init ? null : this.chess.deleteBoard();
            this.isWinner$ = this.checkers.isWinnerObs;
            this._resetGame = this.checkers.resetGameBeh;
            this.turn$ = this.checkers.redTurnObs;
            this.turn = "Red";
        } else if (this.chessOrCheckers === "chess") {
            init ? null : this.checkers.deleteBoard();
            this.isWinner$ = this.chess.isWinnerObs;
            this._resetGame = this.chess.resetGameBeh;
            this.turn$ = this.chess.whiteTurnObs;
            this.turn = "White";
        }

        this._resetGame.next(true);

        this.isWinner$.subscribe(w => {
            if (w !== "none") {
                this.isWinner = true;
                this.winner = w;
            } else {
                this.isWinner = false;
                this.winner = "none";
            }
        });

        this.turn$.subscribe(t => {
            if (t) {
                this.turn = this.chessOrCheckers === "chess" ? "White" : "Red";
            } else {
                this.turn = "Black";
            }
        });

        // Because subscription doesn't take effect until next turn
        this.turn = this.chessOrCheckers === "chess" ? "White" : "Red";
    }

    toggleGame() {
        this.chessOrCheckers =
            this.chessOrCheckers === "chess" ? "checkers" : "chess";
        this.startGame(false);
    }
}
