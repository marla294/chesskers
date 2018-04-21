// This will be a component that houses the actual checkers game board
import { Component, Input } from "@angular/core";
import { OnInit } from "@angular/core";
import { Piece } from "./pieces/piece";
import { CheckersService } from "./checkers.service";
import { ChessService } from "./chess.service";
import { Observable } from "rxjs/Observable";
import { SpaceComponent } from "./space.component";

@Component({
    selector: "game-board",
    templateUrl: "./game-board.component.html",
    styleUrls: ["./game-board.component.css"]
})
export class GameBoardComponent implements OnInit {
    @Input() chessOrCheckers;
    public board: any;

    // Observables
    public resetGameCheckers$: Observable<boolean>;
    public resetGameChess$: Observable<boolean>;

    constructor(
        private checkers: CheckersService,
        private chess: ChessService
    ) {}

    ngOnInit() {
        this.resetGameCheckers$ = this.checkers.resetGameObs;
        this.resetGameCheckers$.subscribe(reset => {
            if (reset) {
                this.onResetCheckers();
            }
        });

        this.resetGameChess$ = this.chess.resetGameObs;
        this.resetGameChess$.subscribe(reset => {
            if (reset) {
                this.onResetChess();
            }
        });

        if (this.chessOrCheckers === "chess") {
            this.onResetChess();
        } else {
            this.onResetCheckers();
        }
    }

    onResetCheckers() {
        this.chess.deleteBoard();
        this.checkers.resetGame();
        this.board = this.checkers.board;
    }

    onResetChess() {
        this.checkers.deleteBoard();
        this.chess.resetGame();
        this.board = this.chess.board;
    }
}
