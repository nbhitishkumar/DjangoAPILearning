import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule, HttpRequest } from '@angular/common/http';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ConfigurationService } from '../config/configuration.service';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private actionUrl: string;
  imageUrl; // rename imageFileBinary to imageUrl
  profileImage: string;
  shopImage: string;
  ownerImage: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  gitinCertificateImg : string;
  fssaiCertificateImg : string;
  public tokenPairOverwriteObservable = new Subject<any>();
  public tokenOverwriteCallBackResult$ = this.tokenPairOverwriteObservable.asObservable();
  public profileImageObservable = new Subject<any>();
  public profileImageCallBackResult$ = this.profileImageObservable.asObservable();
  public shopImageObservable = new Subject<any>();
  public shopImageCallBackResult$ = this.shopImageObservable.asObservable();
  public ownerImageObservable = new Subject<any>();
  public ownerImageCallBackResult$ = this.ownerImageObservable.asObservable();
  public aadharFrontImageObservable = new Subject<any>();
  public aadharFrontImageCallBackResult$ = this.aadharFrontImageObservable.asObservable();
  public aadharBackImageObservable = new Subject<any>();
  public aadharBackImageCallBackResult$ = this.aadharBackImageObservable.asObservable();
  public gstinCertificateObservable = new Subject<any>();
  public gstinCertificateCallBackResult$ = this.gstinCertificateObservable.asObservable();
  public fssaiCertificateObservable = new Subject<any>();
  public fssaiCertificateCallBackResult$ = this.fssaiCertificateObservable.asObservable();
  constructor(private http: HttpClient,
              private _configuration: ConfigurationService,
              private sanitizer:DomSanitizer,
              private snackBar: MatSnackBar,
		            private router: Router, ) {
      this.actionUrl = _configuration.ServerWithApiUrl;
    }
    // access token without login
    getHttpOptionNotLogin() {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      let options = { headers: headers };
      return options;
    }

    // access token with login
    getHttpOptionWithLogin() {
      let userData = JSON.parse(localStorage.getItem('userLoginData'));
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + userData.token);
      let options = { headers: headers };
      return options;
    }

    // write token access and refresh in localStorage
    tokenPairOverwriteInLocalstorage(reqData){
      console.log('tokenPairOverwriteInLocalstorage', reqData);
      let current_date = new Date(); /// Get Current Date
      let current_timestamp = current_date.getTime(); /// Convert current date to timestamp
      let userData = JSON.parse(localStorage.getItem('userLoginData'));
      if (userData != null || userData !== undefined){
        this.getTokenObtainPair(reqData).subscribe(
          res => {
            userData.token = res['access'];
            userData.refresh = res['refresh'];
            userData['token_access_time'] = current_timestamp;
            localStorage.setItem('userLoginData', JSON.stringify(userData));
            this.tokenPairOverwriteObservable.next('success');
            console.log('Local Storage Data', JSON.parse(localStorage.getItem('userLoginData')));
          },
          err => {
            console.log(err);
          },
          );
        }else{
          console.log('LocalStorage is not set, please it set first', '');
        }
      }

      // get new Token
      getNewToken(){
        let userData = JSON.parse(localStorage.getItem('userLoginData'));
        let reqData = {
          refresh: userData.refresh
        };
        this.getAccessToken(reqData).subscribe(
          res => {
            // userData.token = res['access'];
            // userData.refresh = res['refresh']
            // this.loginData = JSON.stringify(res);
            // localStorage.setItem('userLoginData', JSON.stringify(userData));
          },
          err => {
            console.log(err);
          },
          );
      }
      userLogout() {
        localStorage.clear();
      }
  //  * JWT Token Obtain Pair
  getTokenObtainPair(reqData) {
    return this.http.post(this.actionUrl + 'token/', reqData);
  }
  // JWT Access Token
  getAccessToken(reqData) {
    return this.http.post(this.actionUrl + 'refresh/', reqData);
  }

  setProfileImage(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.profileImage = this.imageUrl;
    userData.profile_image = this.imageUrl;
    console.log(this.imageUrl);
		this.profileImageObservable.next(true);
  }
  setShopImage(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.shopImage = this.imageUrl;
    userData.shop_image = this.imageUrl;
		this.shopImageObservable.next(true);
  }

  setOwnerImage(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.ownerImage = this.imageUrl;
    userData.owner_image = this.imageUrl;
		this.ownerImageObservable.next(true);
  }

  setAadharFrontImage(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.aadharFrontImage = this.imageUrl;
    userData.aadhaar_front_image = this.imageUrl;
		this.aadharFrontImageObservable.next(true);
  }

  setAadharBackImage(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.aadharBackImage = this.imageUrl;
    userData.aadhaar_back_image = this.imageUrl;
		this.aadharBackImageObservable.next(true);
  }

  setGstinCertificate(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.gitinCertificateImg = this.imageUrl;
    userData.gstin_image = this.imageUrl;
		this.gstinCertificateObservable.next(true);
  }

  setFssaiCertificate(encodedImage){
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let imageBinary = encodedImage; //image binary data response from api
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
		this.fssaiCertificateImg = this.imageUrl;
    userData.fssai_image = this.imageUrl;
		this.fssaiCertificateObservable.next(true);
  }


  openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 4000,
			verticalPosition: 'top',
			horizontalPosition: 'center'
		});
	}
}
