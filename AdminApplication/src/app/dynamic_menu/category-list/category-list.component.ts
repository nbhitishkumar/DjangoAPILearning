import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { AddEditCategoryComponent } from 'src/app/dynamic_menu/add-edit-category/add-edit-category.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categoryList: any;
  categoryImage = 'assets/img/image.png';

  constructor(
    private common: CommonService,
    private userservice: UserService,
    private router: Router,
    private dialog: MatDialog,
    private adminservice: AdminApiService
  ) { 
    this.common.categoryImageCallBackResult$.subscribe(value =>{
		  if(value){
      this.categoryImage = this.common.categoryImage;
      console.log(this.categoryImage)
		  }
		});
  }

  ngOnInit(): void {
    this.categoryList =[];
    this.getCategoryList();
  }
  getCategoryList(){
    this.adminservice.getAllCategoryList().subscribe(
      res => {
        if(res['status'] == 1){
          this.categoryList = res['category_details'];
          // console.log(this.categoryList.category_image)
          // if(this.categoryList.category_image !=''){
          //   this.common.setCategoryImage(this.categoryList.category_image);
          // }
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
  }
  
  dialogRefTags : MatDialogRef<AddEditCategoryComponent> | null;
  addCategory(list_id){
    this.dialogRefTags = this.dialog.open(AddEditCategoryComponent, {
      data: {
        id: list_id
      },
        disableClose: true,
      });
      this.dialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
        this.getCategoryList();
      });
  }

  editdialogRefTags : MatDialogRef<AddEditCategoryComponent> | null;
  editCategory(list_id){
    this.editdialogRefTags = this.dialog.open(AddEditCategoryComponent, {
      data: {
        id: list_id
      },
        disableClose: true,
      });
      this.editdialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
        this.getCategoryList();
      });
  }


  uploadImage(event) {
    console.log(event)
    var files: any = {};
    var target: HTMLInputElement = event.target as HTMLInputElement;
    let fileType = target.files[0].type;
    files = target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
      target.files[0].type === "image/jpg" ||
      target.files[0].type === "image/png") {
        this.saveImage(files, fileType);
      } else {
      }
  }
  
  saveImage(file, file_type) {
    var form_data = new FormData();
    form_data.append("file", file);
    form_data.append('file_type', file_type);
    form_data.append('up_dir', 'category_image');
  
    this.userservice.uploadProfileImage(form_data).subscribe(
      res => {
        if(res['status']==1) {
      this.common.setCategoryImage(res['base64_image']);
          setTimeout(() => {
            // this.imageLoader = false;
          });
        } else {
        alert('Image is not upload')
          // this.cs.openSnackBar(res['message'],'');
          setTimeout(() => {
            // this.imageLoader = false;
          });
        }
      },
      err => {
        // this.cs.openSnackBar('ERROR IN FILE UPLOAD, PLEASE TRY AGAIN LATER.','');
        console.log(err)
      }
  
    );
  }


  CategoryDet(id){
    console.log(id)
  }






}
