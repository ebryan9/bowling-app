import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api'
import { Player } from 'src/app/_models/player.model';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  constructor() { }

  createDb(){
    let players: Player[] = [
      {
        id: 1,
        name: 'Player 1',
        frames: [
          { roll1: 4, roll2: 3 },
          { roll1: 7, roll2: 3 },
          { roll1: 5, roll2: 2 },
          { roll1: 8, roll2: 1 },
          { roll1: 4, roll2: 6 },
          { roll1: 2, roll2: 4 },
          { roll1: 8, roll2: 0 },
          { roll1: 8, roll2: 0 },
          { roll1: 8, roll2: 2 },
          { roll1: 10, roll2: 1, roll3: 7 },
        ]
      },
      {
        id: 2,
        name: 'Player 2',
        frames: [
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
          { roll1: undefined, roll2: undefined },
        ],
      },
    ];

    return { players };

  }
}
