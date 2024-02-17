import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, createUrlTreeFromSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs";
import { AuthenticationService } from "src/services/authentication.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: AuthenticationService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService
      .isAuthenticated() ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])

  }
}
