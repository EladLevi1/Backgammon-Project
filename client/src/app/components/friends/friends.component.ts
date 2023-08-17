import { Component } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent {
  friends: any[] = [];
  incomingRequests: any[] = [];

  // constructor(private friendService: FriendService) {}

  // ngOnInit(): void {
  //   this.loadFriends();
  //   this.loadFriendRequests();
  // }

  // loadFriends(): void {
  //   this.friendService.getFriends().subscribe(data => {
  //     this.friends = data;
  //   });
  // }

  // loadFriendRequests(): void {
  //   this.friendService.getFriendRequests().subscribe(data => {
  //     this.incomingRequests = data;
  //   });
  // }

  // acceptFriendRequest(requestId: string): void {
  //   this.friendService.acceptFriendRequest(requestId).subscribe(response => {
  //     // After accepting, remove this request from the list
  //     this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId);
      
  //     // Optionally, update the friends list if the response provides the updated data
  //     if (response.newFriend) {
  //       this.friends.push(response.newFriend);
  //     }
  //   });
  // }

  // rejectFriendRequest(requestId: string): void {
  //   this.friendService.rejectFriendRequest(requestId).subscribe(() => {
  //     // After rejecting, remove this request from the list
  //     this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId);
  //   });
  // }
}