import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '../pipes/pipes.module';
import { CreateEditMusicComponent } from './create-edit-music/create-edit-music.component';
import { DeletedMusicComponent } from './deleted-music/deleted-music.component';
import { ListMusicComponent } from './list-music/list-music.component';
import { MusicComponent } from './music/music.component';

@NgModule({
  declarations: [ListMusicComponent, CreateEditMusicComponent, MusicComponent, DeletedMusicComponent],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    InputNumberModule,
    RadioButtonModule,
    MessagesModule,
    MessageModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  exports: [MusicComponent]
})
export class MusicsModule { }
