import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
})
export class SessionExpiredComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onShow() {
    this.authenticationService.logout();
  }

  onHide() {
    this.visibleChange.emit(false);
    this.router.navigateByUrl('/login');
  }
}
