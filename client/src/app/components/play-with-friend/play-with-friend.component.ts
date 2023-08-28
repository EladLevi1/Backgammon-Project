import { Component } from '@angular/core';
import GameInvitation from 'src/app/models/gameInvitation.model';
import Profile from 'src/app/models/profile.model';
import { ConnectionSocketIoService } from 'src/app/services/connectionsocket-service/connection-socket-io.service';
import { GameInvitationSocketIoService } from 'src/app/services/gameinvitationsocket-service/game-invitation-socket-io.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import { GameInvitationService } from 'src/app/services/gameinvitation-service/game-invitation.service';
import { FriendsSocketIoService } from 'src/app/services/friendssocket-service/friends-socket-io.service';

@Component({
  selector: 'app-play-with-friend',
  templateUrl: './play-with-friend.component.html',
  styleUrls: ['./play-with-friend.component.css']
})
export class PlayWithFriendComponent {
  profile: Profile = new Profile();
  onlineFriends: Profile[] = [];
  gameInvitations: GameInvitation[] = [];
  sentInvitations: GameInvitation[] = [];
  receivedInvitations: GameInvitation[] = [];
  inviteSent: { [key: string]: boolean } = {};
  currentTab: 'friends' | 'sent' | 'received' = 'friends';
  error: string = '';

  constructor(private connectionSocketIO: ConnectionSocketIoService, private profileService: ProfileService,
              private gameInvitationSocketIO: GameInvitationSocketIoService, private gameInvitationService: GameInvitationService,
              private friendsSocketIO: FriendsSocketIoService) {}

  ngOnInit() {
    this.loadProfileData();
    this.handleSocketEvents();
  }

  loadProfileData() {
    this.profileService.getProfileByToken().subscribe(profile => {
      this.profile = profile;
      this.profileService.getProfileFriends(this.profile._id).subscribe(friends => {
        this.connectionSocketIO.getOnlineProfiles().subscribe(onlineProfiles => {
          this.onlineFriends = onlineProfiles.filter(onlineProfile =>
            friends.some(friend => friend._id === onlineProfile._id)
          );
        });
      });

      this.gameInvitationService.getGameInvitationsForProfile(this.profile._id).subscribe(gameInvitations => {
        this.gameInvitations = gameInvitations;
        this.gameInvitations.forEach(invitation => {
          if (invitation.sender._id === this.profile._id) {
            this.sentInvitations.push(invitation);
          } else {
            this.receivedInvitations.push(invitation);
          }
        });
      });
    }, error => {
      console.log(error.error);
    });
  }

  handleSocketEvents() {
    this.connectionSocketIO.onProfileOffline().subscribe((p) => {
      this.onlineFriends = this.onlineFriends.filter(profile => profile._id !== p._id);
    });

    this.connectionSocketIO.onProfileOnline().subscribe((p) => {
      if (this.profile.friends.some(friendId => String(friendId) === p._id)) {
        this.onlineFriends.push(p);
      }
    });

    this.friendsSocketIO.onFriendRequestAccepted().subscribe((req) => {
      this.profileService.getProfileById(req.recipient).subscribe((profile) => {
        this.onlineFriends.push(profile);
      })
    });

    this.friendsSocketIO.onFriendRemoved().subscribe((friendId) => {
      this.onlineFriends = this.onlineFriends.filter(profile => profile._id !== friendId);
    });
  }

  inviteToPlay(friend: Profile) {
    const inv = new GameInvitation();
    inv.sender = this.profile;
    inv.recipient = friend;
    this.gameInvitationService.sendGameInvitation(inv).subscribe(invitation => {
      this.gameInvitationSocketIO.sendGameInvitation(invitation);
      this.sentInvitations.push(invitation);
    },
    (error) => {
      console.log(error.error);
    });
  }
}