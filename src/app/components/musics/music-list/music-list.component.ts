import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { IMusic } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';
import MusicFactory from 'src/app/utils/MusicFactory';
import NeedAuthenticated from '../../base/NeedAuthenticated';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html'
})
export class MusicListComponent extends NeedAuthenticated implements OnInit, OnDestroy {

  musics: IMusic[] = [];
  totalRecords = 0;
  loading = true;

  titleMusicDialog = '';
  visibleMusicDialog = false;
  music = MusicFactory.createDefaultMusic();

  visibleDeleteMusic = false;
  musicToDelete = MusicFactory.createDefaultMusic();

  countDeletedMusics = 0;

  logoutDialog = false;

  private subscriptions: Array<Subscription> = new Array();
  private lastEvent: LazyLoadEvent = {};

  constructor(
    private musicService: MusicService,
    private messageService: MessageService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadCountDeletedMusics();
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
            if (this.handlerSessionExpired(err)) {
              return;
            }

            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
          }
        })
      );
    }, 1000);
  }

  openAdd() {
    this.music = MusicFactory.createDefaultMusic();
    this.titleMusicDialog = 'Add Music';
    this.visibleMusicDialog = true;
  }

  openEdit(music: IMusic) {
    this.music = MusicFactory.createEditMusic(music);
    this.titleMusicDialog = 'Edit Music';
    this.visibleMusicDialog = true;
  }

  onMusicDialogSuccess() {
    this.loadMusics(this.lastEvent);
  }

  openDelete(music: IMusic) {
    this.musicToDelete = music;
    this.visibleDeleteMusic = true;
  }

  onDeleteMusicSuccess() {
    this.loadCountDeletedMusics();
    this.loadMusics(this.lastEvent);
  }

  loadCountDeletedMusics() {
    this.subscriptions.push(this.musicService.countDeleted()
      .subscribe({
        next: (total) => this.countDeletedMusics = total,
        error: (err: HttpErrorResponse) => {
          if (this.handlerSessionExpired(err)) {
            return;
          }

          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        }
      })
    );
  }

  goToDeletedMusicList() {
    this.router.navigateByUrl('/musics/deleted');
  }

  openLogout() {
    this.logoutDialog = true;
  }

}
