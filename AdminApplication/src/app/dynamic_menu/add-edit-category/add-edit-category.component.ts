import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit {
  addCategory: FormGroup;
  categoryName = new FormControl('', [Validators.required]);
  categoryDes = new FormControl('', [Validators.required]);
  category_id: number = 0;
  pageTitle: string = 'Add Category'
  buttonText: string = 'Save'

  constructor(
    _formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditCategoryComponent>, @Inject(MAT_DIALOG_DATA) 
    public categoryData:any,
		private dialog: MatDialog,
    private ar: ActivatedRoute, 
    
    private router: Router,
    private common: CommonService,
    private adminservice: AdminApiService
  ) {
    this.addCategory = _formbuilder.group({
      categoryName: this.categoryName,
      categoryDes: this.categoryDes
    });
    this.category_id = + this.categoryData.id;
    if(this.category_id !=0){
      this.pageTitle = 'Edit Category'
      this.buttonText = 'Update'
    }
   }

  ngOnInit(): void {
    if(this.category_id !=0){
      const reqData ={
        category_id: this.category_id
      }
      this.adminservice.getCategoryDeatilsById(reqData).subscribe(
        res => {
          if(res['status'] == 1){
            this.addCategory.setValue({
              categoryName: res['category'][0]['category_name'],
              categoryDes: res['category'][0]['category_des']
            })
          }
          else{
            this.common.openSnackBar('Category details faled to load', '');
          }
        },
        err => {
          console.log("ERROR");
          console.log(err);
          this.common.openSnackBar('please try later', '');
        }
      );
    }
  }



  closePopup() {
    this.dialogRef.close();
  }

  saveCategory(){
    if(this.addCategory.valid){
      const formData: any = {
        category_name: this.addCategory.value.categoryName,
        category_des: this.addCategory.value.categoryDes
      }
      if(this.category_id ==0){
        this.adminservice.saveCategory(formData).subscribe(
          res => {
            if(res['status'] == 1){
              this.closePopup();
            }
            else{
              this.common.openSnackBar('Category is not save please try later', '');
            }
          },
          err => {
            console.log("ERROR");
            console.log(err);
            this.common.openSnackBar('please try later', '');
          }
        );
      }
      if(this.category_id !=0){
        formData['category_id'] = this.category_id;
        this.adminservice.updateCategory(formData).subscribe(
          res => {
            if(res['status'] == 1){
              this.closePopup();
            }
            else{
              this.common.openSnackBar('Category is not update please try later', '');
            }
          },
          err => {
            console.log("ERROR");
            console.log(err);
            this.common.openSnackBar('please try later', '');
          }
        );
      }
    }

  }


}
