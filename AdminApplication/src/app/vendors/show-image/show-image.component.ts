import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.css']
})
export class ShowImageComponent implements OnInit {
  comment = new FormControl('', [Validators.required]);
  addComment: FormGroup;
  fssaiCertificateImg=""
  pageTitle: string = 'Add Category'

  constructor(
    public dialogRef: MatDialogRef<ShowImageComponent>,
    _formbuilder: FormBuilder,
    private common: CommonService,
    private adminservice: AdminApiService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addComment = _formbuilder.group({
      comment: this.comment,
    });
   }

  ngOnInit(): void {
    this.fssaiCertificateImg = this.data.image;
    this.pageTitle= this.data.img_name;
    console.log(this.data.user_id);
  }

  closePopup(){
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
