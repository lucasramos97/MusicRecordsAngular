import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
  declarations: [LoginComponent, CreateUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    MessagesModule,
    MessageModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CheckboxModule
  ],
  exports: [LoginComponent]
})
export class AuthModule { }
