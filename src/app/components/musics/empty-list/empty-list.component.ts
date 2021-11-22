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

@Component({
  selector: 'app-empty-list',
  templateUrl: './empty-list.component.html',
})
export class EmptyListComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

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

  onHide() {
    this.visibleChange.emit(false);
  }

  actionEmptyList() {
    this.spinLoader = true;
    this.subscriptions.push(
      this.musicService
        .emptyList()
        .pipe(finalize(() => (this.spinLoader = false)))
        .subscribe({
          next: (total) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: Messages.getEmptyListSuccessfully(total),
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
}
