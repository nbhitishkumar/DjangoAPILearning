import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignuplayoutComponent } from './signuplayout.component';

describe('SignuplayoutComponent', () => {
  let component: SignuplayoutComponent;
  let fixture: ComponentFixture<SignuplayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignuplayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignuplayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
