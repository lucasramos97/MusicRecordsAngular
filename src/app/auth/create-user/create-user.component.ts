import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from 'primeng/api';

import { User } from '../model/User';
import { AuthService } from '../service/auth.service';
import { FormValidation } from 'src/app/form/FormValidation';
import { BehaviorSubjectService } from 'src/app/musics/service/behavior-subject/behavior-subject.service';
import { ComponentUtils } from 'src/app/utils/ComponentUtils';
import { USER_CREATED_SUCCESSFULLY } from 'src/app/utils/Consts';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements FormValidation, OnInit, OnDestroy {

  user: User;
  confirmPassword: string;
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
    this.confirmPassword = "";
    this.loader = false;
    this.requiredStyle = new Map<string, string>();
    this.requiredFields = new Map<string, string>();
    this.componentUtils = new ComponentUtils();
    this.subscriptions = new Array<Subscription>();
  }

  showDialog(): void {
    this.clearAllInputFieldsRequired();
    this.user = new User();
    this.confirmPassword = "";
  }

  createUser(): void {
    if (this.validFields()) {
      if (this.confirmPassword === this.user.password) {
        this.loader = true;
        this.subscriptions.push(this.authService.create(this.user).subscribe(
          () => {
            this.loader = false;
            this.behaviorSubjectService.sendMessage(USER_CREATED_SUCCESSFULLY);
          },
          res => {
            this.loader = false;
            this.msgs = [{ severity: 'error', summary: 'Error', detail: res.error.message }];
          }));
      } else {
        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Passwords must be the same!' }];
      }
    }
  }

  validFields(): boolean {
    let valid: boolean = true;

    for (let [key, value] of Object.entries(this.user)) {
      if (!value) {
        this.addInputFieldRequired(key);
        valid = false;
      } else {
        this.clearInputFieldRequired(key);
      }
    }

    let emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
    if (!emailRegex.test(this.user.email)) {
      this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Valid E-Mail format is required!' }];
      valid = false;
    }

    if (!this.confirmPassword) {
      this.addInputFieldRequired('confirmPassword');
      valid = false;
    } else {
      this.clearInputFieldRequired('confirmPassword');
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

  clearAllInputFieldsRequired(): void {
    for (let key of Object.keys(this.user)) {
      this.clearInputFieldRequired(key);
    }
    this.clearInputFieldRequired('confirmPassword');
  }

  seePasswords(checked: boolean): void {

    let passwordCreate = <HTMLButtonElement>document.getElementById('passwordCreate');
    let confirmPassword = <HTMLButtonElement>document.getElementById('confirmPassword');

    if (checked) {
      passwordCreate.type = 'text';
      confirmPassword.type = 'text';
    } else {
      passwordCreate.type = 'password';
      confirmPassword.type = 'password';
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
