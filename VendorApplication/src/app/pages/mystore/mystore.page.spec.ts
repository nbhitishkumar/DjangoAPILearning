import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MystorePage } from './mystore.page';

describe('MystorePage', () => {
  let component: MystorePage;
  let fixture: ComponentFixture<MystorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MystorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MystorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
