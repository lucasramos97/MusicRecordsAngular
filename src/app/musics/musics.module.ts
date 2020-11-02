import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table'

import { ListMusicComponent } from './list-music-component/list-music.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [ListMusicComponent],
  imports: [
    CommonModule,
    TableModule,
    PipesModule
  ],
  exports: [ListMusicComponent]
})
export class MusicsModule { }
