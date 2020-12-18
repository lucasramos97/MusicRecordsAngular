import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from 'src/app/model/MessageResponse';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly keyToken = 'token';
  private readonly keyUserEmail = 'userEmail';
  private readonly urlBase = 'http://localhost:8080/auth';

  constructor(private httpClient: HttpClient) { }

  login(user: User): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(`${this.urlBase}/login`, user);
  }

  create(user: User): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(`${this.urlBase}/create`, user);
  }

  test(): Observable<MessageResponse> {
    return this.httpClient.get<MessageResponse>(`${this.urlBase}/test`);
  }

  getToken(): string {
    let token = localStorage.getItem(this.keyToken);
    if (token) {
      return token;
    }
    return '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.keyToken, token);
  }

  getUserEmail(): string {
    let userEmail = localStorage.getItem(this.keyUserEmail);
    if (userEmail) {
      return userEmail;
    }
    return '';
  }

  setUserEmail(userEmail: string): void {
    localStorage.setItem(this.keyUserEmail, userEmail);
  }

  logout(): void {
    this.setUserEmail('');
    this.setToken('');
  }

}
