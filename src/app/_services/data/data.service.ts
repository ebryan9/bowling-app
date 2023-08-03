import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api'
import { Player } from 'src/app/_models/player.model';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  constructor() { }

  createDb(){
    let players: Player[] = [];

    return { players };

  }
}
