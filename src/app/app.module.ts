import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BowlingScoreboardComponent } from './bowling-scoreboard/bowling-scoreboard.component';
import { BowlingService } from './_services/bowling.service';
import { DataService } from './_services/data/data.service';

@NgModule({
  declarations: [
    AppComponent,
    BowlingScoreboardComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(DataService),
  ],
  providers: [BowlingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
