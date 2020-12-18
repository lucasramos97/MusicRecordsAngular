import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditMusicComponent } from './create-edit-music.component';

describe('CreateEditMusicComponent', () => {
  let component: CreateEditMusicComponent;
  let fixture: ComponentFixture<CreateEditMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditMusicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
