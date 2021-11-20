import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { ILogin } from 'src/app/interfaces/all';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import Messages from 'src/app/utils/Messages';
import StringUtils from 'src/app/utils/StringUtils';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  login: ILogin = {
    email: '',
    password: '',
  };

  submitted = false;
  spinLoader = false;

  visibleCreateUser = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  actionLogin() {
    if (this.validLogin()) {
      this.spinLoader = true;
      this.subscriptions.push(
        this.userService
          .login(this.login)
          .pipe(
            finalize(() => {
              this.submitted = false;
              this.spinLoader = false;
            })
          )
          .subscribe({
            next: (authenticable) => {
              this.authenticationService.setUser(authenticable);
              this.router.navigateByUrl('/musics');
            },
            error: (err: HttpErrorResponse) =>
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
              }),
          })
      );
    } else {
      this.submitted = true;
    }
  }

  openCreateUser() {
    this.visibleCreateUser = true;
  }

  private validLogin() {
    const allRequiredFields = Boolean(this.login.email && this.login.password);
    if (!allRequiredFields) {
      return false;
    }

    if (!StringUtils.validEmail(this.login.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: Messages.EMAIL_INVALID,
      });
      return false;
    }

    return true;
  }
}
