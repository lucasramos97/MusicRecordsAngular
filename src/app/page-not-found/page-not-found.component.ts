import { AfterViewChecked, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit, AfterViewChecked {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    let userContent = <HTMLDivElement>document.getElementById('userContentId');
    if (userContent) {
      userContent.style.display = 'none';
    }
  }

}
