import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MystorePageRoutingModule } from './mystore-routing.module';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { MystorePage } from './mystore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MystorePageRoutingModule
  ],
  declarations: [MystorePage]
})
export class MystorePageModule {}
