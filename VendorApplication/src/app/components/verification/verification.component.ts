import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular'; 
import { ModalController} from '@ionic/angular';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { LoginsignupService } from 'src/app/services/login_signup/loginsignup.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  @Input() email: string;
  @Input() mobile: string;
  email_id: string;
  phone_no: string;
  addState: FormGroup;
  emailOtp = new FormControl('', [Validators.required]);
  mobileOtp  = new FormControl('', [Validators.required]);
  email_err: boolean = true;
  mobile_err: boolean = true;

  constructor(
    fb: FormBuilder,
    private router: Router,
    public alertController: AlertController,
    public navParams: NavParams,
    private loginsignup: LoginsignupService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.email_otp()
  }

  async showLoader(msg) {  
    const alert = await this.alertController.create({  
      message: msg,  
      buttons: ['OK']  
    });
  }

  IsNumeric(e) {
    var keyCode = e.which ? e.which : e.keyCode;
    var ret = ((keyCode >= 48 && keyCode <= 57) || keyCode === 46);
    return ret;
  }



  async mobile_otp(){
    const loading = await this.loadingController.create({  
      message: 'Please wait...',  
      });  
    await loading.present();  
    const reqData: any = {
      mobile: this.navParams.get('mobile'),
    };
    this.loginsignup.sendOtpToNumber(reqData).subscribe(
          async res => {
            if (res['status'] === 1){
              loading.dismiss();
            }
          },
          err => {
            // loading.dismiss();
            // console.log('ERROR');
            // this.showLoader('Error 404');  
            // console.log(err);
          }
        );
  }

  async email_otp(){
    const loading = await this.loadingController.create({  
      message: 'Please wait...',  
      });  
    await loading.present();  
    const reqData: any = {
      email: this.navParams.get('email')
    };
    this.loginsignup.sendEmail(reqData).subscribe(
          async res => {
            if (res['status'] === 1){
              loading.dismiss();
            }
          },
          err => {
            // loading.dismiss();
            // console.log('ERROR');
            // this.showLoader('Error 404');  
            // console.log(err);
          }
        );
  }

  verifyEmail(){

  }

  async verifyMobile(otp){
    if (otp!==''){
      const loading = await this.loadingController.create({  
        message: 'Please wait...',  
        });  
      await loading.present();
      const reqData: any = {
        phone_no: this.navParams.get('mobile'),
        otp: otp
      };
      this.loginsignup.checkMobileOtp(reqData).subscribe(
        async res => {
          if (res['status'] === 1){
            loading.dismiss();
            this.router.navigate(['/login']);
          }
          else{
            console.log(res['msg'])
            loading.dismiss();
            alert(res['msg'])
          }
        },
        err => {
          loading.dismiss();
          this.showLoader('Error 404');  
          // loading.dismiss();
          // console.log('ERROR');
          // this.showLoader('Error 404');  
          // console.log(err);
        }
      )
    }
    }

  


}
