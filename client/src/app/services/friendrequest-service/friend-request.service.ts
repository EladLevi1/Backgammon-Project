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

  getFriendRequestById(id : string) {
    return this.httpClient.get<friendRequest>(this.url + id);
  }

  getFriendRequestsForProfile(profileId: string) {
    return this.httpClient.get<friendRequest[]>(this.url + 'profile/' + profileId);
  }

  sendFriendRequest(request: friendRequest) {
    return this.httpClient.post<friendRequest>(this.url, request);
  }

  updateFriendRequest(requestId: string, status: 'accepted' | 'rejected') {
    const requestBody = { status: status };
    return this.httpClient.put<friendRequest>(this.url + requestId, requestBody);
  }

  deleteFriendRequest(requestId: string) {
    return this.httpClient.delete<friendRequest>(this.url + requestId);
  }
}