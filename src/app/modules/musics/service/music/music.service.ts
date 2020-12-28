import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from 'src/app/models/MessageResponse';
import { Music } from '../../model/Music';
import { MusicRequest } from '../../model/MusicRequest';

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
    return this.httpClient.put<MessageResponse>(`${this.urlBase}/${music.id}`, music);
  }

  delete(id: number): Observable<MessageResponse> {
    return this.httpClient.delete<MessageResponse>(`${this.urlBase}/${id}`);
  }

  getAllDeletedMusic(page: number): Observable<MusicRequest> {
    return this.httpClient.get<MusicRequest>(`${this.urlBase}/deleted?page=${page}&size=5`);
  }

  countDeletedMusics(): Observable<MessageResponse> {
    return this.httpClient.get<MessageResponse>(`${this.urlBase}/deleted/count`);
  }
  
  recoverDeletedMusics(musics: Array<Music>): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(`${this.urlBase}/recover`, musics);
  }

}
