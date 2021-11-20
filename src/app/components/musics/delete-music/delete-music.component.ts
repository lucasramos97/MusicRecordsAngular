import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { MusicService } from 'src/app/services/music.service';
import Messages from 'src/app/utils/Messages';
import MusicFactory from 'src/app/utils/MusicFactory';

@Component({
  selector: 'app-delete-music',
  templateUrl: './delete-music.component.html',
})
export class DeleteMusicComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() music = MusicFactory.createDefaultMusic();
  @Output() onSuccess = new EventEmitter<boolean>();

  spinLoader = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private musicService: MusicService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  actionDelete() {
    this.spinLoader = true;
    this.subscriptions.push(
      this.musicService
        .delete(this.music.id)
        .pipe(
          finalize(() => {
            this.spinLoader = false;
          })
        )
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: Messages.MUSIC_SUCCESSFULLY_DELETED,
            });
            this.onSuccess.emit(true);
            this.visibleChange.emit(false);
          },
          error: (err: HttpErrorResponse) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            }),
        })
    );
  }

  onHide() {
    this.visibleChange.emit(false);
  }
}
