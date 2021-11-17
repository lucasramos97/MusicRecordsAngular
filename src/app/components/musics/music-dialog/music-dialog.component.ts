import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Music } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';
import Messages from 'src/app/utils/Messages';

@Component({
  selector: 'app-music-dialog',
  templateUrl: './music-dialog.component.html'
})
export class MusicDialogComponent implements OnInit, OnDestroy {

  @Output() onSaveSuccess = new EventEmitter<boolean>();

  music = this.createMusic();
  submitted = false;
  spinLoader = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private musicService: MusicService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  actionSave() {
    if (this.validMusic()) {
      this.spinLoader = true;
      this.saveMusic();
    } else {
      this.submitted = true;
    }
  }

  private createMusic(): Music {
    return {
      title: '',
      artist: '',
      release_date: '',
      duration: '',
      feat: false
    };
  }

  private validMusic(): boolean {

    const allRequiredFields = Boolean(this.music.title && this.music.artist && this.music.release_date && this.music.duration);
    if (!allRequiredFields) {
      return false;
    }

    const releaseDate = new Date(`${this.submittedReleaseDate(this.music.release_date)}T00:00:00`);
    if (Number.isNaN(releaseDate.getDate())) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.getInvalidDate(this.music.release_date) })
      return false;
    }

    if (releaseDate > new Date()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.RELEASE_DATE_CANNOT_BE_FUTURE })
      return false;
    }

    const duration = new Date(`2021-01-01T00:${this.music.duration}`);
    if (Number.isNaN(duration.getDate())) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.getInvalidTime(this.music.duration) })
      return false;
    }

    return true;
  }

  private submittedReleaseDate(releaseDate: string): string {

    const splitReleaseDate = releaseDate.split('/');
    const day = splitReleaseDate[0];
    const month = splitReleaseDate[1];
    const year = splitReleaseDate[2];

    return `${year}-${month}-${day}`;
  }

  private submittedDuration(duration: string): string {
    return `00:${duration}`;
  }

  private submittedNumberViews(numberViews: number | undefined): number {
    if (numberViews) {
      return numberViews;
    }

    return 0;
  }

  private submittedMusic(music: Music): Music {
    return {
      title: music.title,
      artist: music.artist,
      release_date: this.submittedReleaseDate(music.release_date),
      duration: this.submittedDuration(this.music.duration),
      number_views: this.submittedNumberViews(this.music.number_views),
      feat: music.feat
    }
  }

  private saveMusic() {
    const submittedMusic = this.submittedMusic(this.music);
    this.subscriptions.push(this.musicService.save(submittedMusic)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinLoader = false;
        }))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: Messages.MUSIC_SUCCESSFULLY_ADDED });
          this.music = this.createMusic();
          this.onSaveSuccess.emit(true);
        },
        error: (err: HttpErrorResponse) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
      }));
  }

}
