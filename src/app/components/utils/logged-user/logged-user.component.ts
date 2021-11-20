import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-logged-user',
  templateUrl: './logged-user.component.html',
})
export class LoggedUserComponent implements OnInit {
  username: string | null = '';
  email: string | null = '';

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.username = this.authenticationService.getUsername();
    this.email = this.authenticationService.getEmail();
  }
}
