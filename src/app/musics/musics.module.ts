import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ListMusicComponent } from './list-music-component/list-music.component';
import { PipesModule } from '../pipes/pipes.module';
import { CreateEditMusicComponent } from './create-edit-music/create-edit-music.component';

@NgModule({
  declarations: [ListMusicComponent, CreateEditMusicComponent],
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
  exports: [ListMusicComponent]
})
export class MusicsModule { }
