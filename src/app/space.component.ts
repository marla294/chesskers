import { Component, Input }	from '@angular/core';
import { Space, chessSpace }			from './space';
import { CheckersService }	from './checkers.service';
import { ChessService }		from './chess.service';
import { trigger, state, style, animate, transition, animateChild }	from '@angular/animations';

@Component({
  	selector: 'space',
  	templateUrl: './space.component.html',
  	styleUrls: ['./space.component.css'],
  	animations: []
})
export class SpaceComponent {
	@Input() space: chessSpace;

	constructor(
  		private checkers: CheckersService,
  		private chess: ChessService
  	) {}
}