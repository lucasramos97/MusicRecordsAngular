import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Music } from '../../model/Music';
import { MusicRequest } from '../../model/MusicRequest';
import { MessageResponse } from 'src/app/model/MessageResponse';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private readonly urlBase = 'http://localhost:8080/musics';

  constructor(private httpClient: HttpClient) { }

  getAll(page: number): Observable<MusicRequest> {
    return this.httpClient.get<MusicRequest>(`${this.urlBase}?page=${page}&size=5`);
  }

  save(music: Music): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(this.urlBase, music);
  }

  edit(music: Music): Observable<MessageResponse> {
    return this.httpClient.put<MessageResponse>(this.urlBase, music);
  }

  delete(musicId: number) {
    return this.httpClient.delete(`${this.urlBase}/${musicId}`);
  }

}
