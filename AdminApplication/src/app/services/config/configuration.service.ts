import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  public Server = 'http://localhost:8000/';
  public ApiUrl = 'api/';
  public ApiUrlForImg = 'api';
  public ServerWithApiUrl = this.Server + this.ApiUrl;
  public ImageUrl = this.Server + this.ApiUrlForImg;
  public domain_name;
  public user_details: any;
  constructor(private _route: Router,
              private _location: Location) {
      this.domain_name = window.location.host;
      this.user_details = JSON.parse(localStorage.getItem('userLoginData'));
      this.canActivate(); }
      canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.user_details != null){
          var current_date = new Date();
          var current_timestamp = current_date.getTime();
          console.log('Current Timestamp', current_timestamp);
				  console.log('Login Timestamp', this.user_details.token_access_time)
          let login_remain_time = current_timestamp - this.user_details.token_access_time;
          console.log(login_remain_time);
          return true;
        }
        else  {
        // Check the user is in landing page or not
          if (this._location.path() === '' || this._location.path() === 'home/dashboard'){
            this._route.navigate( ['/login'] );
          }
          else{
            this._route.navigate( ['/login'] );
          }
          return false;
      }
    }
  }
