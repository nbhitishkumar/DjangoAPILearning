import { Injectable } from '@angular/core';
import { ConfigurationService } from '../config/configuration.service';
import { CommonService } from '../common/common.service'
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private actionUrl: string;

  constructor(
    private http: HttpClient, 
    private _configuration: ConfigurationService, 
    private common: CommonService
  ) {
    this.actionUrl = _configuration.ServerWithApiUrl;
   }

   getHttpOptionForFileUpload() {
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let headers = new HttpHeaders();
		headers = headers.append('Authorization', 'Token ' + userData.token);
		let options = { headers: headers };
		return options;
	}


   uploadProfileImage(form_data) {
		let userData = JSON.parse(localStorage.getItem('userLoginData'));
		let headers = new HttpHeaders();
		headers = headers.append('Authorization', 'Bearer ' + userData.token);
		let options = { headers: headers };
		return this.http.post(this.actionUrl + "user/upload/",form_data, options);
	  }
}
