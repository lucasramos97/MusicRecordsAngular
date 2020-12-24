import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from 'src/app/models/MessageResponse';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly keyToken = 'token';
  private readonly keyUserEmail = 'userEmail';
  private readonly keyUsername = 'username';
  private readonly keyExpiredToken = 'expiredToken';
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

  getUsername(): string {
    let username = localStorage.getItem(this.keyUsername);
    if (username) {
      return username;
    }
    return '';
  }

  setUsername(username: string): void {
    localStorage.setItem(this.keyUsername, username);
  }

  isExpiredToken(): boolean {
    let valueExpiredToken = localStorage.getItem(this.keyExpiredToken);
    return valueExpiredToken === '1' ? true : false;
  }

  setExpiredToken(expiredToken: boolean): void {
    let valueExpiredToken = expiredToken ? '1' : '0';
    localStorage.setItem(this.keyExpiredToken, valueExpiredToken);
  }

  isAuthenticated(): boolean {
    return this.getToken() && !this.isExpiredToken();
  }

  logout(): void {
    this.setToken('');
    this.setUsername('');
    this.setUserEmail('');
    this.setExpiredToken(true);
  }

}
