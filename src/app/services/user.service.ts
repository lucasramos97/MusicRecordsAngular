import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Authenticable, Login, User } from '../interfaces/all';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly URL = 'http://localhost:8080';

  constructor(
    private httpClient: HttpClient
  ) { }

  public login(login: Login): Observable<Authenticable> {
    return this.httpClient.post<Authenticable>(`${this.URL}/login`, login);
  }

  public create(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.URL}/users`, user);
  }
}
