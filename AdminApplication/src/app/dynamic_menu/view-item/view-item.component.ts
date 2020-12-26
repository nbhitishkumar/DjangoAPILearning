import { CommonService } from './../../services/common/common.service';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {
  comment = new FormControl('', [Validators.required]);
  addComment: FormGroup;
  itemImage=''
  itemName: string =''

  item_id: string=''
  itemList: any = [];
  pageTitle: string = ''

  constructor(
    private adminservice: AdminApiService,
    private common: CommonService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewItemComponent>, @Inject(MAT_DIALOG_DATA)
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.item_id = this.data.id
    this.itemList =this.data.itemList
  }

  closePopup() {
    this.dialogRef.close();
  }

  Comment(){
    const formData: any = {
      message: this.addComment.value.comment,
      box_name: this.data.comment_box,
      user_id: this.data.user_id
    }
    console.log(formData)
    this.adminservice.commentOnReg(formData).subscribe(
      res => {
        if(res['status'] == 1){
          this.closePopup();
        }
        else{
          this.common.openSnackBar('Cannot able to comment please try later', '');
        }
      },
      err => {
        this.common.openSnackBar('please try later', '');
      }
    );
  }

}
