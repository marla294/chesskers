import { Component, Input }	from '@angular/core';
import { Space }			from './space';
import { CheckersService }	from './checkers.service';
import { ChessService }		from './chess.service';

@Component({
  	selector: 'space',
  	templateUrl: './space.component.html',
  	styleUrls: ['./space.component.css'],
})
export class SpaceComponent {
	@Input() space: Space;

	constructor(
  		private checkers: CheckersService,
  		private chess: ChessService
  	) {}
}