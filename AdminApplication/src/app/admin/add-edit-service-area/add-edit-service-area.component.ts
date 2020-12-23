import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-edit-service-area',
  templateUrl: './add-edit-service-area.component.html',
  styleUrls: ['./add-edit-service-area.component.css']
})
export class AddEditServiceAreaComponent implements OnInit {
  addServiceSetup: FormGroup;
  stateName = new FormControl('', [Validators.required]);
  cityName = new FormControl('', [Validators.required]);
  areaName = new FormControl('', [Validators.required]);
  pinCode = new FormControl('', [Validators.required]);
  area_id: number = 0;
  pageTitle: string = 'Add New Area'
  buttonText: string = 'Save'
  stateList: any =[];
  cityList: any =[];

  constructor(
    _formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditServiceAreaComponent>, @Inject(MAT_DIALOG_DATA)
    public areaData:any,
		private dialog: MatDialog,
		private ar: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private userservice: UserService,
    private adminservice: AdminApiService
  ) {
    this.addServiceSetup = _formbuilder.group({
      stateName: this.stateName,
      cityName: this.cityName,
      areaName: this.areaName,
      pinCode: this.pinCode
    });
    this.area_id = + this.areaData.id;
    if(this.area_id !=0){
      this.pageTitle = 'Edit Area'
      this.buttonText = 'Update'
    }
   }

  ngOnInit(): void {
    this.getStateList()
  }

  onSelection(event){
    const formData: any = {
      state_id: event.value
    }
    this.adminservice.cityListById(formData).subscribe(
      res => {
        if(res['status'] == 1){
          console.log(res)
          this.cityList = res['area'];
        }
        else{
          alert("error")
          this.cityList = [];
        }
      },
      err => {
        console.log("ERROR");
        console.log(err);
        this.cityList = [];
        // this.common.openSnackBar('please try later', '');
      }
    );


  }

  getStateList(){
    this.adminservice.stateList().subscribe(
      res => {
        if(res['status'] == 1){
          this.stateList = res['states'];
        }
        else{
          alert("error")
          // this.common.openSnackBar('Domain is not save please try later', '');
        }
      },
      err => {
        console.log("ERROR");
        console.log(err);
        // this.common.openSnackBar('please try later', '');
      }
    );
  }

  saveArea(){
    if(this.addServiceSetup.valid){
      const formData: any = {
        state: this.addServiceSetup.value.stateName,
        city: this.addServiceSetup.value.cityName,
        area_name: this.addServiceSetup.value.areaName,
        pin_code: this.addServiceSetup.value.pinCode
      }
      if(this.area_id ==0){
        this.adminservice.addNewArea(formData).subscribe(
          res => {
            if(res['status'] == 1){
              this.closePopup();
            }
            else{
              // this.common.openSnackBar('Domain is not save please try later', '');
            }
          },
          err => {
            console.log("ERROR");
            console.log(err);
            // this.common.openSnackBar('please try later', '');
          }
        );
      }
      // //Submit domain details through API for data edit
      // if(this.domain_id !=0){
      //   formData['domain_id'] = this.domain_id;
      //   console.log('Set', formData);
      //   this.userservice.updateDomain(formData).subscribe(
      //     res => {
      //       if(res['status'] == 1){
      //         this.closePopup();
      //       }
      //       else{
      //        // this.common.openSnackBar('Domain is not update please try later', '');
      //       }
      //     },
      //     err => {
      //       console.log("ERROR");
      //       console.log(err);
      //       //this.common.openSnackBar('please try later', '');
      //     }
      //   );
      // }
    }
  }

  closePopup(){
    this.dialogRef.close();
  }

}
