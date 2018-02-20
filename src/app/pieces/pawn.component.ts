import { Component, Input }	from '@angular/core';
import { Pawn }		from './piece';

@Component({
  	selector: 'pawn',
  	templateUrl: './pawn.component.html',
  	styleUrls: ['./pawn.component.css'],
})
export class PawnComponent {
	@Input() pawn: Pawn;

}