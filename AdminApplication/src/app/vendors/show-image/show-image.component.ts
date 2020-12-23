import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.css']
})
export class ShowImageComponent implements OnInit {
  fssaiCertificateImg=""

  constructor(
    public dialogRef: MatDialogRef<ShowImageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.fssaiCertificateImg = this.data.image;
    console.log(this.fssaiCertificateImg);
  }

  closePopup(){
    this.dialogRef.close();
  }

}
