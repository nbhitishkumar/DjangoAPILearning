import { EditProfilePage } from './../edit-profile/edit-profile.page';
import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { LoginsignupService } from 'src/app/services/login_signup/loginsignup.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular'; 
import { ModalController} from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  selectedTabIndex = 0;
  	userDetails: any = [];
  	userProfile: FormGroup;
  	profileImage = '';
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
		public toastController: ToastController,
		public alertController: AlertController,
		public modalCtrl: ModalController,
		private userservice: UserService,
		public loadingController: LoadingController,
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

  async EditProfile(){
	  const modal = await this.modalCtrl.create({
		  component: EditProfilePage,
		  cssClass: 'my-custom-modal-css',
		  componentProps:{
			id: this.userDetails.id
		  }
	  });
	  modal.onDidDismiss()
      .then((data) => {
        this.getSellerProfile();
    });
	  return await modal.present();
  }

  async showLoader(msg) {  
	const alert = await this.alertController.create({  
	  message: msg,  
	  buttons: ['OK']  
	});
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
        //console.log('ERROR', err.status);
        // this.common.openSnackBar('Some error occured, please try again later', '');
      },
    );
  }
  async addImage(event) {
	const loading = await this.loadingController.create({
		message: 'Uploading....',
	});
	await loading.present();
	var files: any = {};
	var target: HTMLInputElement = event.target as HTMLInputElement;
	let fileType = target.files[0].type;
	files = target.files[0];
	var reader = new FileReader();
	reader.readAsDataURL(target.files[0]);
	if (target.files[0].type === "image/jpeg" ||
		target.files[0].type === "image/jpg" ||
		target.files[0].type === "image/png") {
		  this.saveImage(files, fileType);
		  loading.dismiss();
		} else {
			loading.dismiss();  
        	this.showLoader('Please upload jpeg/jpg/png files only');
		}
}

saveImage(file, file_type) {
	var form_data = new FormData();
	form_data.append("file", file);
	form_data.append('file_type', file_type);
	form_data.append('up_dir', 'profile_image');

	this.userservice.uploadProfileImage(form_data).subscribe(
		res => {
			if(res['status']==1) {
		this.common.setProfileImage(res['base64_image']);
				setTimeout(() => {
				  // this.imageLoader = false;
				});
			} else {
		  alert('Image is not upload')
			  // this.cs.openSnackBar(res['message'],'');
			  setTimeout(() => {
				  // this.imageLoader = false;
				});
			}
		},
		err => {
			// this.cs.openSnackBar('ERROR IN FILE UPLOAD, PLEASE TRY AGAIN LATER.','');
			console.log(err)
		}

	);
}
}
