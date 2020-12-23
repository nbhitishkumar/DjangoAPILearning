import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AccountInfoPageRoutingModule } from './account-info-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AccountInfoPage } from './account-info.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AccountInfoPageRoutingModule,FormsModule,
    ReactiveFormsModule, HttpClientModule,
  ],
  declarations: [AccountInfoPage],
  providers: [
    Geolocation,
    NativeGeocoder,
  ]
})
export class AccountInfoPageModule {}
