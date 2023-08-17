import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import User from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8080/backgammon/users/'

  constructor(private httpClient : HttpClient) { }

  getUsers() {
    return this.httpClient.get(this.url);
  }

  getUserById(id: string) {
    return this.httpClient.get(this.url + id);
  }

  postUser(user: User) {
    return this.httpClient.post(this.url, user);
  }

  deleteUser(id: String) {
    return this.httpClient.delete(this.url + id);
  }

  putUser(user: User) {
    return this.httpClient.put(this.url + user.id, user);
  }

  loginUser(email: string, password: string) {
    return this.httpClient.post(this.url + 'login', {
      email: email,
      password: password
    });
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
