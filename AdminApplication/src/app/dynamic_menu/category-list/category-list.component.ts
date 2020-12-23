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

  constructor(
    private common: CommonService,
    private userservice: UserService,
    private router: Router,
    private dialog: MatDialog,
    private adminservice: AdminApiService
  ) { }

  ngOnInit(): void {
    this.categoryList =[];
    this.getCategoryList();
  }
  getCategoryList(){
    this.adminservice.getAllCategoryList().subscribe(
      res => {
        if(res['status'] == 1){
          this.categoryList = res['category_details'];
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



}
