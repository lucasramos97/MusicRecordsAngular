import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Music } from '../Model/Music';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private readonly urlBase = 'http://localhost:8080/musics';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Array<Music>> {
    return this.httpClient.get<Array<Music>>(this.urlBase);
  }

  save(music: Music): Observable<Music> {
    return this.httpClient.post<Music>(this.urlBase, music);
  }

}
