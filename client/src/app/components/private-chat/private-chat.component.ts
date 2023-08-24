import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ChatMessage from 'src/app/models/chatMessage.model';
import PrivateChat from 'src/app/models/privateChat.model';
import Profile from 'src/app/models/profile.model';
import { ConnectionSocketIoService } from 'src/app/services/connectionsocket-service/connection-socket-io.service';
import { PrivateChatService } from 'src/app/services/privatechat-service/private-chat.service';
import { PrivateChatSocketIoService } from 'src/app/services/privatechatsocket-service/private-chat-socket-io.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent {
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';

  privateChat : PrivateChat = new PrivateChat();

  myProfile : Profile = new Profile();
  hisProfile : Profile = new Profile();

  isOnline : boolean = false;

  isInChat : boolean = false;

  @ViewChild('chatMessagesDiv') private chatMessagesDiv?: ElementRef;

  constructor(private privateChatService: PrivateChatService, private profileService: ProfileService, private route: ActivatedRoute,
    private privateChatSocketIO: PrivateChatSocketIoService, private connectionSocketIO: ConnectionSocketIoService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const chatId = params.get('id');

      this.privateChatService.getPrivateChatById(chatId!).subscribe((chat) => {
        this.privateChat = chat;

        this.chatMessages = chat.messages;

        this.scrollToBottom();

        const profile1Id = this.privateChat.profile1._id;
        const profile2Id = this.privateChat.profile2._id;

        this.profileService.getProfileByToken().subscribe((profile) => {
          this.myProfile = profile;

          this.privateChatSocketIO.joinChat(this.privateChat._id, this.myProfile._id);

          let hisProf = '';
          if (profile1Id === this.myProfile._id){
            hisProf = profile2Id;
          } else {
            hisProf = profile1Id;
          }
  
          this.profileService.getProfileById(hisProf).subscribe((profile) => {
            this.hisProfile = profile;

            this.connectionSocketIO.getOnlineProfiles().subscribe((profiles) => {
              this.isOnline = !!profiles.find(profile => profile._id === this.hisProfile._id);

              this.privateChatSocketIO.onCurrentUsersInChat().subscribe((userIds) => {
                this.isInChat = userIds.includes(this.hisProfile._id);
              },
              (error) => {
                console.log(error.error);
              });
            },
            (error) => {
              console.log(error.error);
            });
          },
          (error) => {
            console.log(error.error)
          });
        },
        (error) => {
          console.log(error.error);
        });
      });
    });

    this.privateChatSocketIO.onNewPrivateMessage().subscribe((message) => {
      this.chatMessages.push(message);
      this.scrollToBottom();
    });

    this.privateChatSocketIO.onLeftChat().subscribe((profileId) => {
      this.isInChat = !!(this.hisProfile._id == profileId);
    });

    this.privateChatSocketIO.onJoinChat().subscribe((profileId) => {
      this.isInChat = !!(this.hisProfile._id == profileId);
    });

    this.connectionSocketIO.onProfileOnline().subscribe(() => {
      this.isOnline = true;
    });

    this.connectionSocketIO.onProfileOffline().subscribe(() => {
      this.isOnline = false;
    });
  }
  
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesDiv) {
        this.chatMessagesDiv.nativeElement.scrollTop = this.chatMessagesDiv.nativeElement.scrollHeight;
      }
    }, 100);
  }
  
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const message : ChatMessage = new ChatMessage(this.myProfile, this.newMessage)
      
      this.privateChatService.postPrivateChatMessage(this.privateChat._id, message).subscribe(response => {
        this.privateChatSocketIO.sendPrivateMessage(this.privateChat._id, response);
        this.newMessage = '';
      });
    }
  }

  ngOnDestroy() {
    this.privateChatSocketIO.leaveChat(this.privateChat._id, this.myProfile._id);
  }
}