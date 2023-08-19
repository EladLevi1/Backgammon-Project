import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email : string = '';
  password : string = '';

  constructor(private userService: UserService, private router : Router){}

  onSubmit() {
    this.userService.loginUser(this.email, this.password).subscribe(
      (data: any) => {
        this.userService.storeToken(data.token);
        window.location.reload();
      },
      error => {
        alert(error.error);
      }
    );
  }
}
