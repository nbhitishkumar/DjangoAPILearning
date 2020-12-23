import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { ConfigurationService } from '../config/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  private actionUrl: string;

  constructor(private http: HttpClient,
              private _configuration: ConfigurationService,
              private common: CommonService) {
      this.actionUrl = _configuration.ServerWithApiUrl;
    }


  authAdminLogin(reqData){
    let authHeader = this.common.getHttpOptionNotLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/admin-login/', reqData, authHeader);
  }

  vendorList() {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/vendor-details/',  authHeader);
  }

  getAreaList() {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/add-area/', authHeader);
  }

  cityListById(reqData,) {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/city-listById/', reqData, authHeader);
  }

  areaListById(reqData,) {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/area-listById/', reqData, authHeader);
  }

  pinCoceById(reqData,){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/pin-codeById/', reqData, authHeader);
  }

  stateList(){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/state-list/',  authHeader);
  }

  cityList() {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/city-list/',  authHeader);
  }
}
