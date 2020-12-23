import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignuplayputComponent } from './signuplayput.component';

describe('SignuplayputComponent', () => {
  let component: SignuplayputComponent;
  let fixture: ComponentFixture<SignuplayputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignuplayputComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignuplayputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
