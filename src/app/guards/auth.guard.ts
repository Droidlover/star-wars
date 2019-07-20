import { StarWarsService } from './../services/star-wars.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router,RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private starWarsService: StarWarsService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.starWarsService.isLoggedIn()) {
      alert('User not logged in.');
      this.router.navigate(['login']);
    };
    return this.starWarsService.isLoggedIn();
  }

}
