// This will be a component that houses the actual checkers game board
import { Component }	     from '@angular/core';
import { OnInit } 		     from '@angular/core';
import { Piece }	 	       from './piece';
import { CheckersService } from './checkers.service';
import { ChessService }    from './chess.service';
import { Observable }      from 'rxjs/Observable';
import { SpaceComponent }  from './space.component';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
    public chessOrCheckers = 'chess';
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

        }
        
  	}

    onResetCheckers() {
        this.checkers.resetGame();
        this.board = this.checkers.board;
    }
}