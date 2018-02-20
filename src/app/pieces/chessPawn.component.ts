import { Component, Input }	from '@angular/core';
import { chessPawn }		from './piece';

@Component({
  	selector: 'chessPawn',
  	templateUrl: './chessPawn.component.html',
  	styleUrls: ['./chessPawn.component.css'],
})
export class ChessPawnComponent {
	@Input() chessPawn: chessPawn;
}