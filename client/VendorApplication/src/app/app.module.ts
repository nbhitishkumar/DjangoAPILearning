import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient, HttpHeaders, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './signups_logins/login/login.component';
import { SignupComponent } from './signups_logins/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SignuplayoutComponent } from './layouts/signuplayout/signuplayout.component';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { CommonService } from './services/common/common.service';
import { ConfigurationService } from './services/config/configuration.service';
import { VerificationComponent } from './common/verification/verification.component';



@NgModule({
  declarations: [AppComponent,
  LoginComponent,
  SignupComponent,
  DashboardComponent,
  MainLayoutComponent,
  SignuplayoutComponent,
  ProfileComponent],
  entryComponents: [
    VerificationComponent
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativePageTransitions,
    CommonService,
		ConfigurationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
