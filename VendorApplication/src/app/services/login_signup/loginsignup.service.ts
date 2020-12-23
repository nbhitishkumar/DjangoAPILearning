import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigurationService } from '../config/configuration.service';
import { CommonService } from '../common/common.service';


@Injectable({
  providedIn: 'root'
})
export class LoginsignupService {
  private actionUrl: string;
  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
    private common: CommonService) {
    this.actionUrl = configuration.ServerWithApiUrl;
  }

    // Seller Login
    authLogin(reqData) {
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/seller-login/', reqData, authHeader);
    }
    // Get Account

    authAccount(reqData) {
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/get-account/', reqData, authHeader);
    }
    // Seller Login
    authLoginWithOtp(reqData) {
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/vendor-loginOtp/', reqData, authHeader);
    }

    // Seller  Registration
    userSignup(reqData) {
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/seller-registration/', reqData, authHeader);
    }

    // check if Email exists or not
    checkEmailExistence(reqData){
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/check-email/', reqData, authHeader);
    }
    // check phone_no exists or not
    checkMobileNumberExistence(reqData){
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/check-phone/', reqData, authHeader);
    }

    // Send Otp for Login
    sendMobileLoginOtp(reqData){
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/send-otp-login/', reqData, authHeader);
    }

    // Otp Verification
    checkMobileOtp(reqData){
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/check-otp/', reqData, authHeader);
    }
    // Seller Profile Info 
    vendorProfileInfo(){
      let authHeader = this.common.getHttpOptionWithLogin();
      return this.http.get(this.actionUrl + 'user/seller-info/',  authHeader);
    }

    vendorUpdateProfileInfo(reqData){
      let authHeader = this.common.getHttpOptionWithLogin();
      return this.http.put(this.actionUrl + 'user/seller-info/', reqData ,  authHeader);
    }

    sendOtpToNumber(reqData){
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/send-otp/', reqData, authHeader);
    }

    sellerProfilebyId(){
      let authHeader = this.common.getHttpOptionWithLogin();
      return this.http.get(this.actionUrl + 'user/get-sellerProfile/',  authHeader);
    }
    updateProfilebyId(reqData){
      let authHeader = this.common.getHttpOptionWithLogin();
      return this.http.put(this.actionUrl + 'user/get-sellerProfile/', reqData,  authHeader);
    }

    sendEmail(reqData){
      let authHeader = this.common.getHttpOptionNotLogin();
      return this.http.post(this.actionUrl + 'user/send-mail/', reqData, authHeader);
    }

}

