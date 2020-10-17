import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Music } from '../Model/Music';
import { MusicService } from '../service/music.service';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.css']
})
export class MusicsComponent implements OnInit, OnDestroy {

  musics: Array<Music>;
  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(private musicService: MusicService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.musicService.getAll().subscribe(musics => this.musics = musics));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
