import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { Music, PagedMusics } from '../interfaces/all';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private readonly URL = 'http://localhost:8080/musics';

  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authenticationService.getToken()}`
    })
  }

  constructor(
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient
  ) { }

  public getAll(page = 1, size = 5): Observable<PagedMusics> {
    return this.httpClient.get<PagedMusics>(`${this.URL}?page=${page}&size=${size}`, this.HTTP_OPTIONS);
  }

  public save(music: Music): Observable<Music> {
    return this.httpClient.post<Music>(this.URL, music, this.HTTP_OPTIONS);
  }

  public update(music: Music): Observable<Music> {
    return this.httpClient.put<Music>(`${this.URL}/${music.id}`, music, this.HTTP_OPTIONS);
  }

  public delete(musicId: number | undefined): Observable<Music> {
    return this.httpClient.delete<Music>(`${this.URL}/${musicId}`, this.HTTP_OPTIONS);
  }

  public countDeleted(): Observable<number> {
    return this.httpClient.get<number>(`${this.URL}/deleted/count`, this.HTTP_OPTIONS);
  }

  public getAllDeleted(page = 1, size = 5): Observable<PagedMusics> {
    return this.httpClient.get<PagedMusics>(`${this.URL}/deleted?page=${page}&size=${size}`, this.HTTP_OPTIONS);
  }

  public restoreMusics(musics: Music[]): Observable<number> {
    return this.httpClient.post<number>(`${this.URL}/deleted/restore`, musics, this.HTTP_OPTIONS);
  }

}
