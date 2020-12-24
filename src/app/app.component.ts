import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './modules/auth/service/auth.service';
import { BehaviorSubjectService } from './services/behavior-subject/behavior-subject.service';
import { AUTHENTICATED_ERROR } from './utils/Consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {

  authenticated: boolean;
  email: string;
  username: string;
  private subscriptions: Array<Subscription>;

  constructor(
    private authService: AuthService,
    private behaviorSubjectService: BehaviorSubjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscriptions = new Array<Subscription>();
    if (this.authService.getToken()) {
      this.subscriptions.push(this.authService.test().subscribe(
        () => {
          this.authService.setExpiredToken(false);
        },
        res => {
          this.authService.setExpiredToken(true);
          this.behaviorSubjectService.sendMessage(`${AUTHENTICATED_ERROR}${res.error.message}`);
          this.router.navigateByUrl('/login');
        }
      ));
    }
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.authenticated = this.authService.isAuthenticated();
      this.email = this.authService.getUserEmail();
      this.username = this.authService.getUsername();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
