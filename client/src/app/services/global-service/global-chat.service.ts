import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GlobalChat, { ChatMessage } from 'src/app/models/globalChat.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalChatService {
  private url = 'http://localhost:8080/backgammon/globalchat/';

  constructor(private httpClient: HttpClient) { }
  
  getGlobalChat() {
    return this.httpClient.get<GlobalChat>(this.url);
  }
  
  getGlobalChatMessages() {
    return this.httpClient.get<ChatMessage[]>(this.url + 'messages');
  }
  
  sendGlobalChatMessage(chatMessage: ChatMessage) {
    return this.httpClient.post<ChatMessage>(this.url, chatMessage);
  }
}
