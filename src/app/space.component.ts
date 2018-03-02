import { Component, Input }	from '@angular/core';
import { Space, chessSpace }from './space';
import { CheckersService }	from './checkers.service';
import { ChessService }		from './chess.service';
import { trigger, state, style, animate, transition, animateChild }	from '@angular/animations';

@Component({
  	selector: 'space',
  	templateUrl: './space.component.html',
  	styleUrls: ['./space.component.css'],
  	animations: [
  		trigger('kingAnimation', [
      		state('true',   style({
        		backgroundColor: '#FF0000',
      		})),
	      	transition('false => true', animate('100ms ease-in')),
	      	transition('true => false', animate('100ms ease-out'))
	    ])
  	]
})
export class SpaceComponent {
	@Input() space: chessSpace;
  @Input() chessOrCheckers: string;

	constructor(
  		private checkers: CheckersService,
  		private chess: ChessService
  	) {}

}