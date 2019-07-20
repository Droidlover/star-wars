import { StarWarsService } from './../../services/star-wars.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });
  private loggedInUser;
  public isSubmitted;
  public isLoading = false;
  constructor(private starWarService: StarWarsService,
    private router: Router) { }

  ngOnInit() {

  }

  getAndCheckUser() {
    this.isLoading = true;
    this.starWarService.getCharacters().subscribe((resp: any) => {
      this.loggedInUser = this.checkCredentials(resp);
      let nextPageUrl = resp.next;
      if (nextPageUrl && !this.loggedInUser) {
        this.getNextUsersAndCheck(resp);
      } else {
        this.isLoading = false;
      }
    });
  }

  getNextUsersAndCheck(resp) {
    if (resp.next && !this.loggedInUser) {
      this.starWarService.getNextUsers(resp.next).subscribe((respNext: any) => {
        this.loggedInUser = this.checkCredentials(resp);
        if (!this.loggedInUser) {
          this.getNextUsersAndCheck(respNext);
        }
      });
    } else {
      this.isLoading = false;
      alert('User Not Found');
    }

  }

  checkCredentials(resp) {
    const loggedInUser = resp.results.filter((ele) => {
      if (ele.name === this.loginForm.value.userName) {
        if (this.loginForm.value.password === ele.birth_year) {
          console.log('loggedIn');
          this.setLoggedInUserAndRedirect();
          return true;
        }
      }
    });
    return loggedInUser[0];
  }
  setLoggedInUserAndRedirect() {
    this.starWarService.setLoginStatus(true);
    alert('Logged In');
  }
  submitAndLogin() {
    this.isSubmitted = true;
    this.getAndCheckUser();
  }
  logout() {
    this.loggedInUser = null;
    this.starWarService.logOut();
  }
  getloggedInUser() {
  return this.loggedInUser;
}
  gotToSearchScreen() {
  this.router.navigate(['search']);
}
}
