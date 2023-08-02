import { Injectable } from '@angular/core';
import { Player } from '../_models/player.model';

@Injectable({
  providedIn: 'root'
})
export class BowlingService {
  players: Player[] = [
    {
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
      name: 'Player 2',
      frames: [
        { roll1: 5, roll2: 3 },
        { roll1: 3, roll2: 7 },
        { roll1: 7, roll2: 2 },
        { roll1: 6, roll2: 1 },
        { roll1: 3, roll2: 5 },
        { roll1: 7, roll2: 2 },
        { roll1: 10, roll2: 0 },
        { roll1: 6, roll2: 2 },
        { roll1: 9, roll2: 1 },
        { roll1: 10, roll2: 1, roll3: undefined },
      ],
    },
    {
      name: 'Player 3',
      frames: [
        { roll1: 7, roll2: 3 },
        { roll1: 10, roll2: 0 },
        { roll1: 5, roll2: 2 },
        { roll1: 4, roll2: 4 },
        { roll1: 7, roll2: 3 },
        { roll1: 10, roll2: 0 },
        { roll1: 7, roll2:2 },
        { roll1: 10, roll2: 0 },
        { roll1: 8, roll2: 2 },
        { roll1: 7, roll2: 2 },
      ],
    },
  ];

  constructor() { }

   // Method to get all players
   getPlayers(): Player[] {
    return this.players;
  }

  // Method to add a new player
  addPlayer(newPlayer: Player): void {
    this.players.push(newPlayer);
  }

  // Method to remove a player
  removePlayer(index: number): void {
    if (index >= 0 && index < this.players.length) {
      this.players.splice(index, 1);
    }
  }
}
