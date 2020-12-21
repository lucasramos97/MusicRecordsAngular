import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SHOW_LIST_MUSIC } from 'src/app/utils/Consts';
import { Music } from '../model/Music';
import { BehaviorSubjectService } from '../service/behavior-subject/behavior-subject.service';
import { MusicService } from '../service/music/music.service';

@Component({
  selector: 'app-deleted-music',
  templateUrl: './deleted-music.component.html',
  styleUrls: ['./deleted-music.component.css'],
  providers: [ConfirmationService]
})
export class DeletedMusicComponent implements OnInit, OnDestroy {

  musics: Array<Music>;
  musicsSelected: Array<Music>;
  eventLazyLoad: LazyLoadEvent;
  loading: boolean;
  totalRecords: number;
  msgs: Array<Message>;
  private subscriptions: Array<Subscription>;

  constructor(
    private musicService: MusicService,
    private behaviorSubjectService: BehaviorSubjectService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.musics = new Array<Music>();
    this.musicsSelected = new Array<Music>();
    this.subscriptions = new Array<Subscription>();
  }

  loadMusics(event: LazyLoadEvent): void {

    this.loading = true;
    this.eventLazyLoad = event;

    setTimeout(() => {
      this.subscriptions.push(this.musicService.getAllDeletedMusic(event.first / event.rows).subscribe(musics => {
        this.musics = musics.content;
        this.totalRecords = musics.totalElements;
      }));
      this.loading = false;
    }, 1000);
  }

  recoverSelectedMusics(): void {
    if (this.musicsSelected.length === 0) {
      this.msgs = [{ severity: 'error', summary: 'Error', detail: 'It is necessary to select at least one music!' }];
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you really want to recover the selected songs',
      accept: () => {
        this.subscriptions.push(this.musicService.recoverDeletedMusics(this.musicsSelected).subscribe(
          () => {
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Musics recovered successfully!' }];
            this.musicsSelected = new Array<Music>();
            this.loadMusics(this.eventLazyLoad);
          },
          () => this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error when recovered musics!' }]));
      }
    });
  }

  comeBack(): void {
    this.behaviorSubjectService.sendMessage(SHOW_LIST_MUSIC);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
