import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { VerificationComponent } from './verification/verification.component';


@NgModule({
  declarations: [EditProfileComponent, VerificationComponent],
  exports:[EditProfileComponent, VerificationComponent],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
