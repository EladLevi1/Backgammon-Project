import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Profile from 'src/app/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = 'http://localhost:8080/backgammon/profiles/'

  constructor(private httpClient : HttpClient) { }

  getProfiles() {
    return this.httpClient.get(this.url);
  }

  getProfileById(_id: string) {
    return this.httpClient.get(this.url + _id);
  }

  postProfile(profile: Profile) {
    return this.httpClient.post(this.url, profile);
  }

  deleteProfile(_id: String) {
    return this.httpClient.delete(this.url + _id);
  }

  putProfile(profile: Profile) {
    return this.httpClient.put(this.url + profile._id, profile);
  }
}
