import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Music } from '../../Model/Music';
import { MusicRequest } from '../../Model/MusicRequest';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private readonly urlBase = 'http://localhost:8080/musics';

  constructor(private httpClient: HttpClient) { }

  getAll(page: number): Observable<MusicRequest> {
    return this.httpClient.get<MusicRequest>(`${this.urlBase}?page=${page}&size=5`);
  }

  save(music: Music): Observable<Music> {
    return this.httpClient.post<Music>(this.urlBase, music);
  }

  edit(music: Music): Observable<Music> {
    return this.httpClient.put<Music>(this.urlBase, music);
  }

  delete(musicId: number) {
    return this.httpClient.delete(`${this.urlBase}/${musicId}`);
  }

}
