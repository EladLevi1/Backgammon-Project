import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class LogRegGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.userService.getToken();
    if (token) {
      this.router.navigate(['']);
      return false;
    } else {
      return true;
    }
  }
}
