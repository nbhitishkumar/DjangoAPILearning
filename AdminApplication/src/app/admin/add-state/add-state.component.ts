import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.css']
})
export class AddStateComponent implements OnInit {
  addState: FormGroup;
  stateName = new FormControl('', [Validators.required]);
  pageTitle: string = 'Add New State'
  buttonText: string = 'Save'

  constructor(
    _formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddStateComponent>, @Inject(MAT_DIALOG_DATA)
    public areaData:any,
		private dialog: MatDialog,
		private ar: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private userservice: UserService,
    private adminservice: AdminApiService
  ) {
    this.addState = _formbuilder.group({
      stateName: this.stateName
    });
  }

  ngOnInit(): void {
  }

  saveState(){
    if(this.addState.valid){
      const formData: any = {
        state_name: this.addState.value.stateName
      }
      console.log(formData);
      this.adminservice.addNewState(formData).subscribe(
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
