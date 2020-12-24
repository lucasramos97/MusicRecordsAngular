import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthenticationGuard } from './route-guards/authentication/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: '/musics', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'musics', loadChildren: () => import('./modules/musics/musics.module').then(m => m.MusicsModule), canActivate: [AuthenticationGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
