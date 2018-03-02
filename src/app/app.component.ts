import { Component, OnInit } 	     from '@angular/core';
import { GameBoardComponent }      from './game-board.component';
import { GameConsoleComponent }    from './game-console.component';
import { CheckersService }	   		 from './checkers.service';
import { ChessService }            from './chess.service';
import { Observable }      		     from 'rxjs/Observable';
import { BehaviorSubject }         from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  	chessOrCheckers = 'chess';
    isWinner = false;
  	winner: string = null;

  	// Observables
    public isWinner$: Observable<string>;

    // Behavior Subjects
  	public _resetGame: BehaviorSubject<boolean>;

  	constructor(
  		  private checkers: CheckersService,
        private chess: ChessService
  	) {}

  	ngOnInit() {
        if (this.chessOrCheckers === 'checkers') {
            this.isWinner$ = this.checkers.isWinnerObs;
            this._resetGame = this.checkers.resetGameBeh;
        } else if (this.chessOrCheckers === 'chess') {
            this.isWinner$ = this.chess.isWinnerObs;
            this._resetGame = this.chess.resetGameBeh;
        }

        this.isWinner$.subscribe(w => {
            if (w !== "none") {
                this.isWinner = true;
                this.winner = w;
            }
            else {
                this.isWinner = false;
                this.winner = "none";
            }
        });
  	}

	  onReset() {
		    this._resetGame.next(true);
	  }

}