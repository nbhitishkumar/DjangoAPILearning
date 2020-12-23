import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController, LoadingController,} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { CommonService } from 'src/app/services/common/common.service';
import { LoginsignupService } from 'src/app/services/login_signup/loginsignup.service';
import { AlertController } from '@ionic/angular'; 
import { ModalController} from '@ionic/angular';
import { VerificationComponent } from 'src/app/components/verification/verification.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {email_error: boolean = false;
  email_error_message: string = '';
  phone_no_exist_error: boolean = false;
  phone_no_exist_massage: string = '';
  userCheckedTerms = false;
  is_form_submitted = false;
  show_errormsg: boolean = false;
  error_msg: string = '';
  loginData: any;
  phonelen: string = 'Mobile No. should be of 10 digit';
  showCloseButton: boolean = false;
  userSignup: FormGroup;
  userEmail = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
  userPassword = new FormControl('', [Validators.required]);
  userLastName  = new FormControl('', [Validators.required]);
  userFirstName  = new FormControl('', [Validators.required]);
  userPhone = new FormControl('', [Validators.required]);

  constructor(
    fb: FormBuilder,
    private common: CommonService,
    private router: Router,
    public toastController: ToastController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private navTrans: NativePageTransitions,
    private loginsignup: LoginsignupService,  ) {
      this.userSignup = fb.group({
        userEmail: this.userEmail,
        userPassword: this.userPassword,
        userFirstName:  this.userFirstName,
        userLastName: this.userLastName,
        userPhone: this.userPhone,
      });
    }
  ngOnInit() {
  }

  IsNumeric(e) {
    var keyCode = e.which ? e.which : e.keyCode;
    var ret = ((keyCode >= 48 && keyCode <= 57) || keyCode === 46);
    return ret;
  }


  async showLoader(msg) {  
    const alert = await this.alertController.create({  
      message: msg,  
      buttons: ['OK']  
    });
  }

  checkUserExists(email_id){
    if (email_id !== '') {
      let reqData = {
        email: email_id
      };
      this.loginsignup.checkEmailExistence(reqData).subscribe(
        res => {
          console.log(res);
          if (res['status'] === 1) {
            console.log('checkUserExists Status', res['status']);
            this.email_error = true;
            this.email_error_message = res['message'];
            this.presentToast(this.email_error_message);
          } else {
            this.show_errormsg = true;
            this.email_error_message = res['message']
            this.email_error = false;
          }
        },
        err => {
          console.log('ERROR');
          console.log(err);
        }
        );
      }
      else{
        this.email_error = false;
      }
    }
    emailError(){
      this.email_error = false;
    }
    mobileError(){
      this.phone_no_exist_error = false;
    }
    checkTerms(event: any) {
      console.log(event.checked);
      if (event.checked) {
        this.is_form_submitted = false;
        this.userCheckedTerms = true;
      } else {
        this.is_form_submitted = true;
        this.userCheckedTerms = false;
      }
    }

    phoneLen(){
      if (this.userSignup.value.userPhone.length < 10){
        this.presentToast(this.phonelen);
      }
    }

    checkPhoneExists(searchValue: string){
      console.log('checkPhoneExists', searchValue);
      if (this.userSignup.value.userPhone.length >= 10){
        let reqData = {
            phone_no: this.userSignup.value.userPhone
          };
        this.loginsignup.checkMobileNumberExistence(reqData).subscribe(
          res => {
            console.log(res);
            if (res['status'] == 1) {
              console.log('checkUserExists Status', res['status']);
              this.phone_no_exist_error = true;
              this.phone_no_exist_massage = res['message'];
              this.presentToast(this.phone_no_exist_massage);
            } else {
              console.log('checkUserExists Status', res['status']);
              this.phone_no_exist_error = false;
              this.phone_no_exist_massage = res['message'];
            }
          },
          err => {
            console.log('ERROR');
            console.log(err);
          }
        );
      }
      else{
        this.phone_no_exist_error = false;
        this.phone_no_exist_massage = '';
      }
    }

    async presentToast(mes) {
      const toast = await this.toastController.create({
        message: mes,
        cssClass: 'toast-scheme',
        duration: 2000
      });
      toast.present();
    }

  logIn(){
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      slowdownfactor: -1,
      iosdelay: 50,
     };
    this.navTrans.fade(options);
    this.navCtrl.navigateRoot('/login');
  }

  async Signup(){
    const loading = await this.loadingController.create({  
      message: 'Please wait...',  
      });  
    await loading.present();  
    if (this.email_error === true || this.phone_no_exist_error === true){
      loading.dismiss();
      this.showLoader('Email or phone Error');  
      return false;
    }
    if (this.userSignup.valid) {
      const reqData: any = {
        email: this.userSignup.value.userEmail,
        password: this.userSignup.value.userPassword,
        first_name: this.userSignup.value.userFirstName,
        last_name: this.userSignup.value.userLastName,
        phone_no: this.userSignup.value.userPhone
      };
      console.log('Registration Details', reqData);
      this.loginsignup.userSignup(reqData).subscribe(
        async res => {
          if (res['status'] === 1){
            console.log(res['status']);
            const otp:any ={
              mobile:this.userSignup.value.userPhone
            }
            this.loginsignup.sendOtpToNumber(otp).subscribe(
              async res => {
                if (res['status'] === 1){
                  loading.dismiss();
                  this.userVerification(this.userSignup.value.userEmail,this.userSignup.value.userPhone);
                }
              },
              err => {
                // loading.dismiss();
                // console.log('ERROR');
                // this.showLoader('Error 404');  
                // console.log(err);
              }
            );
            
            // this.navCtrl.navigateRoot('/home');
          }
        },
        err => {
          loading.dismiss();
          console.log('ERROR');
          this.showLoader('Error 404');  
          console.log(err);
        }
      );
    }
    else{
      loading.dismiss();
      this.showLoader('Fill all details');  
    }
    }


  async userVerification(email,mobile){
    const modal = await this.modalCtrl.create({
      component: VerificationComponent,
      componentProps:{
        email: email,
        mobile: mobile
      }
    });
    return await modal.present();
  }

}
