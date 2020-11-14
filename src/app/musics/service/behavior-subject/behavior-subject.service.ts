import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehaviorSubjectService {

  private behaviorSubject: BehaviorSubject<string>;

  constructor() {
    this.behaviorSubject = new BehaviorSubject<string>('');
  }

  sendMessage(message: string): void {
    this.behaviorSubject.next(message);
  }

  listenMessage(): BehaviorSubject<String> {
    return this.behaviorSubject;
  }

}
