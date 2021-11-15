import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Login } from 'src/app/interfaces/all';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import StringUtils from 'src/app/utils/StringUtils';

@Component({
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {

  login: Login = {
    email: '',
    password: ''
  };
  submitted = false;
  spinLoader = false;
  createUserDialog = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  actionLogin() {
    if (this.validUser()) {
      this.spinLoader = true;
      this.subscriptions.push(this.userService.login(this.login)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.spinLoader = false;
          }))
        .subscribe({
          next: (authenticable) => {
            this.authenticationService.setUser(authenticable);
            this.router.navigateByUrl('/musics');
          },
          error: (err) => this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message
          })
        }));
    } else {
      this.submitted = true;
    }
  }

  openCreateUser() {
    this.createUserDialog = true;
  }

  private validUser() {
    if (!this.login.email || !this.login.password) {
      return false;
    }

    if (!StringUtils.validEmail(this.login.email)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'E-mail invalid!' });
      return false;
    }

    return true;
  }

}
