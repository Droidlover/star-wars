import { Observable, interval } from 'rxjs';
import { Constants } from './../constants/Constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {

  private isUserLoggedIn = false;
  numOfSearched = 0;
  timer: Observable<number>;
  timerSubs;
  loggedInUser;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.timer = interval(60000);
    this.timerSubs = this.timer.subscribe((val) => {
      this.numOfSearched = 0;
    });
  }


  checkCredentials(id) {
    const chaDetailsUrl = Constants.api.prefix + Constants.api.charDetails + id;
    return this.http.get(chaDetailsUrl);
  }

  getCharacters() {
    const allCharsUrl = Constants.api.prefix + Constants.api.charDetails;
    return this.http.get(allCharsUrl);
  }

  isLoggedIn() {
    return this.isUserLoggedIn;
  }

  getNextUsers(url) {
    return this.http.get(url);
  }

  setLoginStatus(isLoggesIn) {
    this.isUserLoggedIn = isLoggesIn;
  }

  getPlanets() {
    const allPlanetsUrl = Constants.api.prefix + Constants.api.planetDetails;
    return this.http.get(allPlanetsUrl);
  }
  getNextPlanets(url) {
    return this.http.get(url);
  }

  logOut() {
    this.setLoginStatus(false);
    this.router.navigate(['login']);
  }
}
