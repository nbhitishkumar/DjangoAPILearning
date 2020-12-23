import { AddStateComponent } from './../add-state/add-state.component';
import { AddEditServiceAreaComponent } from './../add-edit-service-area/add-edit-service-area.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';
import { AddCityComponent } from '../add-city/add-city.component';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-city-area',
  templateUrl: './city-area.component.html',
  styleUrls: ['./city-area.component.css']
})
export class CityAreaComponent implements OnInit {
  userdetails: any;
  serviceList: any;

  constructor(
    private common: CommonService,
    private userservice: UserService,
    private router: Router,
    private dialog: MatDialog,
    private adminservice: AdminApiService
  ) {
    let userData = JSON.parse(localStorage.getItem('userLoginData'));
    if(userData != '' || userData !=undefined){
      this.userdetails = userData;
    }
   }

  ngOnInit(): void {
    this.serviceList =[];
    this.getServiceList();
  }

  getServiceList(){
    this.adminservice.getAreaList().subscribe(
      res => {
        if(res['status'] == 1){
          this.serviceList = res['area'];
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );

  }

  dialogRefTags : MatDialogRef<AddEditServiceAreaComponent> | null;
  openPopUp(list_id){
    this.dialogRefTags = this.dialog.open(AddEditServiceAreaComponent, {
      data: {
        id: list_id
      },
        disableClose: true,
      });
      this.dialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
        this.getServiceList();
      });
  }

  citydialogRefTags : MatDialogRef<AddCityComponent> | null;
  addCity(list_id){
    this.citydialogRefTags = this.dialog.open(AddCityComponent, {
      data: {
        id: list_id
      },
        disableClose: true,
      });
      this.citydialogRefTags.afterClosed().subscribe(result => {
        this.getServiceList();
      });

  }


  statedialogRefTags : MatDialogRef<AddStateComponent> | null;
  addState(list_id){
    this.statedialogRefTags = this.dialog.open(AddStateComponent, {
      data: {
        id: list_id
      },
        disableClose: true,
      });
      this.statedialogRefTags.afterClosed().subscribe(result => {
        this.getServiceList();
      });
  }

}
