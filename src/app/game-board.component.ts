// This will be a component that houses the actual checkers game board
import { Component, Input }	     from '@angular/core';
import { OnInit } 		           from '@angular/core';
import { Piece }	 	             from './pieces/piece';
import { CheckersService }       from './checkers.service';
import { ChessService }          from './chess.service';
import { Observable }            from 'rxjs/Observable';
import { SpaceComponent }        from './space.component';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
    @Input() chessOrCheckers;
	  public board: any;

    // Observables
    public resetGame$: Observable<boolean>;

  	constructor(
  		  private checkers: CheckersService,
        private chess: ChessService
  	) {}

  	ngOnInit() {
        if (this.chessOrCheckers === 'checkers') {
            //Observables
            this.resetGame$ = this.checkers.resetGameObs;
            this.resetGame$.subscribe(reset => {
                if (reset) {
                    this.onResetCheckers();
                }
            });

            // Always reset game on init anyway
            this.onResetCheckers();
        } else if (this.chessOrCheckers === 'chess') {
            //Observables
            this.resetGame$ = this.chess.resetGameObs;
            this.resetGame$.subscribe(reset => {
                if (reset) {
                    this.onResetChess();
                }
            });

            // Always reset game on init anyway
            this.onResetChess();
        }
        
  	}

    onResetCheckers() {
        this.checkers.resetGame();
        this.board = this.checkers.board;
    }

    onResetChess() {
        this.chess.resetGame();
        this.board = this.chess.board;
    }
}