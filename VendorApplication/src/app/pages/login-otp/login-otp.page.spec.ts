import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginOtpPage } from './login-otp.page';

describe('LoginOtpPage', () => {
  let component: LoginOtpPage;
  let fixture: ComponentFixture<LoginOtpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginOtpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
