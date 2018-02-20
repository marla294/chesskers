import { BrowserModule }         from '@angular/platform-browser';
import { NgModule }              from '@angular/core';

// Shared
import { AppComponent }          from './app.component';
import { GameBoardComponent }    from './game-board.component';
import { GameConsoleComponent }  from './game-console.component';
import { SpaceComponent }        from './space.component';

// Checkers Only
import { CheckersService }       from './checkers.service';
import { PawnComponent }         from './pawn.component';
import { KingComponent }         from './king.component';

// Chess Only
import { ChessService }          from './chess.service';
import { ChessPawnComponent }    from './chessPawn.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameConsoleComponent,
    SpaceComponent,
    PawnComponent,
    KingComponent,
    ChessPawnComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  	CheckersService,
    ChessService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
