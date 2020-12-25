import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from './modules/auth/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {

  authenticated: boolean;
  email: string;
  username: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.authenticated = this.authService.isAuthenticated();
      this.email = this.authService.getUserEmail();
      this.username = this.authService.getUsername();
    }, 1000);
  }

}
