import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FormValidation } from 'src/app/interfaces/FormValidation';
import { ComponentUtils } from 'src/app/utils/ComponentUtils';
import { UPDATE_MUSIC_LIST } from 'src/app/utils/Consts';
import { Music } from '../model/Music';
import { BehaviorSubjectService } from '../service/behavior-subject/behavior-subject.service';
import { MusicService } from '../service/music/music.service';

@Component({
  selector: 'app-create-edit-music',
  templateUrl: './create-edit-music.component.html',
  styleUrls: ['./create-edit-music.component.css']
})
export class CreateEditMusicComponent implements FormValidation, OnInit, OnDestroy {

  private readonly RED_COLOR = '#f44336';
  private readonly FIELDS_NOT_REQUIRED: Array<string> = ['viewsNumber', 'feat'];

  music: Music;
  msgs: Array<Message>;
  loader: boolean;
  requiredStyle: Map<string, string>;
  requiredFields: Map<string, string>;
  private componentUtils: ComponentUtils;
  private subscriptions: Array<Subscription>;

  constructor(
    private musicService: MusicService,
    private behaviorSubjectService: BehaviorSubjectService
  ) { }

  ngOnInit(): void {
    this.music = new Music();
    this.loader = false;
    this.requiredStyle = new Map<string, string>();
    this.requiredFields = new Map<string, string>();
    this.componentUtils = new ComponentUtils();
    this.subscriptions = new Array<Subscription>();
  }

  showDialog(musicEdit: Music): void {
    this.clearAllInputFieldsRequired();
    this.initMusic(musicEdit);
  }

  saveOrEditMusic(): void {
    if (this.validFields()) {
      this.music.duration = this.addHoursToMusicDuration(this.music.duration);
      if (this.music.id) {
        this.editMusic();
      } else {
        this.saveMusic();
      }
    }
  }

  private initMusic(musicEdit: Music): void {
    if (musicEdit) {
      this.music = musicEdit;
    } else {
      this.music = new Music();
    }
  }

  private editMusic(): void {
    this.loader = true;
    this.subscriptions.push(this.musicService.edit(this.music).subscribe(
      () => {
        this.loader = false;
        this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Music edited successfully!' }];
        this.behaviorSubjectService.sendMessage(UPDATE_MUSIC_LIST);
      },
      res => {
        this.loader = false;
        this.msgs = [{ severity: 'error', summary: 'Error', detail: res.error.message }];
      }));
  }

  private saveMusic(): void {
    this.loader = true;
    this.subscriptions.push(this.musicService.save(this.music).subscribe(
      () => {
        this.loader = false;
        this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Music added successfully!' }];
        this.behaviorSubjectService.sendMessage(UPDATE_MUSIC_LIST);
        this.music = new Music();
      },
      res => {
        this.loader = false;
        this.msgs = [{ severity: 'error', summary: 'Error', detail: res.error.message }];
      }));
  }

  validFields(): boolean {
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

  addInputFieldRequired(field: string): void {
    let capitalizedField = this.componentUtils.capitalizeField(field);
    this.changeTextFieldRequired(field, `${capitalizedField} is required!`, 'p-invalid');
    this.changeMaskFieldRequired(field, this.RED_COLOR);
  }

  clearInputFieldRequired(field: string): void {
    this.changeTextFieldRequired(field, '', '');
    this.changeMaskFieldRequired(field, '');
  }

  changeTextFieldRequired(field: string, value: string, cssClass: string): void {
    this.requiredFields.set(field, value);
    this.requiredStyle.set(field, cssClass);
  }

  clearAllInputFieldsRequired(): void {
    for (let key of Object.keys(this.music)) {
      this.clearInputFieldRequired(key);
    }
  }

  private addHoursToMusicDuration(duration: string): string {
    return `00:${duration}`;
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
