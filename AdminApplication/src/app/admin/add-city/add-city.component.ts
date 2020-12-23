import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {
  addCity: FormGroup;
  cityName = new FormControl('', [Validators.required]);
  stateId = new FormControl('', [Validators.required]);
  pageTitle: string = 'Add New City'
  buttonText: string = 'Save'
  stateList: any =[];

  constructor(
    _formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddCityComponent>, @Inject(MAT_DIALOG_DATA)
    public areaData:any,
		private dialog: MatDialog,
		private ar: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private userservice: UserService,
    private adminservice: AdminApiService
  ) {
    this.addCity = _formbuilder.group({
      cityName: this.cityName,
      stateId: this.stateId
    });
   }

  ngOnInit(): void {
    this.getStateList()
  }

  getStateList(){
    this.adminservice.stateList().subscribe(
      res => {
        if(res['status'] == 1){
          this.stateList = res['states'];
          console.log(this.stateList)
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
  saveCity(){
    if(this.addCity.valid){
      const formData: any = {
        city_name: this.addCity.value.cityName,
        state : this.addCity.value.stateId
      }
      this.adminservice.addNewCity(formData).subscribe(
            res => {
              if(res['status'] == 1){
                this.closePopup();
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


  }
  closePopup(){
    this.dialogRef.close();
  }

}
