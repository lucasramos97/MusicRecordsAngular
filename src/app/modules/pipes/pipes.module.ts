import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LaunchDatePipe } from './launch-date/launch-date.pipe';
import { MusicFeatPipe } from './music-feat/music-feat.pipe';

@NgModule({
  declarations: [MusicFeatPipe, LaunchDatePipe],
  imports: [
    CommonModule
  ],
  exports: [LaunchDatePipe, MusicFeatPipe]
})
export class PipesModule { }
