import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table'

import { MusicsComponent } from './musics-component/musics.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [MusicsComponent],
  imports: [
    CommonModule,
    TableModule,
    PipesModule
  ],
  exports: [MusicsComponent]
})
export class MusicsModule { }
