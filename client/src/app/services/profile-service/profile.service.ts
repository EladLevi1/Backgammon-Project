import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import { UserService } from '../user-service/user.service';
import { Observable, switchMap } from 'rxjs';
import User from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = 'http://localhost:8080/backgammon/profiles/'

  constructor(private httpClient : HttpClient, private userService: UserService) { }

  getProfiles() {
    return this.httpClient.get<Profile[]>(this.url);
  }

  getProfileById(_id: string) {
    return this.httpClient.get<Profile>(this.url + _id);
  }

  getProfileByNickname(nickname: string): Observable<Profile> {
    return this.httpClient.get<Profile>(this.url + nickname);
  }

  getProfileByUserId(userId: string) {
    return this.httpClient.get<Profile>(this.url + 'user/' + userId);
  }

  getProfileFriends(_id: string) {
    return this.httpClient.get<Profile[]>(this.url + _id + '/friends');
  }

  postProfile(profile: Profile) {
    return this.httpClient.post<Profile>(this.url, profile);
  }

  deleteProfile(_id: String) {
    return this.httpClient.delete(this.url + _id);
  }

  putProfile(profile: Profile) {
    return this.httpClient.put<Profile>(this.url + profile._id, profile);
  }

  getProfileByToken(): Observable<Profile> {
    return this.userService.getUserByToken().pipe(
      switchMap(user => this.getProfileByUserId(user._id))
    );
  }
  
}
