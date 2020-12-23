import { CommonService } from 'src/app/services/common/common.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {
  vendorDetails: any = [];

  constructor(
    private router: Router,
    private adminlogin: AdminApiService,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.getvendorList();
  }

  getvendorList(){
    this.adminlogin.vendorList().subscribe(
      res => {
        if(res['status'] == 1){
          this.vendorDetails = res['vendorList'];
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
  }

  viewVendor(list_id){
    this.router.navigate(["/vendor-info", list_id]);
  }

  deleteAccount(list_id){
    // console.log(list_id);
    const reqData: any = {
      user_id: list_id,
      is_deleted: true
    }
    this.adminlogin.deleteVendorAccount(reqData).subscribe(
      res => {
        if(res['status'] == 1){
          this.getvendorList();
        }
        else{
          this.common.openSnackBar('cannot able to delete', '');
        }
      },
      err => {
        console.log('ERROR', err.status);
        this.common.openSnackBar('Some error occured, please try again later', '');
      },
    );
  }


}
