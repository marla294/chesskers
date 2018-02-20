import { Component, Input }	from '@angular/core';
import { King }				from './piece';

@Component({
  	selector: 'king',
  	templateUrl: './king.component.html',
  	styleUrls: ['./king.component.css'],
})
export class KingComponent {
	@Input() king: King;

}