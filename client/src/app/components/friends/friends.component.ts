import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import friendRequest from 'src/app/models/friendRequest.model';
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import { FriendRequestService } from 'src/app/services/friendrequest-service/friend-request.service';
import { FriendsSocketIoService } from 'src/app/services/friendssocket-service/friends-socket-io.service';
import { PrivateChatService } from 'src/app/services/privatechat-service/private-chat.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent {
  profile: Profile = new Profile();
  friends: Profile[] = [];
  friendRequests: friendRequest[] = [];
  sentRequests: friendRequest[] = [];
  receivedRequests: friendRequest[] = [];
  nicknameToAdd: string = '';
  error: string = '';
  currentTab: 'friends' | 'sent' | 'received' = 'friends';


  constructor(private profileService: ProfileService, private friendRequestService: FriendRequestService, private friendSocketIO: FriendsSocketIoService,
    private privateChatService: PrivateChatService) {}

  ngOnInit() {
    this.profileService.getProfileByToken().subscribe((p) => {
      this.profile = p;

      this.profileService.getProfileFriends(this.profile._id).subscribe((friends) => {
        this.friends = friends;
      },
      (error) => {
        console.log(error.error);
      });

      this.friendRequestService.getFriendRequestsForProfile(this.profile._id).subscribe((requests) => {
          this.friendRequests = requests;

          this.friendRequests.forEach(request => {
            if (request.sender._id === this.profile._id) {
              this.sentRequests.push(request);
            } else {
              this.receivedRequests.push(request);
            }
          });
        },
        (error) => {
          console.log(error.error);
        }
      );
    },
    (error) => {
      console.log(error.error);
    });

    this.friendSocketIO.onFriendRequestReceived().subscribe((data) => {
      this.friendRequestService.getFriendRequestById(data._id).subscribe((request) => {
        this.receivedRequests.push(request);
      })
    },
    (error) => {
      console.log(error.error);
    });

    this.friendSocketIO.onFriendRequestAccepted().subscribe((data) => {
      this.friendRequestService.getFriendRequestById(data._id).subscribe((request) => {
        this.sentRequests = this.sentRequests.filter(req => req._id !== request._id);
      },
      (error) => {
        console.log(error.error);
      });
      
      this.profileService.getProfileById(data.recipient).subscribe((p) => {
        this.friends.push(p);
      },
      (error) => {
        console.log(error.error);
      });
    },
    (error) => {
      console.log(error.error)
    });

    this.friendSocketIO.onFriendRequestRejected().subscribe((data) => {
      this.sentRequests = this.sentRequests.filter(req => req._id !== data._id);
    },
    (error)=> {
      console.log(error.error)
    });

    this.friendSocketIO.onFriendRemoved().subscribe((profileId) => {
      console.log(profileId)
      this.friends = this.friends.filter(f => f._id !== profileId);
    },
    (error) => {
      console.log(error.error);
    });
  }

  addFriendByNickname() {
    this.profileService.getProfileByNickname(this.nicknameToAdd).subscribe(profile => {
        // Check if trying to add self.
        if (profile._id === this.profile._id) {
          this.error = "You cannot add yourself.";
          return;
        }

        // Check if already friends.
        if (this.friends.some(friend => friend._id === profile._id)) {
          this.error = "You're already friends with this user.";
          return;
        }

        // Check if there's already a friend request pending.
        if (this.friendRequests.some(request => (request.sender._id === this.profile._id && request.recipient._id === profile._id) || 
                                               (request.sender._id === profile._id && request.recipient._id === this.profile._id))) {
          this.error = "There's already a friend request pending with this user.";
          return;
        }

        const requestToSend = new friendRequest();
        requestToSend.sender = this.profile;
        requestToSend.recipient = profile;

        this.friendRequestService.sendFriendRequest(requestToSend).subscribe(
          res => {
            this.error = "Friend request sent successfully.";

            this.friendSocketIO.sendFriendRequest(res);

            this.friendRequestService.getFriendRequestById(res._id).subscribe((req) => {
              this.sentRequests.push(req);
            },
            (error) => {
              console.log(error.error)
            });
          },
          error => {
            console.log(error.error);
            this.error = 'Error sending friend request.';
          }
        );
      },
      error => {
        console.log(error.error);
        this.error = 'Profile not found.';
      }
    );
  }

  acceptRequest(request: friendRequest){
    this.friendRequestService.updateFriendRequest(request._id, 'accepted').subscribe((response) => {
        this.friendSocketIO.acceptFriendRequest(response);

        this.receivedRequests = this.receivedRequests.filter(req => req._id !== request._id);

        this.profileService.getProfileById(request.sender._id).subscribe((p) => {
          this.friends.push(p);
        });

        this.profileService.addFriend(this.profile._id, request.sender._id).subscribe()
        this.profileService.addFriend(request.sender._id, this.profile._id).subscribe()
      },
      (error) => {
        console.log(error.error);
        this.error = 'Error accepting the friend request.';
      }
    );
  }

  rejectRequest(request: friendRequest){
    this.friendRequestService.updateFriendRequest(request._id, 'rejected').subscribe((response) => {
        this.friendSocketIO.rejectFriendRequest(response);

        this.receivedRequests = this.receivedRequests.filter(req => req._id !== request._id);
      },
      (error) => {
        console.log(error.error);
        this.error = 'Error rejecting the friend request.';
      }
    );
  }

  unfriend(friend : Profile) {
    this.profileService.deleteFriend(this.profile._id, friend._id).subscribe();
    this.profileService.deleteFriend(friend._id, this.profile._id).subscribe();
    this.friends = this.friends.filter(f => f._id != friend._id);
    this.friendSocketIO.removeFriend(friend._id, this.profile._id);
  }

  openChatWindow(friendId: string) {
    this.privateChatService.getPrivateChat(this.profile._id, friendId).subscribe((chat) => {
      const chatUrl = `/privatechat/${chat._id}`;
      window.open(chatUrl, '_blank', 'location=no,toolbar=no,menubar=no,width=500,height=635');
    },
    (error) => {
      console.log(error.error);
    });  
  }
}