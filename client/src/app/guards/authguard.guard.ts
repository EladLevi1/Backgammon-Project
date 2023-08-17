import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): boolean {
  //   if (this.userService.getToken() != null) {
  //     this.router.navigate(['']);
  //     return true;
  //   } else {
  //     this.router.navigate(['login']);
  //     return false;
  //   }
  // }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.userService.getToken() != null) {
      if (state.url.includes('login') || state.url.includes('register')) {
        this.router.navigate(['']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
