import { ViewItemComponent } from './../view-item/view-item.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-category-item-list',
  templateUrl: './category-item-list.component.html',
  styleUrls: ['./category-item-list.component.css']
})
export class CategoryItemListComponent implements OnInit {
  categoryItemList: any = [];
  public category_id: string;
  title: string =''
  config: any;
  collection = { count: 60, data: [] };
  p: number = 1;
  itemImage ='';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private adminservice: AdminApiService,
    private common: CommonService
  ) {
    this.config = {
      itemsPerPage: 1,
      currentPage: 1,
      totalItems: this.collection.count
    };
    this.common.itemImageCallBackResult$.subscribe(value =>{
		  if(value){
			this.itemImage = this.common.itemImage;
		  }
    });
  }

  ngOnInit(): void {
    this.category_id = this.route.snapshot.paramMap.get('list_id');
    this.getCategoryName(this.category_id);
    this.getCategoryItemList(this.category_id);
  }

  getCategoryName(category_id){
    const reqData: any = {
      category_id: category_id
    }
    this.adminservice.getCategoryName(reqData).subscribe(
      res => {
        if(res['status'] == 1){
          this.title = res['category'][0]['category_name'];
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );

  }


  getCategoryItemList(category_id){
    const reqData: any = {
      category_id: category_id
    }
    this.adminservice.getItemDeatilsById(reqData).subscribe(
      res => {
        if(res['status'] == 1){
          this.categoryItemList = res['item_details'];
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  dialogRefTags : MatDialogRef<ViewItemComponent> | null;
  viewCategory(list_id){
    this.dialogRefTags = this.dialog.open(ViewItemComponent, {
      data: {
        id: list_id,
        itemList: this.categoryItemList[list_id-1]
      },
        disableClose: true,
      });
      this.dialogRefTags.afterClosed().subscribe(result => {
        this.getCategoryItemList(this.category_id);
      });
  }
}
