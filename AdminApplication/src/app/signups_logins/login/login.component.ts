import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigurationService } from 'src/app/services/config/configuration.service';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  email = new FormControl('', [
		Validators.required,
		Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
	]);
  password = new FormControl('', [Validators.required]);
  loginData: any;
  checkboxChecked = false;
  isChecked = false;
  show_errormsg: boolean = false;
  error_msg: string = '';
  show: boolean = false;

  constructor(
    fb: FormBuilder,
    private common: CommonService,
    private router: Router,
    private adminlogin: AdminApiService,
    private ar: ActivatedRoute,
    private config: ConfigurationService,
  ) { this.userLogin = fb.group({
    email: this.email,
    password: this.password
  });}

  ngOnInit(): void {
  }

  LogIn(){
		if(this.userLogin.valid){
			const reqData: any = {
				email: this.userLogin.value.email,
				password: this.userLogin.value.password
			}
			this.adminlogin.authAdminLogin(reqData).subscribe(
				res => {
          if(res["status"] == 1) { // success Login
            console.log(res);
						this.loginData = JSON.stringify(res);
						localStorage.setItem('userLoginData', this.loginData);
						// Get JWT Token From API
						this.getTokenPair();
						this.common.tokenOverwriteCallBackResult$.subscribe((value)=>{
							if(value === 'success'){
								this.router.navigate(['/dashboard']);
							}
						});
					}
					if(res["status"] == 0){
            // this.showLoader(JSON.stringify( res["msg"]));
					}
				},
				err => {
          // loading.dismiss();
          // this.showLoader('Invalid Email or Password ...');
				},
			);
    }
    else{
      // loading.dismiss();
      // this.showLoader('Invalid Email or Password .....');
    }
	}

	getTokenPair(){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		if(userData != null || userData!= undefined){
			const reqData: any = {
				username: userData.username,
				password: this.userLogin.value.password
			}
			this.common.tokenPairOverwriteInLocalstorage(reqData);
		}else{
			// this.common.openSnackBar('Localstorage is not set, please it set first', '');
		}
	}

}
