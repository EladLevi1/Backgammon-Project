import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import ChatMessage from 'src/app/models/chatMessage.model';
import Profile from 'src/app/models/profile.model';
import User from 'src/app/models/user.model';
import { GlobalChatService } from 'src/app/services/globalchat-service/global-chat.service';
import { GlobalChatSocketIoService } from 'src/app/services/globalchatsocket-service/global-chat-socket-io.service';

@Component({
  selector: 'app-global-chat',
  templateUrl: './global-chat.component.html',
  styleUrls: ['./global-chat.component.css']
})
export class GlobalChatComponent {
  messages: ChatMessage[] = [];
  newMessage: string = '';

  @ViewChild('chatMessagesDiv') private chatMessagesDiv?: ElementRef;

  @Input() user : User = new User();
  @Input() profile : Profile = new Profile();
  @Output() closeChat = new EventEmitter();

  constructor(private globalChatService: GlobalChatService, private globalChatSocketIO: GlobalChatSocketIoService) { }

  ngOnInit() {
    this.globalChatService.getGlobalChatMessages().subscribe(
      (messages) => {
        this.messages = messages;
      },
      (error) => {
        console.log(error.error);
      }
    );

    this.globalChatSocketIO.onNewGlobalMessage().subscribe((message) => {
      this.onNewMessageReceived(message);
    });

    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const chatMessage: ChatMessage = {
        sender: this.profile,
        content: this.newMessage,
        timestamp: new Date()
      };

      this.globalChatService.sendGlobalChatMessage(chatMessage).subscribe();
      this.globalChatSocketIO.sendGlobalMessage(chatMessage);

      this.newMessage = '';
    }
  }

  onNewMessageReceived(message: ChatMessage) {
    this.messages.push(message);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesDiv) {
        this.chatMessagesDiv.nativeElement.scrollTop = this.chatMessagesDiv.nativeElement.scrollHeight;
      }
    }, 100);
  }

  closeTheChat() {
    this.closeChat.emit();
  }
}