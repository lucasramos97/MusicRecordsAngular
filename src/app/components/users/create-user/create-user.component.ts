import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { User } from 'src/app/interfaces/all';
import { UserService } from 'src/app/services/user.service';
import Messages from 'src/app/utils/Messages';
import StringUtils from 'src/app/utils/StringUtils';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit, OnDestroy {

  @Output() onCreateSuccess = new EventEmitter<boolean>();

  user: User = {
    username: '',
    email: '',
    password: ''
  };
  submitted = false;
  spinLoader = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  actionCreate() {
    if (this.validUser()) {
      this.spinLoader = true;
      this.subscriptions.push(this.userService.create(this.user)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.spinLoader = false;
          }))
        .subscribe({
          next: () => this.onCreateSuccess.emit(true),
          error: (err: HttpErrorResponse) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        })
      );
    } else {
      this.submitted = true;
    }
  }

  private validUser() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      return false;
    }

    if (!StringUtils.validEmail(this.user.email)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.EMAIL_INVALID });
      return false;
    }

    return true;
  }

}
