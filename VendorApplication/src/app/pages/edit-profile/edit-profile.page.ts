import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavParams, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular'; 
import { ModalController} from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { LoginsignupService } from 'src/app/services/login_signup/loginsignup.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  addProfileSetup: FormGroup;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  user_id: number = 0;
  userDetails: any = [];
  pageTitle: string = 'Update Profile'
  buttonText: string = 'Update'
  id: string;
  constructor(
    fb: FormBuilder,
		private loginsignup: LoginsignupService,
		private router: Router, 
		private ar: ActivatedRoute,
    private common: CommonService,
    public navParams: NavParams,
		public toastController: ToastController,
		public alertController: AlertController,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
  ) {
    this.addProfileSetup = fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address
    });
   }

  ngOnInit() {
    this.id= this.navParams.get('id')
    this.loginsignup.sellerProfilebyId().subscribe(
      res => {
        if(res['status'] == 1){
          console.log(res['profile_details'][0]);
          this.addProfileSetup.setValue({
            firstName: res['profile_details'][0]['first_name'],
            lastName: res['profile_details'][0]['last_name'],
            address: res['profile_details'][0]['address']
          })
        }
        else{
          this.showLoader("Profile details failed to load ....")
        }
      },
      err => {
        this.showLoader("Please Try again ....")
      },
    );
  }

  async showLoader(msg) {  
    const alert = await this.alertController.create({  
      message: msg,  
      buttons: ['OK']  
    });
  }

  async saveProfile(){
    const loading = await this.loadingController.create({
      message: 'Updating....',
    });
    await loading.present();
    const formData: any={
      first_name: this.addProfileSetup.value.firstName,
      last_name: this.addProfileSetup.value.lastName,
      address: this.addProfileSetup.value.address
    }
    this.loginsignup.updateProfilebyId(formData).subscribe(
      res => {
        if(res['status'] == 1){
          loading.dismiss();
          this.showLoader(res['msg']);
          this.modalCtrl.dismiss();
        }
        else{
          this.showLoader("Profile details failed to load ....")
        }
      },
      err => {
        this.showLoader("Please Try again ....")
      },
    );

  }

  closePopup() {
    this.modalCtrl.dismiss();
  }

}
