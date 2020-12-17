import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/service/auth.service';
import { ExchangeMessages } from './exchange-messages/ExchangeMessages';
import { BehaviorSubjectService } from './musics/service/behavior-subject/behavior-subject.service';
import { SUCCESSFULLY_AUTHENTICATED, AUTHENTICATED_ERROR, LOGOUT } from './utils/Consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ExchangeMessages, OnInit, OnDestroy {

  authenticated: boolean;
  private subscriptions: Array<Subscription>;

  constructor(
    private authService: AuthService, 
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.subscriptions = new Array<Subscription>();
    if (this.authService.getToken()) {
      this.subscriptions.push(this.authService.test().subscribe(
        () => this.authenticated = true,
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
      }
      if (message === LOGOUT) {
        this.authenticated = false;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
