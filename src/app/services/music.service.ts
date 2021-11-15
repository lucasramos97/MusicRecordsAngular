import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { PagedMusics } from '../interfaces/all';

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
}
