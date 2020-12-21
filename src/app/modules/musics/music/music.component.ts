import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExchangeMessages } from 'src/app/interfaces/ExchangeMessages';
import { SHOW_DELETED_MUSIC, SHOW_LIST_MUSIC } from 'src/app/utils/Consts';
import { BehaviorSubjectService } from '../service/behavior-subject/behavior-subject.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements ExchangeMessages, OnInit, OnDestroy {

  displayListMusic: boolean;
  displayDeletedMusic: boolean;
  private subscriptions: Array<Subscription>;

  constructor(
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.displayListMusic = true;
    this.displayDeletedMusic = false;
    this.subscriptions = new Array<Subscription>();
    this.listenMessages();
  }

  listenMessages(): void {
    this.subscriptions.push(this.behaviorSubjectService.listenMessage().subscribe(message => {
      if (message === SHOW_LIST_MUSIC) {
        this.showListMusic();

      }
      if (message === SHOW_DELETED_MUSIC) {
        this.showDeletedMusic();
      }
    }));
  }

  private showListMusic(): void {
    this.displayListMusic = true;
    this.displayDeletedMusic = false;
  }

  private showDeletedMusic(): void {
    this.displayListMusic = false;
    this.displayDeletedMusic = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
