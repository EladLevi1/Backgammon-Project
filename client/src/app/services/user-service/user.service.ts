import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import User from 'src/app/models/user.model';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8080/backgammon/users/'

  constructor(private httpClient : HttpClient) { }

  getUsers() {
    return this.httpClient.get<User[]>(this.url);
  }

  getUserById(_id: string) {
    return this.httpClient.get<User>(this.url + _id);
  }

  postUser(user: User) {
    return this.httpClient.post<User>(this.url, user);
  }

  deleteUser(_id: String) {
    return this.httpClient.delete(this.url + _id);
  }

  putUser(user: User) {
    return this.httpClient.put<User>(this.url + user._id, user);
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
    const token = localStorage.getItem('token');
    if (token){
      const decodedToken: any = jwtDecode(token);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp >= currentTimestamp){
        return token;
      }
      else{
        localStorage.removeItem('token');
      }
    }
    return null;
  }

  getUserByToken(): Observable<User> {
    const token = this.getToken();
    const decodedToken: any = jwtDecode(token as string);
    const userId = decodedToken._id;
    return this.getUserById(userId);
  }
}
