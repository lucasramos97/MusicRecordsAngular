import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Music } from 'src/app/interfaces/all';
import { MusicService } from 'src/app/services/music.service';
import Messages from 'src/app/utils/Messages';

@Component({
  selector: 'app-restore-musics',
  templateUrl: './restore-musics.component.html'
})
export class RestoreMusicsComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() musics: Music[] = [];

  @Output() onSuccess = new EventEmitter<boolean>();

  spinLoader = false;

  private subscriptions: Array<Subscription> = new Array();

  constructor(
    private musicService: MusicService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.spinLoader = false;
  }

  actionRestoreMusics() {
    this.spinLoader = true;
    this.subscriptions.push(this.musicService.restoreMusics(this.musics)
      .pipe(
        finalize(() => {
          this.spinLoader = false;
        }))
      .subscribe({
        next: (total) => {
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: Messages.getRestoredMusicsSuccessfully(total) });
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
