import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LazyLoadEvent } from 'primeng/api';

import { Music } from '../Model/Music';
import { BehaviorSubjectService } from '../service/behavior-subject/behavior-subject.service';
import { MusicService } from '../service/music/music.service';
import { UPDATE_MUSIC_LIST } from '../utils/Consts';
@Component({
  selector: 'app-musics',
  templateUrl: './list-music.component.html',
  styleUrls: ['./list-music.component.css']
})
export class ListMusicComponent implements OnInit, OnDestroy {

  musics: Array<Music>;
  displayCreateEditMusic: boolean;
  musicEdit: Music;
  eventLazyLoad: LazyLoadEvent;
  loading: boolean;
  totalRecords: number;
  private subscriptions: Array<Subscription>;

  constructor(private musicService: MusicService,
    private behaviorSubjectService: BehaviorSubjectService) { }

  ngOnInit(): void {
    this.displayCreateEditMusic = false;
    this.loading = true;
    this.subscriptions = new Array<Subscription>();
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
        this.musics.forEach(music => {
          music.duration = music.duration.slice(3);
        });
        this.totalRecords = musics.totalElements;
      }));
      this.loading = false;
    }, 1000);
  }

  showCreateMusic(): void {
    this.displayCreateEditMusic = true;
  }

  showEditMusic(musicEdit: Music): void {
    this.musicEdit = musicEdit;
    this.displayCreateEditMusic = true;
  }

  clearMusicEdit(): void {
    this.musicEdit = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
