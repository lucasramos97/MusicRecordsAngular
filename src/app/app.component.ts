import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExchangeMessages } from './interfaces/ExchangeMessages';
import { AuthService } from './modules/auth/service/auth.service';
import { BehaviorSubjectService } from './modules/musics/service/behavior-subject/behavior-subject.service';
import { AUTHENTICATED_ERROR, LOGOUT, SUCCESSFULLY_AUTHENTICATED } from './utils/Consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ExchangeMessages, OnInit, OnDestroy {

  authenticated: boolean;
  userEmail: string;
  private subscriptions: Array<Subscription>;

  constructor(
    private authService: AuthService,
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.subscriptions = new Array<Subscription>();
    if (this.authService.getToken()) {
      this.subscriptions.push(this.authService.test().subscribe(
        () => {
          this.authenticated = true;
          this.userEmail = this.authService.getUserEmail();
        },
        res => {
          this.authenticated = false;
          this.behaviorSubjectService.sendMessage(`${AUTHENTICATED_ERROR}${res.error.message}`);
        }
      ));
    } else {
      this.authenticated = false;
    }
    this.listenMessages();
  }

  listenMessages(): void {
    this.subscriptions.push(this.behaviorSubjectService.listenMessage().subscribe(message => {
      if (message === SUCCESSFULLY_AUTHENTICATED) {
        this.authenticated = true;
        this.userEmail = this.authService.getUserEmail();
      }
      if (message === LOGOUT) {
        this.authenticated = false;
        this.userEmail = '';
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
