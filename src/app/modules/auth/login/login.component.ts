import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExchangeMessages } from 'src/app/interfaces/ExchangeMessages';
import { FormValidation } from 'src/app/interfaces/FormValidation';
import { BehaviorSubjectService } from 'src/app/services/behavior-subject/behavior-subject.service';
import { ComponentUtils } from 'src/app/utils/ComponentUtils';
import { AUTHENTICATED_ERROR, USER_CREATED_SUCCESSFULLY } from 'src/app/utils/Consts';
import { ValidatorUtils } from 'src/app/utils/ValidatorUtils';
import { User } from '../model/User';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements FormValidation, ExchangeMessages, OnInit, OnDestroy {

  private readonly FIELDS_NOT_REQUIRED: Array<string> = ['name'];

  user: User;
  displayCreateUser: boolean;
  msgs: Array<Message>;
  loader: boolean;
  requiredStyle: Map<string, string>;
  requiredFields: Map<string, string>;
  private validatorUtils: ValidatorUtils;
  private componentUtils: ComponentUtils;
  private subscriptions: Array<Subscription>;

  constructor(
    private authService: AuthService,
    private behaviorSubjectService: BehaviorSubjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = new User();
    this.displayCreateUser = false;
    this.loader = false;
    this.requiredStyle = new Map<string, string>();
    this.requiredFields = new Map<string, string>();
    this.validatorUtils = new ValidatorUtils();
    this.componentUtils = new ComponentUtils();
    this.subscriptions = new Array<Subscription>();
    this.listenMessages();
  }

  listenMessages(): void {
    this.subscriptions.push(this.behaviorSubjectService.listenMessage().subscribe(message => {
      if (message === USER_CREATED_SUCCESSFULLY) {
        this.displayCreateUser = false;
        this.msgs = [{ severity: 'success', summary: 'Success', detail: 'User created successfully!' }];
      }
      if (message.startsWith(AUTHENTICATED_ERROR)) {
        let errorMessage = message.substr(AUTHENTICATED_ERROR.length);
        if (errorMessage !== 'undefined') {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: errorMessage }];
        } else {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Server not reached!' }];
        }
      }
    }));
  }

  loginUser(): void {
    if (this.validFields()) {
      this.loader = true;
      this.authService.logout();
      this.subscriptions.push(this.authService.login(this.user).subscribe(
        res => {
          this.loader = false;
          this.authService.setUserEmail(this.user.email);
          this.authService.setToken(res.message);
          this.authService.setUsername(res.username);
          this.authService.setExpiredToken(false);
          this.router.navigateByUrl('/musics');
        },
        res => {
          this.loader = false;
          this.msgs = [{ severity: 'error', summary: 'Error', detail: res.error.message }];
        }
      ));
    }
  }

  validFields(): boolean {
    let valid = true;

    for (let [key, value] of Object.entries(this.user)) {
      if (!value && this.FIELDS_NOT_REQUIRED.indexOf(key) === -1) {
        this.addInputFieldRequired(key);
        valid = false;
      } else {
        this.clearInputFieldRequired(key);
      }
    }

    if (valid && this.validatorUtils.isNotEmail(this.user.email)) {
      this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Valid E-Mail format is required!' }];
      valid = false;
    }

    return valid;
  }

  addInputFieldRequired(field: string): void {
    let capitalizedField = this.componentUtils.capitalizeField(field);
    this.changeTextFieldRequired(field, `${capitalizedField} is required!`, 'p-invalid');
  }

  clearInputFieldRequired(field: string): void {
    this.changeTextFieldRequired(field, '', '');
  }

  changeTextFieldRequired(field: string, value: string, cssClass: string): void {
    this.requiredFields.set(field, value);
    this.requiredStyle.set(field, cssClass);
  }

  clearAllInputFieldsRequired(): void { }

  showCreateUser(): void {
    this.displayCreateUser = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
