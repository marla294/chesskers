// This will be a component that houses the actual checkers game board
import { Component }	     from '@angular/core';
import { OnInit } 		     from '@angular/core';
import { Piece }	 	       from './piece';
import { GameService }	   from './game.service';
import { Observable }      from 'rxjs/Observable';
import { SpaceComponent }  from './space.component';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
	  public board: any;

    // Observables
    public resetGame$: Observable<boolean>;

  	constructor(
  		  private service: GameService
  	) {}

  	ngOnInit() {
        //Observables
        this.resetGame$ = this.service.resetGameObs;
        this.resetGame$.subscribe(reset => {
            if (reset) {
                this.onReset();
            }
        });

        // Always reset game on init anyway
        this.onReset();
  	}

    onReset() {
        this.service.resetGame();
        this.board = this.service.board;
    }
}