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


  deleteVendorAccount(reqData){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.put(this.actionUrl + 'backerAdmin/vendor-details/', reqData, authHeader);
  }

  approveVendorAccount(reqData){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.put(this.actionUrl + 'backerAdmin/approve-vendor/', reqData, authHeader);
  }

  vendorInfo(reqData){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/vendor-info/', reqData, authHeader);
  }

  addNewState(reqData){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/state-list/', reqData, authHeader);
  }

  addNewCity(reqData){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/city-list/', reqData, authHeader);
  }

  stateList() {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/state-list/',  authHeader);
  }

  cityList() {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/city-list/',  authHeader);
  }

  cityListById(reqData,) {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/city-listById/', reqData, authHeader);
  }

  addNewArea(reqData,) {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'backerAdmin/add-area/', reqData, authHeader);
  }

  getAreaList() {
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/add-area/', authHeader);
  }

  getAllVendorList(reqData,){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'backerAdmin/city-list/',  authHeader);
  }

  getAllCategoryList(){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.get(this.actionUrl + 'dynamicMenu/seller-category/', authHeader);
  }


  saveCategory(reqData,){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'dynamicMenu/seller-category/', reqData, authHeader);
  }

  updateCategory(reqData,){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.put(this.actionUrl + 'dynamicMenu/seller-category/', reqData, authHeader);
  }


  getCategoryDeatilsById(reqData,){
    let authHeader = this.common.getHttpOptionWithLogin();
    return this.http.post(this.actionUrl + 'dynamicMenu/seller-categoryByid/',  reqData, authHeader);
  }
}
