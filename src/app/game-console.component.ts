// This will be on the side of the actual checkers game board, showing things like the reset button, whose turn it is, and whether someone has won the game or not
import { Component, OnInit, Input }	from '@angular/core';
import { CheckersService }		from './checkers.service';
import { ChessService }			from './chess.service';
import { Observable }			from 'rxjs/Observable';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';

@Component({
  selector: 'game-console',
  templateUrl: './game-console.component.html',
  styleUrls: ['./game-console.component.css'],
})
export class GameConsoleComponent implements OnInit {
	@Input() chessOrCheckers = 'chess';
	public turn: string = null;

	// Observables
	public redTurn$: Observable<boolean>;

	// Behavior Subjects
	public _resetGame: BehaviorSubject<boolean>;
	
	constructor(
	  	private checkers: CheckersService,
	  	private chess: ChessService
	) {}

	ngOnInit() {
		if (this.chessOrCheckers === 'checkers') {
			//Observables
			this.redTurn$ = this.checkers.redTurnObs;
			this.redTurn$.subscribe(redTurn => {
				this.turn = redTurn ? 'Red' : 'Black';
			});

			// Behavior Subjects
			this._resetGame = this.checkers.resetGameBeh;
			this._resetGame.subscribe(reset => {
				this.turn = 'Red'; // When the game is reset by someone else set the turn to Red
			});
		} else if (this.chessOrCheckers === 'chess') {
			this._resetGame = this.chess.resetGameBeh;
		}

	}

	resetGame() {
		this._resetGame.next(true);
	}

}