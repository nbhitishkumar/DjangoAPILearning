import { ShowImageComponent } from './../show-image/show-image.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentBoxComponent } from 'src/app/common/comment-box/comment-box.component';

@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.css']
})
export class VendorInfoComponent implements OnInit {
  public list_id: string;
  vendorDetails: any = [];
  profileImage = '';
  ownerImage = ''
  shopImage = ''
  fssaiCertificateImg = ''
  aadharFrontImage = ''
  aadharBackImage = ''
  gitinCertificateImg =''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private adminlogin: AdminApiService,
    private common: CommonService,
    private userservice: UserService,
  ) {
    this.common.profileImageCallBackResult$.subscribe(value =>{
		  if(value){
			this.profileImage = this.common.profileImage;
		  }
    });

    this.common.shopImageCallBackResult$.subscribe(value =>{
		  if(value){
      this.shopImage = this.common.shopImage;
		  }
    });
    this.common.ownerImageCallBackResult$.subscribe(value =>{
		  if(value){
      this.ownerImage = this.common.ownerImage;
		  }
    });
    this.common.aadharFrontImageCallBackResult$.subscribe(value =>{
		  if(value){
      this.aadharFrontImage = this.common.aadharFrontImage;
		  }
    });
    this.common.aadharBackImageCallBackResult$.subscribe(value =>{
		  if(value){
      this.aadharBackImage = this.common.aadharBackImage;
		  }
    });

    this.common.gstinCertificateCallBackResult$.subscribe(value =>{
		  if(value){
      this.gitinCertificateImg = this.common.gitinCertificateImg;
		  }
    });

    this.common.fssaiCertificateCallBackResult$.subscribe(value =>{
		  if(value){
      this.fssaiCertificateImg = this.common.fssaiCertificateImg;
		  }
		});

   }

  ngOnInit(): void {
    this.list_id = this.route.snapshot.paramMap.get('list_id');
    this.getvendorinfoList(this.list_id);
  }

  getvendorinfoList(list_id){
    const reqData: any = {
      user_id: list_id
    }
    this.adminlogin.vendorInfo(reqData).subscribe(
      res => {
        if(res['status'] == 1){
          this.vendorDetails = res['vendorInfo'][0];
          if(this.vendorDetails.shop_image != ''){
            this.common.setShopImage(this.vendorDetails.shop_image);
          }
          if(this.vendorDetails.owner_image !=''){
            this.common.setOwnerImage(this.vendorDetails.owner_image);
          }
          if(this.vendorDetails.gstin_image !=''){
            this.common.setGstinCertificate(this.vendorDetails.gstin_image);
          }
          if(this.vendorDetails.aadhaar_back_image !=''){
            this.common.setAadharBackImage(this.vendorDetails.aadhaar_back_image);
          }
          if(this.vendorDetails.aadhaar_front_image !=''){
            this.common.setAadharFrontImage(this.vendorDetails.aadhaar_front_image);
          }
          if(this.vendorDetails.fssai_image !=''){
            this.common.setFssaiCertificate(this.vendorDetails.fssai_image);
          }
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
  }

  Open(){
    console.log(this.vendorDetails.fssai_image)
  }

  Approve(){
    console.log('Approved');
    const reqData: any ={
      user_id: this.list_id,
      is_shop_verified: true
    }
    this.adminlogin.approveVendorAccount(reqData).subscribe(
      res => {
        if(res['status'] == 1){
          alert('Approved')
          this.router.navigate(["/vendor-list"]);
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
  }



  Decline(){
    console.log('Approved');
    const reqData: any ={
      user_id: this.list_id,
      is_shop_verified: false
    }
    this.adminlogin.approveVendorAccount(reqData).subscribe(
      res => {
        if(res['status'] == 1){
          alert('Not Approved')
          this.router.navigate(["/vendor-list"]);
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
  }


  dialogRefTags : MatDialogRef<ShowImageComponent> | null;
  showFssai(list_id){
    this.dialogRefTags = this.dialog.open(ShowImageComponent, {
      data: {
        id: list_id,
        image: this.fssaiCertificateImg,
        img_name: "Fssai Certificate",
        comment_box: "fssai_comment",
        user_id: this.vendorDetails.id
      },
        disableClose: true,
      });
      this.dialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
      });
  }

  ownerdialogRefTags : MatDialogRef<ShowImageComponent> | null;
  ownerVImage(list_id){
    this.ownerdialogRefTags = this.dialog.open(ShowImageComponent, {
      data: {
        id: list_id,
        image: this.ownerImage,
        img_name: "Owner Image",
        comment_box: "owner_comment",
        user_id: this.vendorDetails.id
      },
        disableClose: true,
      });
      this.ownerdialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
      });
  }

  shopdialogRefTags : MatDialogRef<ShowImageComponent> | null;
  shopVImage(list_id){
    this.shopdialogRefTags = this.dialog.open(ShowImageComponent, {
      data: {
        id: list_id,
        image: this.shopImage,
        img_name: "Shop Image",
        comment_box: "shop_comment",
        user_id: this.vendorDetails.id
      },
        disableClose: true,
      });
      this.shopdialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
      });
  }

  frontdialogRefTags : MatDialogRef<ShowImageComponent> | null;
  showFrontImage(list_id){
    this.frontdialogRefTags = this.dialog.open(ShowImageComponent, {
      data: {
        id: list_id,
        image: this.aadharFrontImage,
        img_name: "Aadhar Card Front Image",
        comment_box: "aadhar_front_comment",
        user_id: this.vendorDetails.id
      },
        disableClose: true,
      });
      this.frontdialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
      });
  }

  backdialogRefTags : MatDialogRef<ShowImageComponent> | null;
  showBackImage(list_id){
    this.backdialogRefTags = this.dialog.open(ShowImageComponent, {
      data: {
        id: list_id,
        image: this.aadharBackImage,
        img_name: "Aadhar Card Back Image",
        comment_box: "aadhar_back_comment",
        user_id: this.vendorDetails.id
      },
        disableClose: true,
      });
      this.backdialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
      });
  }

  gstindialogRefTags : MatDialogRef<ShowImageComponent> | null;
  showGstin(list_id){
    this.gstindialogRefTags = this.dialog.open(ShowImageComponent, {
      data: {
        id: list_id,
        image: this.gitinCertificateImg,
        img_name: "GSTIN IMAGE",
        shop_comment: "shop_comment",
        comment_box: "gstin_comment",
        user_id: this.vendorDetails.id
      },
        disableClose: true,
      });
      this.gstindialogRefTags.afterClosed().subscribe(result => {
        console.log('afterClosed', result);
      });
  }

  // commentdialogRefTags : MatDialogRef<CommentBoxComponent> | null;
  // CommentBox(list_id){
  //   this.commentdialogRefTags = this.dialog.open(CommentBoxComponent, {
  //     data: {
  //       id: list_id,
  //       image: this.gitinCertificateImg,
  //     },
  //       disableClose: true,
  //     });
  //     this.commentdialogRefTags.afterClosed().subscribe(result => {
  //       console.log('afterClosed', result);
  //     });

  // }



}
