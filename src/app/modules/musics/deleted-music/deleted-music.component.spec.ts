import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedMusicComponent } from './deleted-music.component';

describe('DeletedMusicComponent', () => {
  let component: DeletedMusicComponent;
  let fixture: ComponentFixture<DeletedMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedMusicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
