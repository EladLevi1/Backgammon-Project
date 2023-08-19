import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.userService.getToken();
    if (token) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
