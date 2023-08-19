import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import friendRequest from 'src/app/models/friendRequest.model';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {
  private url = 'http://localhost:8080/backgammon/friendrequests/';

  constructor(private httpClient: HttpClient) { }
  
  getAllFriendRequests(){
    return this.httpClient.get<friendRequest[]>(this.url);
  }

  getFriendRequestsForProfile(profileId: string) {
    return this.httpClient.get<friendRequest[]>(this.url + '/profile/' + profileId);
  }

  sendFriendRequest(request: friendRequest) {
    return this.httpClient.post<friendRequest>(this.url, request);
  }

  deleteFriendRequest(requestId: string) {
    return this.httpClient.delete<friendRequest>(this.url + requestId);
  }
}
