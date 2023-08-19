import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import friendRequest from 'src/app/models/friendRequest.model';  // Ensure this path is correct.
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import { FriendRequestService } from 'src/app/services/friendrequest-service/friend-request.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent {
  friends: Profile[] = [];
  friendRequests: friendRequest[] = [];  // For storing friend requests.
  profile: Profile = new Profile();
  nicknameToAdd: string = '';
  error: string = '';
  sentRequests: friendRequest[] = [];
  receivedRequests: friendRequest[] = [];


  constructor(private profileService: ProfileService, private friendRequestService: FriendRequestService) {}

  ngOnInit() {
    this.profileService.getProfileByToken().subscribe((p) => {
      this.profile = p;
      this.friends = this.profile.friends;
    },
    (error) => {
      console.log(error.error);
    });

    // Fetching the friend requests for the profile.
    this.friendRequestService.getFriendRequestsForProfile(this.profile._id).subscribe(
      (requests) => {
        this.friendRequests = requests;
      },
      (error) => {
        console.log('Error fetching friend requests:', error);
      }
    );
  }

  addFriendByNickname() {
    this.profileService.getProfileByNickname(this.nicknameToAdd).subscribe(
      profile => {
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
            console.log('Friend request sent successfully!', res);
          },
          error => {
            console.log('Error sending friend request:', error);
            this.error = 'Error sending friend request.';
          }
        );
      },
      error => {
        console.log('Error fetching profile by nickname:', error);
        this.error = 'Profile not found or some other error occurred.';
      }
    );
  }
}
