import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Music } from '../Model/Music';
import { MusicService } from '../service/music/music.service';
import { BehaviorSubjectService } from '../service/behavior-subject/behavior-subject.service'
import { Message } from 'primeng/api';
import { UPDATE_MUSIC_LIST } from '../utils/Consts';

@Component({
  selector: 'app-create-edit-music',
  templateUrl: './create-edit-music.component.html',
  styleUrls: ['./create-edit-music.component.css']
})
export class CreateEditMusicComponent implements OnInit, OnDestroy {

  private readonly RED_COLOR = '#f44336';
  private readonly FIELDS_NOT_REQUIRED: Array<string> = ['viewsNumber', 'feat'];

  music: Music;
  requiredStyle: Map<string, string>;
  requiredFields: Map<string, string>;
  msgs: Array<Message>;
  private subscriptions: Array<Subscription>;

  constructor(
    private musicService: MusicService,
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.music = new Music();
    this.requiredStyle = new Map<string, string>();
    this.requiredFields = new Map<string, string>();
    this.subscriptions = new Array<Subscription>();
  }

  showDialog(musicEdit: Music): void {
    this.clearAllInputFieldsRequired();
    this.initMusic(musicEdit);
  }

  private clearAllInputFieldsRequired(): void {
    for (let key of Object.keys(this.music)) {
      this.clearInputFieldRequired(key);
    }
  }

  private clearInputFieldRequired(field: string): void {
    this.changeTextFieldRequired(field, '', '');
    this.changeMaskFieldRequired(field, '');
  }

  private changeTextFieldRequired(field: string, value: string, cssClass: string): void {
    this.requiredFields.set(field, value);
    this.requiredStyle.set(field, cssClass);
  }

  private changeMaskFieldRequired(field: string, color: string): void {
    if (field === 'launchDate') {
      this.changeInputMaskBorderColor(0, color);
    } else if (field === 'duration') {
      this.changeInputMaskBorderColor(1, color);
    }
  }

  private changeInputMaskBorderColor(index: number, color: string): void {
    let inputMask = <HTMLInputElement>document.getElementsByClassName('p-inputmask p-inputtext p-component')[index];
    inputMask.style.borderColor = color;
  }

  private initMusic(musicEdit: Music): void {
    if (musicEdit) {
      this.music = musicEdit;
    } else {
      this.music = new Music();
    }
  }

  saveOrEditMusic(): void {
    if (this.validFields()) {
      this.music.duration = this.formatMusicDuration(this.music.duration);
      if (this.music.id) {
        this.editMusic();
      } else {
        this.saveMusic();
      }
    }
  }

  private validFields(): boolean {
    let valid: boolean = true;

    for (let [key, value] of Object.entries(this.music)) {
      if (!value && this.FIELDS_NOT_REQUIRED.indexOf(key) === -1) {
        this.addInputFieldRequired(key);
        valid = false;
      } else {
        this.clearInputFieldRequired(key);
      }
    }

    return valid;
  }

  private addInputFieldRequired(field: string): void {
    this.changeTextFieldRequired(field, `${this.capitalizeField(field)} is required!`, 'p-invalid');
    this.changeMaskFieldRequired(field, this.RED_COLOR);
  }

  private capitalizeField(field: string): string {
    let capitalizeField = '';
    for (let i = 0; i < field.length; i++) {
      if (i === 0) {
        capitalizeField += field[i].toUpperCase();
        continue;
      }
      if (field[i].toUpperCase() === field[i]) {
        capitalizeField += ` ${field[i]}`;
      } else {
        capitalizeField += field[i];
      }
    }
    return capitalizeField;
  }

  private formatMusicDuration(duration: string): string {
    return `00:${duration}`;
  }

  private editMusic(): void {
    this.subscriptions.push(this.musicService.edit(this.music).subscribe(
      res => {
        this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Music edited successfully!' }];
        this.behaviorSubjectService.sendMessage(UPDATE_MUSIC_LIST);
      },
      error => this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error when edited music!' }]));
  }

  private saveMusic(): void {
    this.subscriptions.push(this.musicService.save(this.music).subscribe(
      res => {
        this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Music added successfully!' }];
        this.behaviorSubjectService.sendMessage(UPDATE_MUSIC_LIST);
        this.music = new Music();
      },
      error => this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Error when adding music!' }]));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
