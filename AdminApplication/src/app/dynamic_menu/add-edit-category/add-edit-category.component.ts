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
  categoryImg = new FormControl('', [Validators.required]);
  category_id: number = 0;
  pageTitle: string = 'Add Category';
  buttonText: string = 'Save';
  files: any = {};
  fileType : string=''

  constructor(
    _formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditCategoryComponent>, @Inject(MAT_DIALOG_DATA)
    public categoryData:any,
		private dialog: MatDialog,
    private ar: ActivatedRoute,
    private router: Router,
    private userservice: UserService,
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
            console.log(res['category'][0])
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


  uploadImage(event){
    var target: HTMLInputElement = event.target as HTMLInputElement;
    this.fileType = target.files[0].type;
    this.files = target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
      target.files[0].type === "image/jpg" ||
      target.files[0].type === "image/png") {
        // this.addCategory.get('categoryImage').setValue(files)
      } else {
        alert("Please upload Image")
      }
  }



  closePopup() {
    this.dialogRef.close();
  }

  saveCategory(){
    if(this.addCategory.valid){
      const formData: any = {
        category_name: this.addCategory.value.categoryName,
        category_des: this.addCategory.value.categoryDes,

      }
      if(this.category_id ==0){
        if (this.fileType === "image/jpeg" ||
          this.fileType === "image/jpg" ||
          this.fileType === "image/png") {
            this.adminservice.saveCategory(formData).subscribe(
              res => {
                if(res['status'] == 1){
                  this.adminservice.getCategoryIdByName(formData).subscribe(
                    res => {
                      if(res['status'] == 1){
                        this.saveCategoryImage(this.files, this.fileType, res['category_id'])
                        this.closePopup();
                      }
                      else{
                        this.common.openSnackBar('please try later','')
                      }
                    },
                    err => {
                      this.common.openSnackBar('please try later', '');
                    }
                  );
                }
                else{
                  this.common.openSnackBar('Category is not save please try later', '');
                }
              },
              err => {
                this.common.openSnackBar('please try later', '');
              }
            );
        } else {
          this.common.openSnackBar(' Please upload jpeg/jpg/png files only','');
        }
      }
      if(this.category_id !=0){
        formData['category_id'] = this.category_id;
        this.adminservice.updateCategory(formData).subscribe(
          res => {
            if(res['status'] == 1){
              this.saveCategoryImage(this.files, this.fileType, this.category_id)
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

  saveCategoryImage(file, file_type, category_id) {
    var form_data = new FormData();
    form_data.append("file", file);
    form_data.append('file_type', file_type);
    form_data.append('up_dir', 'category_image');
    form_data.append('category_id', category_id)
    this.userservice.uploadCategoryImage(form_data).subscribe(
      res => {
        if(res['status']==1) {

        } else {
          this.common.openSnackBar(res['message'], '')
        }
      },
      err => {
        this.common.openSnackBar('ERROR IN FILE UPLOAD, PLEASE TRY AGAIN LATER.','');
      }
  
    );
  }


}
