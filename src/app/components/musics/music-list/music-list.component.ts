import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { Music } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html'
})
export class MusicListComponent implements OnInit, OnDestroy {

  username: string | null = '';
  email: string | null = '';

  musics: Music[] = [];
  totalRecords = 0;
  loading = true;

  titleMusicDialog = '';
  musicDialog = false;

  sessionExpiredDialog = false;

  private subscriptions: Array<Subscription> = new Array();
  private lastEvent: LazyLoadEvent = {};

  constructor(
    private authenticationService: AuthenticationService,
    private musicService: MusicService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.authenticationService.getUsername();
    this.email = this.authenticationService.getEmail();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadMusics(event: LazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;
    this.lastEvent = event;

    setTimeout(() => {
      this.subscriptions.push(this.musicService.getAll(page, event.rows)
        .pipe(
          finalize(() => {
            this.loading = false;
          }))
        .subscribe({
          next: (pagedMusics) => {
            this.musics = pagedMusics.content;
            this.totalRecords = pagedMusics.total;
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.authenticationService.logout();
              this.sessionExpiredDialog = true;
              return;
            }

            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
          }
        }));
    }, 1000);
  }

  openAdd() {
    this.titleMusicDialog = 'Add Music';
    this.musicDialog = true;
  }

  onSaveSuccess() {
    this.loadMusics(this.lastEvent);
  }

  onHideSessionExpiredDialog() {
    this.sessionExpiredDialog = false;
    this.router.navigateByUrl('/login');
  }

}
