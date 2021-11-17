import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { Music } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';
import NeedAuthenticated from '../../base/NeedAuthenticated';

@Component({
  selector: 'app-deleted-music-list',
  templateUrl: './deleted-music-list.component.html'
})
export class DeletedMusicListComponent extends NeedAuthenticated implements OnInit, OnDestroy {

  musics: Music[] = [];
  totalRecords = 0;
  loading = true;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private musicService: MusicService,
    private messageService: MessageService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadMusics(event: LazyLoadEvent) {
    this.loading = true;
    const page = event.first! / event.rows! + 1;

    setTimeout(() => {
      this.subscriptions.push(this.musicService.getAllDeleted(page, event.rows)
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
            if (this.handlerSessionExpired(err)) {
              return;
            }

            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
          }
        })
      );
    }, 1000);
  }

  goToMusicList() {
    this.router.navigateByUrl('/musics');
  }

}
