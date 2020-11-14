import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Music } from '../Model/Music';
import { BehaviorSubjectService } from '../service/behavior-subject/behavior-subject.service';
import { MusicService } from '../service/music/music.service';
import { MUSIC_SAVE_SUCCESSFULLY } from '../utils/Consts';

@Component({
  selector: 'app-musics',
  templateUrl: './list-music.component.html',
  styleUrls: ['./list-music.component.css']
})
export class ListMusicComponent implements OnInit, OnDestroy {

  musics: Array<Music>;
  displayCreateEditMusic: boolean;
  private subscriptions: Array<Subscription>;

  constructor(
    private musicService: MusicService,
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.displayCreateEditMusic = false;
    this.subscriptions = new Array<Subscription>();
    this.updateMusicList();
    this.subscriptions.push(this.behaviorSubjectService.listenMessage().subscribe(message => {
      if (message === MUSIC_SAVE_SUCCESSFULLY) {
        this.updateMusicList();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showCreateEditMusic(): void {
    this.displayCreateEditMusic = true;
  }

  private updateMusicList(): void {
    this.subscriptions.push(this.musicService.getAll().subscribe(musics => this.musics = musics));
  }

}
