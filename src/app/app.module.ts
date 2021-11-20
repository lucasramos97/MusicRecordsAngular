import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/users/login/login.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { MusicListComponent } from './components/musics/music-list/music-list.component';
import { DurationPipe } from './pipes/duration.pipe';
import { FeatPipe } from './pipes/feat.pipe';
import { MusicDialogComponent } from './components/musics/music-dialog/music-dialog.component';
import { SessionExpiredComponent } from './components/utils/session-expired/session-expired.component';
import { DeleteMusicComponent } from './components/musics/delete-music/delete-music.component';
import { DeletedMusicListComponent } from './components/musics/deleted-music-list/deleted-music-list.component';
import { LoggedUserComponent } from './components/utils/logged-user/logged-user.component';
import { RestoreMusicsComponent } from './components/musics/restore-musics/restore-musics.component';
import { DefinitiveDeleteMusicComponent } from './components/musics/definitive-delete-music/definitive-delete-music.component';
import { EmptyListComponent } from './components/musics/empty-list/empty-list.component';
import { LogoutDialogComponent } from './components/utils/logout-dialog/logout-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    MusicListComponent,
    DurationPipe,
    FeatPipe,
    MusicDialogComponent,
    SessionExpiredComponent,
    DeleteMusicComponent,
    DeletedMusicListComponent,
    LoggedUserComponent,
    RestoreMusicsComponent,
    DefinitiveDeleteMusicComponent,
    EmptyListComponent,
    LogoutDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DialogModule,
    TableModule,
    InputMaskModule,
    InputNumberModule,
    RadioButtonModule,
    TooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
