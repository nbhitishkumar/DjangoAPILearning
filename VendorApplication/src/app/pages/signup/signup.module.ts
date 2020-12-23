import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupPage } from './signup.page';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignupPageRoutingModule,
    FormsModule,
    ReactiveFormsModule, HttpClientModule,
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
