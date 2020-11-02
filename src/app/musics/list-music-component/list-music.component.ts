import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Music } from '../Model/Music';
import { MusicService } from '../service/music.service';

@Component({
  selector: 'app-musics',
  templateUrl: './list-music.component.html',
  styleUrls: ['./list-music.component.css']
})
export class ListMusicComponent implements OnInit, OnDestroy {

  title = 'Music Records';
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
