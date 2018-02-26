// Module Imports
import { BrowserModule }              from '@angular/platform-browser';
import { NgModule }                   from '@angular/core';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations'

// Shared
import { AppComponent }               from './app.component';
import { GameBoardComponent }         from './game-board.component';
import { GameConsoleComponent }       from './game-console.component';
import { SpaceComponent }             from './space.component';

// Checkers Only
import { CheckersService }            from './checkers.service';
import { PawnComponent }              from './pieces/pawn.component';
import { KingComponent }              from './pieces/king.component';

// Chess Only
import { ChessService }               from './chess.service';
import { ChessPieceComponent }        from './pieces/chessPiece.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameConsoleComponent,
    SpaceComponent,
    PawnComponent,
    KingComponent,
    ChessPieceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
  	CheckersService,
    ChessService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
