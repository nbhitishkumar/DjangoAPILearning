import { CommonService } from '../services/common/common.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginsignupService } from '../services/login_signup/loginsignup.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    selectedTabIndex = 0;
  	userDetails: any = [];
  	userProfile: FormGroup;
  	profileImage = 'assets/img/user.png';
  	profileEdit: FormGroup;
	userEmail = new FormControl('', [
		Validators.required,
		Validators.email
	]);
	userPassword = new FormControl('', [Validators.required]);
	userFirstName = new FormControl('', [Validators.required]);
	userLastName = new FormControl('', [Validators.required]);
	userPhone = new FormControl('', [Validators.required]);
	userAddress = new FormControl('', [Validators.required]);
	userPin = new FormControl('', [Validators.required]);

  constructor(
    fb: FormBuilder,
    private loginsignup: LoginsignupService,
			private router: Router, 
      private ar: ActivatedRoute,
      private common: CommonService,
      public toastController: ToastController
  ) {
    this.userProfile = fb.group({
			userEmail: this.userEmail,
			userPassword: this.userPassword,
			userFirstName: this.userFirstName,
			userLastName: this.userLastName,
			userPhone: this.userPhone,
			userAddress: this.userAddress,
			userPin: this.userPin
		});

    this.common.profileImageCallBackResult$.subscribe(value =>{
      if(value){
        this.profileImage = this.common.profileImage;
      }
    });
	}

  ngOnInit() {
    this.getSellerProfile();
  }
  getSellerProfile(){
    this.loginsignup.vendorProfileInfo().subscribe(
      res => {
        if(res['status'] == 1){
          this.userDetails = res['profile_details'][0];
          if(this.userDetails.profile_image != ''){
            this.common.setProfileImage(this.userDetails.profile_image);
          }
        }
      },
      err => {
        // console.log(err);
        console.log('ERROR', err.status);
        // this.common.openSnackBar('Some error occured, please try again later', '');
      },
    );
  }

}
