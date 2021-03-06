import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FormValidation } from 'src/app/interfaces/FormValidation';
import { BehaviorSubjectService } from 'src/app/services/behavior-subject/behavior-subject.service';
import { ComponentUtils } from 'src/app/utils/ComponentUtils';
import { USER_CREATED_SUCCESSFULLY } from 'src/app/utils/Consts';
import { ValidatorUtils } from 'src/app/utils/ValidatorUtils';
import { User } from '../model/User';
import { AuthService } from '../service/auth.service';

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
  private validatorUtils: ValidatorUtils;
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
    this.validatorUtils = new ValidatorUtils();
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
    }
  }

  validFields(): boolean {
    let valid = true;

    for (let [key, value] of Object.entries(this.user)) {
      if (!value) {
        this.addInputFieldRequired(key);
        valid = false;
      } else {
        this.clearInputFieldRequired(key);
      }
    }

    if (valid && !this.confirmPassword) {
      this.addInputFieldRequired('confirmPassword');
      valid = false;
    } else {
      this.clearInputFieldRequired('confirmPassword');
    }

    if (valid && this.validatorUtils.isNotEmail(this.user.email)) {
      this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Valid E-Mail format is required!' }];
      valid = false;
    }

    if (valid && this.confirmPassword !== this.user.password) {
      this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Passwords must be the same!' }];
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
