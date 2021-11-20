import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { IUser } from 'src/app/interfaces/all';
import { UserService } from 'src/app/services/user.service';
import Messages from 'src/app/utils/Messages';
import StringUtils from 'src/app/utils/StringUtils';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  user: IUser = {
    username: '',
    email: '',
    password: '',
  };

  submitted = false;
  spinLoader = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  actionCreateUser() {
    if (this.validUser()) {
      this.spinLoader = true;
      this.subscriptions.push(
        this.userService
          .create(this.user)
          .pipe(
            finalize(() => {
              this.submitted = false;
              this.spinLoader = false;
            })
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successfully',
                detail: Messages.USER_SUCCESSFULLY_CREATE,
              });
              this.visibleChange.emit(false);
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

  onHide() {
    this.visibleChange.emit(false);
  }

  private validUser() {
    const allRequiredFields = Boolean(
      this.user.username && this.user.email && this.user.password
    );
    if (!allRequiredFields) {
      return false;
    }

    if (!StringUtils.validEmail(this.user.email)) {
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
