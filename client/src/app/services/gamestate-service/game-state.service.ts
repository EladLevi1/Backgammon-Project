import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GameState from 'src/app/models/gameState.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private url = 'http://localhost:8080/backgammon/gamestate/';

  constructor(private httpClient: HttpClient) { }

  createGameState(gameState: GameState) {
    return this.httpClient.post<GameState>(this.url, gameState);
  }

  getGameState(gameStateId: string) {
    return this.httpClient.get<GameState>(this.url + gameStateId);
  }

  getGameStateByGameId(gameId: string) {
    return this.httpClient.get<GameState>(this.url + "game/" + gameId);
  }

  updateGameState(gameState: GameState, from : Number, to : Number) {
    return this.httpClient.put<GameState>(this.url + "makemove/" +`${gameState._id}`, {from, to});
  }
}
