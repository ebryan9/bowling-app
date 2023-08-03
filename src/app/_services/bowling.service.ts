import { Injectable } from '@angular/core';
import { Player } from '../_models/player.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BowlingService {
  SERVER_URL: string = "http://localhost:8080/api/";
  constructor(private httpClient: HttpClient) { }

   getPlayers() {
    return this.httpClient.get(this.SERVER_URL + 'players');
  }

  getPlayer(playerId: number){
    return this.httpClient.get(`${this.SERVER_URL + 'players'}/${playerId}`);
  }

  createPlayer(player: Player){
    return this.httpClient.post(`${this.SERVER_URL + 'players'}`, player)
  }

  deletePlayer(playerId: number){
    return this.httpClient.delete(`${this.SERVER_URL + 'players'}/${playerId}`)
  }

  updatePolicy(player: Player){
    return this.httpClient.put(`${this.SERVER_URL + 'players'}/${player.id}`, player)
  }
}
