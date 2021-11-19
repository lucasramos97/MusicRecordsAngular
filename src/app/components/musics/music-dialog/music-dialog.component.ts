import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { MusicService } from 'src/app/services/music.service';
import Messages from 'src/app/utils/Messages';
import MusicFactory from 'src/app/utils/MusicFactory';
import DateUtils from 'src/app/utils/DateUtils';

@Component({
  selector: 'app-music-dialog',
  templateUrl: './music-dialog.component.html'
})
export class MusicDialogComponent implements OnInit, OnDestroy {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = '';
  @Input() music = MusicFactory.createDefaultMusic();
  @Output() onSuccess = new EventEmitter<boolean>();

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
      if (this.music.id) {
        this.editMusic();
      } else {
        this.saveMusic();
      }
    } else {
      this.submitted = true;
    }
  }

  onHide() {
    this.visibleChange.emit(false);
  }

  private validMusic(): boolean {

    const allRequiredFields = Boolean(this.music.title && this.music.artist && this.music.release_date && this.music.duration);
    if (!allRequiredFields) {
      return false;
    }

    const releaseDate = DateUtils.createReleaseDate(this.music.release_date);
    if (Number.isNaN(releaseDate.getDate())) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.getInvalidDate(this.music.release_date) })
      return false;
    }

    if (releaseDate > new Date()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.RELEASE_DATE_CANNOT_BE_FUTURE })
      return false;
    }

    const duration = DateUtils.createDuration(this.music.duration);
    if (Number.isNaN(duration.getDate())) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: Messages.getInvalidTime(this.music.duration) })
      return false;
    }

    return true;
  }

  private saveMusic() {
    const submittedMusic = MusicFactory.createSubmittedMusic(this.music);
    this.subscriptions.push(this.musicService.save(submittedMusic)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinLoader = false;
        }))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: Messages.MUSIC_SUCCESSFULLY_ADDED });
          this.music = MusicFactory.createDefaultMusic();
          this.onSuccess.emit(true);
        },
        error: (err: HttpErrorResponse) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
      })
    );
  }

  private editMusic() {
    const submittedMusic = MusicFactory.createSubmittedMusic(this.music);
    this.subscriptions.push(this.musicService.update(submittedMusic)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.spinLoader = false;
        }))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: Messages.MUSIC_SUCCESSFULLY_EDITED });
          this.onSuccess.emit(true);
        },
        error: (err: HttpErrorResponse) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
      })
    );
  }

}
