import { Space }	from './space';

export class CheckerBoard {
	  public board = new Array();

  	constructor() {
  		for (let i = 0; i < 8; i = i+2) {
    			let rowEven = new Array();
    			let rowOdd = new Array();
    			for (let j = 0; j < 8; j = j+2) {
      				rowEven[j] = new Space(true, i, j);
      				rowEven[j+1] = new Space(false, i, j+1);
    			}
    			for (let j = 0; j < 8; j = j+2) {
      				rowOdd[j] = new Space(false, i+1, j);
      				rowOdd[j+1] = new Space(true, i+1, j+1);
    			}
    			this.board[i] = rowEven;
    			this.board[i+1] = rowOdd;
    		}
  	}
	
}