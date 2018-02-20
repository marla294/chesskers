import { Component, Input }	from '@angular/core';
import { Piece }		from './piece';

@Component({
  	selector: 'chessPiece',
  	templateUrl: './chessPiece.component.html',
  	styleUrls: ['./chessPiece.component.css'],
})
export class ChessPieceComponent {
	@Input() chessPiece: Piece;
}