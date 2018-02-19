import { BrowserModule }         from '@angular/platform-browser';
import { NgModule }              from '@angular/core';

import { AppComponent }          from './app.component';
import { GameBoardComponent }    from './game-board.component';
import { GameConsoleComponent }  from './game-console.component';
import { GameService }	         from './game.service';
import { SpaceComponent }        from './space.component';
import { PawnComponent }         from './pawn.component';
import { KingComponent }         from './king.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameConsoleComponent,
    SpaceComponent,
    PawnComponent,
    KingComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  	GameService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
