import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExchangeMessages } from 'src/app/interfaces/ExchangeMessages';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { AUTHENTICATED_ERROR, UPDATE_MUSIC_LIST } from 'src/app/utils/Consts';
import { BehaviorSubjectService } from '../../../services/behavior-subject/behavior-subject.service';
import { Music } from '../model/Music';
import { MusicService } from '../service/music/music.service';

@Component({
  selector: 'app-list-music',
  templateUrl: './list-music.component.html',
  styleUrls: ['./list-music.component.css'],
  providers: [ConfirmationService]
})
export class ListMusicComponent implements ExchangeMessages, AfterViewChecked, OnInit, OnDestroy {

  musics: Array<Music>;
  displayCreateEditMusic: boolean;
  musicEdit: Music;
  eventLazyLoad: LazyLoadEvent;
  loading: boolean;
  totalRecords: number;
  deletedMusicNumbers: number;
  msgs: Array<Message>;
  private subscriptions: Array<Subscription>;

  constructor(
    private musicService: MusicService,
    private authService: AuthService,
    private behaviorSubjectService: BehaviorSubjectService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.displayCreateEditMusic = false;
    this.loading = true;
    this.musics = new Array<Music>();
    this.subscriptions = new Array<Subscription>();
    this.checkDeletedMusics();
    this.listenMessages();
  }

  ngAfterViewChecked(): void {
    this.setButtonBadge();
  }

  listenMessages(): void {
    this.subscriptions.push(this.behaviorSubjectService.listenMessage().subscribe(message => {
      if (message === UPDATE_MUSIC_LIST) {
        this.loadMusics(this.eventLazyLoad);
      }
    }));
  }

  loadMusics(event: LazyLoadEvent): void {

    this.loading = true;
    this.eventLazyLoad = event;

    setTimeout(() => {
      this.subscriptions.push(this.musicService.getAll(event.first / event.rows).subscribe(musics => {
        this.musics = musics.content;
        this.totalRecords = musics.totalElements;
      }));
      this.loading = false;
    }, 1000);
  }

  showCreateMusic(): void {
    this.displayCreateEditMusic = true;
  }

  showEditMusic(musicEdit: Music): void {
    this.musicEdit = Object.assign({}, musicEdit);
    this.displayCreateEditMusic = true;
  }

  clearMusicEdit(): void {
    this.musicEdit = null;
  }

  confirmDeleteMusic(music: Music): void {
    this.confirmationService.confirm({
      message: `Do you really want to delete this music: ${music.artist} - ${music.title}`,
      accept: () => {
        this.subscriptions.push(this.musicService.delete(music.id).subscribe(
          () => {
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Music deleted successfully!' }];
            this.checkDeletedMusics();
            this.loadMusics(this.eventLazyLoad);
          },
          () => this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error when deleted music!' }]));
      }
    });
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  setButtonBadge(): void {
    let htmlCollection = <HTMLCollection>document.getElementsByClassName('p-badge-danger p-badge ng-star-inserted');
    if (htmlCollection.length > 0) {
      htmlCollection[0].innerHTML = `${this.deletedMusicNumbers}`;
    }
  }

  showDeletedMusic(): void {
    this.router.navigateByUrl('/musics/deleted');
  }

  private checkDeletedMusics(): void {
    this.subscriptions.push(this.musicService.countDeletedMusics().subscribe(
      res => this.deletedMusicNumbers = Number.parseInt(res.message),
      res => {
        if (res.status === 401) {
          this.authService.logout();
          this.behaviorSubjectService.sendMessage(`${AUTHENTICATED_ERROR}${res.error.message}`);
          this.router.navigateByUrl('/login');
        }
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
