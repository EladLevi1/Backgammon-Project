import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import PrivateChat from 'src/app/models/privateChat.model';
import ChatMessage from 'src/app/models/chatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class PrivateChatService {
  private url = 'http://localhost:8080/backgammon/privatechat/';

  constructor(private httpClient: HttpClient) {}

  getPrivateChatById(chatId: string){
    return this.httpClient.get<PrivateChat>(this.url + chatId);
  }

  getPrivateChat(profile1Id: string, profile2Id: string) {
    return this.httpClient.get<PrivateChat>(this.url + profile1Id + '/' + profile2Id);
  }

  postPrivateChatMessage(id: string, chatMessage: ChatMessage) {
    return this.httpClient.post<ChatMessage>(this.url + id, chatMessage);
  }
}
