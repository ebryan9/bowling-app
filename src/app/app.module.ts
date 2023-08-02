import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BowlingScoreboardComponent } from './bowling-scoreboard/bowling-scoreboard.component';
import { BowlingService } from './_services/bowling.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BowlingScoreboardComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [BowlingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
