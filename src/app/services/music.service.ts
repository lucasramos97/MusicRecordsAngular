import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IMusic, IPagedMusics } from '../interfaces/all';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private readonly URL = 'http://localhost:8080/musics';

  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    }),
  };

  constructor(
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient
  ) {}

  public getAll(page = 1, size = 5): Observable<IPagedMusics> {
    return this.httpClient.get<IPagedMusics>(
      `${this.URL}?page=${page}&size=${size}`,
      this.HTTP_OPTIONS
    );
  }

  public save(music: IMusic): Observable<IMusic> {
    return this.httpClient.post<IMusic>(this.URL, music, this.HTTP_OPTIONS);
  }

  public update(music: IMusic): Observable<IMusic> {
    return this.httpClient.put<IMusic>(
      `${this.URL}/${music.id}`,
      music,
      this.HTTP_OPTIONS
    );
  }

  public delete(musicId: number | undefined): Observable<IMusic> {
    return this.httpClient.delete<IMusic>(
      `${this.URL}/${musicId}`,
      this.HTTP_OPTIONS
    );
  }

  public countDeleted(): Observable<number> {
    return this.httpClient.get<number>(
      `${this.URL}/deleted/count`,
      this.HTTP_OPTIONS
    );
  }

  public getAllDeleted(page = 1, size = 5): Observable<IPagedMusics> {
    return this.httpClient.get<IPagedMusics>(
      `${this.URL}/deleted?page=${page}&size=${size}`,
      this.HTTP_OPTIONS
    );
  }

  public restoreMusics(musics: IMusic[]): Observable<number> {
    return this.httpClient.post<number>(
      `${this.URL}/deleted/restore`,
      musics,
      this.HTTP_OPTIONS
    );
  }

  public definitiveDelete(musicId: number | undefined): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.URL}/definitive/${musicId}`,
      this.HTTP_OPTIONS
    );
  }

  public emptyList(): Observable<number> {
    return this.httpClient.delete<number>(
      `${this.URL}/empty-list`,
      this.HTTP_OPTIONS
    );
  }
}
