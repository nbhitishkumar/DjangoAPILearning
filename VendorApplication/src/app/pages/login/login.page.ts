import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { flatten } from '@angular/compiler';
import { LoginsignupService } from 'src/app/services/login_signup/loginsignup.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigurationService } from 'src/app/services/config/configuration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userLogin: FormGroup;
  userPhone = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  otp = new FormControl('', [Validators.required]);
  loginData: any;
  checkboxChecked = false;
  isChecked = false;
  show_errormsg: boolean = false;
  error_msg: string = '';
  show: boolean = false;
  phone_no_exist_error: boolean = false;
  phone_no_exist_massage: string = '';
  isActive: boolean =true;
  passButton: boolean = true;
  otpButton: boolean = true;
  fortext: string= 'Reset Password?';
  link: string = '/#';
  loginButton: boolean = null;

  constructor(
    fb: FormBuilder,
    private common: CommonService,
    private router: Router,
    private loginsignup: LoginsignupService,
    private ar: ActivatedRoute,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private config: ConfigurationService,
    public toastController: ToastController
  ) {
    this.userLogin = fb.group({
      userPhone: this.userPhone,
      password: this.password,
      otp: this.otp
    });
   }


  ngOnInit() {
  }

  async showLoader(msg) {  
    const alert = await this.alertController.create({  
      message: msg,  
      buttons: ['OK']  
    });
  }


  async presentToast(mes) {
    const toast = await this.toastController.create({
      message: mes,
      cssClass: 'toast-scheme',
      duration: 2000
    });
    toast.present();
  }

  IsNumeric(e) {
    var keyCode = e.which ? e.which : e.keyCode;
    var ret = ((keyCode >= 48 && keyCode <= 57) || keyCode === 46);
    return ret;
  }

  toggleCheckbox(event) {
    if ( event.checked ) {
      this.checkboxChecked = true;
    } else{
      this.checkboxChecked = false;
    }}


  checkNumberExists(event){
    if (this.userLogin.value.userPhone.length >= 10){
      let reqData = {
          phone_no: this.userLogin.value.userPhone
        };
      this.loginsignup.checkMobileNumberExistence(reqData).subscribe(
        res => {
          console.log(res);
          if (res['status'] === 1) {
            console.log('checkUserExists Status', res['status']);
            this.phone_no_exist_error = true;
            this.phone_no_exist_massage = res['message'];
            this.passButton = null;
            this.otpButton = null;
          } else {
            console.log('checkUserExists Status', res['status']);
            this.phone_no_exist_error = false;
            this.phone_no_exist_massage = res['message'];
            this.presentToast(this.phone_no_exist_massage);
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

  otpView(){
    if (this.userPhone.value !=''){
      this.link = '/!';
      this.isActive = false;
      this.fortext = 'ReSend OTP';
      this.loginButton= true;
      let reqData = {
        userPhone: this.userLogin.value.userPhone,
      };
      this.loginsignup.sendMobileLoginOtp(reqData).subscribe(
        res => {
          console.log(res);
          if (res['status'] === 1) {
            this.presentToast(res['msg']);
          } else {
            this.presentToast(res['msg']);
          }
        },
        err => {
          console.log('ERROR');
          console.log(err);
        }
      );
    }
    else{
      this.presentToast('Enter Mobile Number');
    }
  }

  passView(){
    this.link = '/#';
    this.isActive = true;
    this.fortext = 'Reset Password?';
  }

  async LogIn(){
    const loading = await this.loadingController.create({  
      message: 'Please wait...',  
      });  
    await loading.present();  
    if (this.userLogin.value.userPhone ==''){
      loading.dismiss()
      this.presentToast('Enter Phone Number');
    }
    else {
      if (this.userLogin.value.password =='')
      {
        if (this.userLogin.value.otp =='' ){
          loading.dismiss()
          this.showLoader('Enter password');
        }
        else{
          let reqData = {
            phone_no: this.userLogin.value.userPhone,
            otp: this.userLogin.value.otp
          };
          this.loginsignup.checkMobileOtp(reqData).subscribe(
            res => {
              let str = atob(res['p']);
              if (res['status'] === 1) {
                let reqlogData = {
                  phone_no: this.userLogin.value.userPhone,
                };
                  this.loginsignup.authLoginWithOtp(reqlogData).subscribe(
                    res => {
                      if (res['status'] === 1) { // success Login
                        this.loginData = JSON.stringify(res);
                        localStorage.setItem('userLoginData', this.loginData);
                        let pass = str.split('_');
                        this.getTokenOtpPair(pass[1]);
                        this.common.tokenOverwriteCallBackResult$.subscribe((value) => {
                          if (value === 'success'){
                            loading.dismiss();
                            this.router.navigate(['home/profile']);
                          }
                        });
                      }
                      if (res['status'] === 0){
                        loading.dismiss()
                        this.show_errormsg = true;
                        this.error_msg = res['msg']
                        this.showLoader(this.error_msg);
                      }
                    },
                  err => {
                    loading.dismiss()
                    console.log('ERROR', err.status);
                    console.log('MSG', err.msg);
                    this.show_errormsg = true;
                    this.error_msg = 'Invalid Email or Password';
                    this.showLoader(this.error_msg);
                  },
                  );
              } else {
                loading.dismiss();
                this.showLoader(res['msg']);
              }
            },
            err => {
              console.log('ERROR');
              loading.dismiss();
              this.error_msg = 'please try again';
              this.showLoader(this.error_msg);
            }
          );
        }
      }
      else{
        const reqData: any = {
          phone_no: this.userLogin.value.userPhone,
          password: this.userLogin.value.password
        };
        console.log(reqData);
        this.loginsignup.authLogin(reqData).subscribe(
          res => {
            if (res['status'] === 1) { // success Login
              this.loginData = JSON.stringify(res);
              localStorage.setItem('userLoginData', this.loginData);
              this.getTokenPair();
              this.common.tokenOverwriteCallBackResult$.subscribe((value) => {
                if (value === 'success'){
                  loading.dismiss()
                  this.router.navigate(['/home/profile']);
                }
              });
            }
            if (res['status'] === 0){
              this.show_errormsg = true;
              this.error_msg = res['msg']
              loading.dismiss()
              this.showLoader(this.error_msg);
            }
          },
          err => {
            console.log('ERROR', err.status);
            console.log('MSG', err.msg);
            this.show_errormsg = true;
            loading.dismiss()
            this.error_msg = 'Invalid Email or Password';
            this.showLoader(this.error_msg);
          },
          );
      }
    }
  }


  signUp(){
    this.router.navigate(['/signup']);
  }

  getTokenOtpPair(pass){
    let userData = JSON.parse(localStorage.getItem('userLoginData'));
    if (userData != null || userData !== undefined){
      const reqData: any = {
        username: userData.username,
        password: pass
      };
      console.log(reqData);
      this.common.tokenPairOverwriteInLocalstorage(reqData);
    }else{
      // this.common.openSnackBar('Localstorage is not set, please it set first', '');
    }

  }

  getTokenPair(){
    let userData = JSON.parse(localStorage.getItem('userLoginData'));
    if (userData != null || userData !== undefined){
      const reqData: any = {
        username: userData.username,
        password: this.userLogin.value.password
      };
      this.common.tokenPairOverwriteInLocalstorage(reqData);
    }else{
      // this.common.openSnackBar('Localstorage is not set, please it set first', '');
    }
  }
}
