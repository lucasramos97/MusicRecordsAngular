import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from './guards/authorization.guard';

import { LoginComponent } from './components/users/login/login.component';
import { MusicListComponent } from './components/musics/music-list/music-list.component';
import { DeletedMusicListComponent } from './components/musics/deleted-music-list/deleted-music-list.component';
import { NotFoundComponent } from './components/utils/not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'musics' },
  {
    path: 'musics',
    component: MusicListComponent,
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'musics/deleted',
    component: DeletedMusicListComponent,
    canActivate: [AuthorizationGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
