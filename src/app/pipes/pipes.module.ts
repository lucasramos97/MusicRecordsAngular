import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicTimePipe } from './music-time/music-time.pipe';
import { MusicFeatPipe } from './music-feat/music-feat.pipe';

@NgModule({
  declarations: [MusicTimePipe, MusicFeatPipe],
  imports: [
    CommonModule
  ],
  exports: [MusicTimePipe, MusicFeatPipe]
})
export class PipesModule { }
