import { Component } from '@angular/core';
import GameInvitation from 'src/app/models/gameInvitation.model';
import Profile from 'src/app/models/profile.model';
import { ConnectionSocketIoService } from 'src/app/services/connectionsocket-service/connection-socket-io.service';
import { GameInvitationSocketIoService } from 'src/app/services/gameinvitationsocket-service/game-invitation-socket-io.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import { GameInvitationService } from 'src/app/services/gameinvitation-service/game-invitation.service';
import { FriendsSocketIoService } from 'src/app/services/friendssocket-service/friends-socket-io.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private connectionSocketIO: ConnectionSocketIoService, private profileService: ProfileService,
              private gameInvitationSocketIO: GameInvitationSocketIoService, private gameInvitationService: GameInvitationService,
              private friendsSocketIO: FriendsSocketIoService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.profileService.getProfileByToken().subscribe(profile => {
      this.profile = profile;

      this.connectionSocketIO.getOnlineProfiles().subscribe(onlineProfiles => {
        this.onlineFriends = onlineProfiles.filter(onlineProfile =>
          this.profile.friends.some(friend => friend._id === onlineProfile._id)
        );
      },
      (error) => {
        console.log(error.error);
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
      },
      (error) => {
        console.log(error.error)
      });
    }, error => {
      console.log(error.error);
    });

    this.connectionSocketIO.onProfileOffline().subscribe((p) => {
      this.onlineFriends = this.onlineFriends.filter(profile => profile._id !== p._id);

      for (const inv of this.gameInvitations) {

        if (inv.recipient._id === p._id || inv.sender._id === p._id) {

          this.gameInvitationService.deleteGameInvitation(inv._id).subscribe((updatedInvitations) => {

            this.gameInvitations = updatedInvitations;

          });

          this.sentInvitations = this.sentInvitations.filter(i => i._id !== inv._id);
          this.receivedInvitations = this.receivedInvitations.filter(i => i._id !== inv._id);
        }
      }
    });

    this.connectionSocketIO.onProfileOnline().subscribe((p) => {
      if (this.profile.friends.some(friend => friend._id === p._id)) {
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

    this.gameInvitationSocketIO.onGameInvitationReceived().subscribe((invitation) => {
      this.gameInvitationService.getGameInvitationById(invitation._id).subscribe((inv) => {
        this.receivedInvitations.push(inv);
        this.gameInvitations.push(inv);
      })
    });

    this.gameInvitationSocketIO.onGameInvitationRejected().subscribe((inv) => {
      this.sentInvitations = this.sentInvitations.filter(i => i._id !== inv._id)
      this.gameInvitations = this.gameInvitations.filter(i => i._id !== i._id)
    })
  }

  inviteToPlay(friend: Profile) {
    const inv = new GameInvitation();
    inv.sender = this.profile;
    inv.recipient = friend;
    this.gameInvitationService.sendGameInvitation(inv).subscribe(invitation => {
      this.gameInvitationSocketIO.sendGameInvitation(invitation);
      invitation.recipient = friend;
      invitation.sender = this.profile;
      this.sentInvitations.push(invitation);
      this.gameInvitations.push(invitation)

      this.snackBar.open('You have invited your friend to play!', 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    },
    (error) => {
      // console.log(error.error);
      this.snackBar.open(`${error.error}`, 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
  }

  acceptInvitation(invitation : GameInvitation){
    
  }

  rejectInvitation(invitation : GameInvitation){
    this.gameInvitationService.updateGameInvitation(invitation._id, 'rejected').subscribe((inv) => {
      this.gameInvitationSocketIO.rejectGameInvitation(inv);
      this.receivedInvitations = this.receivedInvitations.filter(i => i._id !== inv._id)
      this.gameInvitations = this.gameInvitations.filter(i => i._id !== inv._id)
    })
  }
}