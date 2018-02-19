import { Component, Input }	from '@angular/core';
import { Piece, Pawn }		from './piece';
import { GameService }	   	from './game.service';

@Component({
  	selector: 'pawn',
  	templateUrl: './pawn.component.html',
  	styleUrls: ['./pawn.component.css'],
})
export class PawnComponent {
	@Input() pawn: Pawn;

	constructor(
		private service: GameService
	) {}
}