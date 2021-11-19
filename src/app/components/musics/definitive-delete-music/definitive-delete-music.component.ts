import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Music } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';
import MusicFactory from 'src/app/utils/MusicFactory';
import Messages from 'src/app/utils/Messages';

@Component({
  selector: 'app-definitive-delete-music',
  templateUrl: './definitive-delete-music.component.html'
})
export class DefinitiveDeleteMusicComponent implements OnInit, OnDestroy {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() music: Music = MusicFactory.createDefaultMusic();
  @Output() onSuccess = new EventEmitter<boolean>();

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

  actionDefinitiveDelete() {
    this.spinLoader = true;
    this.subscriptions.push(this.musicService.definitiveDelete(this.music.id)
      .pipe(
        finalize(() => {
          this.spinLoader = false;
        }))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: Messages.MUSIC_DEFINITELY_DELETED_SUCCESSFULLY });
          this.onSuccess.emit(true);
          this.visibleChange.emit(false);
        },
        error: (err: HttpErrorResponse) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
      })
    );
  }

  onHide() {
    this.visibleChange.emit(false);
  }

}
