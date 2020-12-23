import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServiceAreaComponent } from './add-edit-service-area.component';

describe('AddEditServiceAreaComponent', () => {
  let component: AddEditServiceAreaComponent;
  let fixture: ComponentFixture<AddEditServiceAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditServiceAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditServiceAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
