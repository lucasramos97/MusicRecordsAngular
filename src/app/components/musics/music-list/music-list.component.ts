import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { Music } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  providers: [MessageService]
})
export class MusicListComponent implements OnInit, OnDestroy {

  username: string | null = '';
  email: string | null = '';

  musics: Music[] = [];
  totalRecords = 0;
  loading = true;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private authenticationService: AuthenticationService,
    private musicService: MusicService,
    private messageService: MessageService
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
          error: (err) => this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message
          })
        }));
    }, 1000);
  }

}
