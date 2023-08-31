import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GameInvitation from 'src/app/models/gameInvitation.model';

@Injectable({
  providedIn: 'root'
})
export class GameInvitationService {
  private url = 'http://localhost:8080/backgammon/gameinvitation/';

  constructor(private httpClient: HttpClient) { }

  getAllInvitations(){
    return this.httpClient.get<GameInvitation[]>(this.url);
  }

  sendGameInvitation(gameInvitation : GameInvitation){
    return this.httpClient.post<GameInvitation>(this.url, gameInvitation);
  }

  updateGameInvitation(requestId: string, status: 'accepted' | 'rejected') {
    const requestBody = { status: status };
    return this.httpClient.put<GameInvitation>(this.url + requestId, requestBody);
  }

  getGameInvitationById(id : string) {
    return this.httpClient.get<GameInvitation>(this.url + id);
  }

  getGameInvitationsForProfile(profileId: string) {
    return this.httpClient.get<GameInvitation[]>(this.url + 'profile/' + profileId);
  }

  deleteGameInvitation(requestId: string) {
    return this.httpClient.delete<GameInvitation[]>(this.url + requestId);
  }
}
