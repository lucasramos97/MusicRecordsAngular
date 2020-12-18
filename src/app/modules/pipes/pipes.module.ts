import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicFeatPipe } from './music-feat/music-feat.pipe';

@NgModule({
  declarations: [MusicFeatPipe],
  imports: [
    CommonModule
  ],
  exports: [MusicFeatPipe]
})
export class PipesModule { }
