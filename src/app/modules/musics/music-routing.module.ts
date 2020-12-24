import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeletedMusicComponent } from './deleted-music/deleted-music.component';
import { ListMusicComponent } from './list-music/list-music.component';

const routes: Routes = [
  { path: '', component: ListMusicComponent },
  { path: 'deleted', component: DeletedMusicComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicRoutingModule { }
