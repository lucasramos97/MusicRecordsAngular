import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAuthenticable, ILogin, IUser } from '../interfaces/all';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  public login(login: ILogin): Observable<IAuthenticable> {
    return this.httpClient.post<IAuthenticable>(`${this.URL}/login`, login);
  }

  public create(user: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(`${this.URL}/users`, user);
  }
}
