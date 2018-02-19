import { Component } 	         from '@angular/core';
import { OnInit } 		         from '@angular/core';
import { GameBoardComponent }    from './game-board.component';
import { GameConsoleComponent }  from './game-console.component';
import { GameService }	   		 from './game.service';
import { Observable }      		 from 'rxjs/Observable';
import { BehaviorSubject }       from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
	isWinner = false;
	winner: string = null;

	// Observables
    public isWinner$: Observable<string>;

    // Behavior Subjects
	public _resetGame: BehaviorSubject<boolean>;

	constructor(
  		  private service: GameService
  	) {}

  	ngOnInit() {
  		// Observables
  		this.isWinner$ = this.service.isWinnerObs;
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

  		// Behavior Subjects
		this._resetGame = this.service.resetGameBeh;
  	}

	onReset() {
		this._resetGame.next(true);
	}

}