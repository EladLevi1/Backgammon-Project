import { Component, DoCheck } from '@angular/core';
import User from './models/userMonolithic.model';
import { UserService } from './services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  user : User = new User();

  showProfileMenu = false;
  
  ismenurequired: boolean = false;
  
  constructor(private userService: UserService){
    console.log(this.user.image);  
  }
  
  ngDoCheck(): void {
    if (this.userService.getToken() != null) {
      this.ismenurequired = true;
    }
    else{
      this.ismenurequired = false;
    }
  }
  
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }
  
}