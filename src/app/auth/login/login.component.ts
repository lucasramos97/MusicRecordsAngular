import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from 'primeng/api';

import { User } from '../model/User';
import { BehaviorSubjectService } from 'src/app/musics/service/behavior-subject/behavior-subject.service';
import { SUCCESSFULLY_AUTHENTICATED, USER_CREATED_SUCCESSFULLY, AUTHENTICATED_ERROR } from 'src/app/utils/Consts';
import { ComponentUtils } from 'src/app/utils/ComponentUtils';
import { FormValidation } from 'src/app/form/FormValidation';
import { ExchangeMessages } from 'src/app/exchange-messages/ExchangeMessages';
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
  private componentUtils: ComponentUtils;
  private subscriptions: Array<Subscription>;

  constructor(
    private authService: AuthService, 
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.user = new User();
    this.displayCreateUser = false;
    this.loader = false;
    this.requiredStyle = new Map<string, string>();
    this.requiredFields = new Map<string, string>();
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
        this.authService.logout();
        this.msgs = [{ severity: 'error', summary: 'Error', detail: message.substr(AUTHENTICATED_ERROR.length) }];
      }
    }));
  }

  loginUser(): void {
    if (this.validFields()) {
      this.loader = true;
      console.log(this.authService.getToken());
      this.subscriptions.push(this.authService.login(this.user).subscribe(
        res => {
          this.loader = false;
          this.authService.setToken(res.message);
          this.behaviorSubjectService.sendMessage(SUCCESSFULLY_AUTHENTICATED);
        },
        res => {
          console.log(res);
          this.loader = false;
          this.msgs = [{ severity: 'error', summary: 'Error', detail: res.error.message }];
        }
      ));
    }
  }

  validFields(): boolean {
    let valid: boolean = true;

    for (let [key, value] of Object.entries(this.user)) {
      if (!value && this.FIELDS_NOT_REQUIRED.indexOf(key) === -1) {
        this.addInputFieldRequired(key);
        valid = false;
      } else {
        this.clearInputFieldRequired(key);
      }
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
