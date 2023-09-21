import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Game from 'src/app/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private url = 'http://localhost:8080/backgammon/games/';

  constructor(private httpClient: HttpClient) { }

  createGame(game: Game) {
    return this.httpClient.post<Game>(this.url, game);
  }

  getGame(gameId: string) {
    return this.httpClient.get<Game>(this.url + gameId);
  }
}
