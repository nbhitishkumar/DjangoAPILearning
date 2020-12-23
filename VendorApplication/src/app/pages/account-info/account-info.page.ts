import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { AlertController, NavController } from '@ionic/angular'; 
import { LoadingController } from '@ionic/angular';  
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { LoginsignupService } from 'src/app/services/login_signup/loginsignup.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
})
export class AccountInfoPage implements OnInit {
  options : GeolocationOptions;
  currentPos : Geoposition;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  stateList: any =[];
  cityList: any =[];
  areaList: any=[];

  lati: number;  
  longi: number;
  regInfo: FormGroup;
  userDetails: any = [];
  ownerImage = 'assets/img/user.png'
  shopImage = 'assets/img/download.png'
  fssaiCertificateImg = 'assets/img/gst.png'
  aadharFrontImage = 'assets/img/aadhar_card_icon_.jpg'
  aadharBackImage = 'assets/img/aadhar_card_icon_.jpg'
  gitinCertificateImg ='assets/img/gst.png'
  shopName = new FormControl('', [Validators.required]);
	shopAddress = new FormControl('', [Validators.required]);
	shopLandmark = new FormControl('', [Validators.required]);
  shopMall = new FormControl('', [Validators.required]);
  shopCity = new FormControl('', [Validators.required]);
  shopArea = new FormControl('', [Validators.required]);
  ownerName = new FormControl('', [Validators.required]);
  shopState = new FormControl('', [Validators.required]);
  shopFloor = new FormControl('', [Validators.required]);
  shopGstinType = new FormControl('', [Validators.required]);
  shopPin = new FormControl('', [Validators.required]);
  shopGstinPresent = new FormControl('', [Validators.required]);
	shopGstinNumber = new FormControl('', [Validators.required]);
	shopRefg = new FormControl('', [Validators.required]);
  shopGstinState = new FormControl('', [Validators.required]);
  shopFssaiNumber = new FormControl('', [Validators.required]);
  shopFssaiReg = new FormControl('', [Validators.required]);
	shopFssaiExp = new FormControl('', [Validators.required]);
  shopFssaiAddress = new FormControl('', [Validators.required]);
  latitude = new FormControl('', [Validators.required]);
  longitude = new FormControl('', [Validators.required]);
  constructor(
    fb: FormBuilder,
    private geolocation: Geolocation,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private common: CommonService,
    private nativeGeocoder: NativeGeocoder,
    public navCtrl: NavController,
    private router: Router,
    private loginsignup: LoginsignupService,
    private userservice: UserService,
    private adminservice: AdminApiService
  ) {
    this.regInfo = fb.group({
      shopName: this.shopName,
      shopAddress: this.shopAddress,
      shopLandmark: this.shopLandmark,
      shopMall: this.shopMall,
      shopCity: this.shopCity,
      shopState: this.shopState,
      shopFloor: this.shopFloor,
      shopGstinPresent : this.shopGstinPresent,
      shopGstinNumber: this.shopGstinNumber,
      shopRefg: this.shopRefg,
      shopPin: this.shopPin,
      ownerName: this.ownerName,
      shopGstinType: this.shopGstinType,
      shopGstinState: this.shopGstinState,
      shopFssaiNumber: this.shopFssaiNumber,
      shopFssaiReg: this.shopFssaiReg,
      shopFssaiExp: this.shopFssaiExp,
      shopFssaiAddress: this.shopFssaiAddress,
      shopArea: this.shopArea,
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

  ngOnInit() {
    this.getUserPosition();
    this.loginsignup.vendorProfileInfo().subscribe(
      res => {
        if(res['status'] == 1){
          console.log(res['profile_details']);
          this.regInfo.setValue({
            shopName: res['profile_details'][0]['shop_name'],
            shopAddress: res['profile_details'][0]['shop_name'],
            shopLandmark: res['profile_details'][0]['shop_landmark'],
            shopMall: res['profile_details'][0]['shop_name'],
            shopCity:res['profile_details'][0]['shop_city'],
            shopState: res['profile_details'][0]['state'],
            shopFloor: res['profile_details'][0]['floor_no'],
            ownerName: res['profile_details'][0]['owner_name'],
            shopGstinType : res['profile_details'][0]['gst_type'],
            shopGstinPresent: res['profile_details'][0]['gstin_present'],
            shopGstinNumber: res['profile_details'][0]['gstin_number'],
            shopRefg: res['profile_details'][0]['shop_name'],
            shopPin: res['profile_details'][0]['pin_code'],
            shopGstinState: res['profile_details'][0]['gst_state'],
            shopFssaiNumber: res['profile_details'][0]['fssai_number'],
            shopFssaiReg: res['profile_details'][0]['fssai_reg_name'],
            shopFssaiExp: res['profile_details'][0]['fssai_exp_date'],
            shopFssaiAddress: res['profile_details'][0]['fssai_address'],
            shopArea: res['profile_details'][0]['shop_area'],
          })
        }
      },
      err => {
        console.log('ERROR', err.status);
      },
    );
    this.getStateList();
    }

    getStateList(){
      this.adminservice.stateList().subscribe(
        res => {
          if(res['status'] == 1){
            this.stateList = res['states'];
          }
          else{
            this.showLoader("No Service");
            // this.common.openSnackBar('Domain is not save please try later', '');
          }
        },
        err => {
          console.log("ERROR");
          console.log(err);
          // this.common.openSnackBar('please try later', '');
        }
      );
    }



    onSelection(event){
      const formData: any = {
        state_id: event
      }
      console.log(formData)
      this.adminservice.cityListById(formData).subscribe(
        res => {
          if(res['status'] == 1){
            console.log(res['area']);
            this.cityList = res['area'];
          }
          else{
            this.cityList = [];
          }
        },
        err => {
          console.log("ERROR");
          console.log(err);
          this.cityList = [];
          // this.common.openSnackBar('please try later', '');
        }
      );
    }

    onSelectionCity(event){
      const formData: any = {
        city_id: event
      }
      console.log(formData)
      this.adminservice.areaListById(formData).subscribe(
        res => {
          if(res['status'] == 1){
            console.log(res['area'][0]['pin_code']);
            this.areaList = res['area'];
          }
          else{
            this.areaList = [];
          }
        },
        err => {
          console.log("ERROR");
          console.log(err);
          this.areaList = [];
          // this.common.openSnackBar('please try later', '');
        }
      );
    }

    onSelectionArea(event){
      const formData: any = {
        area_id: event
      }
      console.log(formData)
      this.adminservice.pinCoceById(formData).subscribe(
        res => {
          if(res['status'] == 1){
            console.log(res['area'])
          }
          else{
            this.areaList = [];
          }
        },
        err => {
          console.log("ERROR");
          console.log(err);
          this.areaList = [];
          // this.common.openSnackBar('please try later', '');
        }
      );
    }


  // async getCurrentLocation() {  
  //   const loading = await this.loadingController.create({  
  //     message: 'Please wait...',  
  //     });  
  //   await loading.present();  
  
  //   this.geolocation.getCurrentPosition({maximumAge: 1000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {  
  //     resp.coords.latitude  
  //     resp.coords.longitude  
  //     loading.dismiss();  
  //     this.lati = resp.coords.latitude;  
  //     this.longi = resp.coords.longitude;  
  //     }, er => {
  //       loading.dismiss();  
  //       this.showLoader('Can not retrieve Location Allow Location Access');  
  //     }).catch((error) => {
  //     loading.dismiss();  
  //     this.showLoader('Error getting location - ' + JSON.stringify(error));  
  //     });  
  // }  

  async showLoader(msg) {  
    const alert = await this.alertController.create({  
      message: msg,  
      buttons: ['OK']  
    });  
  
    await alert.present();  
  } 


  async getUserPosition(){
    const loading = await this.loadingController.create({  
      message: 'Getting user location ...',  
      });  
    await loading.present();  
    this.geolocation.getCurrentPosition({maximumAge: 1000, timeout: 5000, enableHighAccuracy: true }).then((pos : Geoposition) => {
        this.currentPos = pos;     
        this.lati = pos.coords.latitude;  
        this.longi = pos.coords.longitude;
        this.addMap(pos.coords.latitude,pos.coords.longitude);
        loading.dismiss(); 
    },(err : PositionError)=>{
        loading.dismiss();  
        this.showLoader('Can not retrieve Location Allow Location Access');  
    ;
    }) 
  }
  addMap(lat,long){
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
}

  addMarker(){
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });
    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

}


  async Register(){
    const loading = await this.loadingController.create({  
      message: 'Please wait...',  
      });  
    await loading.present();
    if (this.regInfo.valid){
      const reqData: any = {
        shop_name: this.regInfo.value.shopName,
        address: this.regInfo.value.shopAddress,
        shop_landmark: this.regInfo.value.shopLandmark,
        mall_name: this.regInfo.value.shopMall,
        shop_city: this.regInfo.value.shopCity,
        state: this.regInfo.value.shopState,
        gst_state: this.regInfo.value.shopGstinState,
        floor_no: this.regInfo.value.shopFloor,
        gstin_present : this.regInfo.value.shopGstinPresent,
        gstin_number: this.regInfo.value.shopGstinNumber,
        registration_date: this.regInfo.value.shopRefg,
        pin_code: this.regInfo.value.shopPin,
        fssai_number: this.regInfo.value.shopFssaiNumber,
        fssai_reg_name: this.regInfo.value.shopFssaiReg,
        fssai_exp_date: this.regInfo.value.shopFssaiExp,
        fssai_address: this.regInfo.value.shopFssaiAddress,
        latitude: this.lati,
        longitude:  this.longi,
        owner_name: this.regInfo.value.ownerName,
        gst_type: this.regInfo.value.shopGstinType,
        shop_area: this.regInfo.value.shopArea
      }
      this.loginsignup.vendorUpdateProfileInfo(reqData).subscribe(
        res => {
          if(res['status'] == 1){
            loading.dismiss();
            this.showLoader('Submitted');
            this.router.navigate(['/home/profile']);
          }
          else{
            loading.dismiss();
            this.showLoader(res['massage']);
          }
        },
        err => {
          loading.dismiss();
          console.log('ERROR', err.status);
        },
      );
    }
    else{
      loading.dismiss();
    }
  }


  addImage(event) {
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
      alert('Please upload jpeg/jpg/png files only');
		}
  }



  addOwnerImage(event) {
    var files: any = {};
		var target: HTMLInputElement = event.target as HTMLInputElement;
		let fileType = target.files[0].type;
    files = target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
    target.files[0].type === "image/jpg" ||
    target.files[0].type === "image/png") {
      var form_data = new FormData();
		  form_data.append("file", files);
		  form_data.append('file_type', fileType);
		  form_data.append('up_dir', 'owner_image');
      this.userservice.uploadProfileImage(form_data).subscribe(
        res => {
          if(res['status']==1) {
              this.common.setOwnerImage(res['base64_image']);
              } else {
                alert('Image is not upload')
              }
        },
        err => {
          console.log(err)
        }
      );
		} else {
      alert('Please upload jpeg/jpg/png files only');
		}
  }


  addAadharFrontImage(event) {
    var files: any = {};
		var target: HTMLInputElement = event.target as HTMLInputElement;
		let fileType = target.files[0].type;
    files = target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
    target.files[0].type === "image/jpg" ||
    target.files[0].type === "image/png") {
      var form_data = new FormData();
		  form_data.append("file", files);
		  form_data.append('file_type', fileType);
		  form_data.append('up_dir', 'aadhaar_front_image');
      this.userservice.uploadProfileImage(form_data).subscribe(
        res => {
          if(res['status']==1) {
              this.common.setAadharFrontImage(res['base64_image']);
              } else {
                alert('Image is not upload')
              }
        },
        err => {
          console.log(err)
        }
      );
		} else {
      alert('Please upload jpeg/jpg/png files only');
		}
  }


  addAadharBackImage(event) {
    var files: any = {};
		var target: HTMLInputElement = event.target as HTMLInputElement;
		let fileType = target.files[0].type;
    files = target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
    target.files[0].type === "image/jpg" ||
    target.files[0].type === "image/png") {
      var form_data = new FormData();
		  form_data.append("file", files);
		  form_data.append('file_type', fileType);
		  form_data.append('up_dir', 'aadhaar_back_image');
      this.userservice.uploadProfileImage(form_data).subscribe(
        res => {
          if(res['status']==1) {
              this.common.setAadharBackImage(res['base64_image']);
              } else {
                alert('Image is not upload')
              }
        },
        err => {
          console.log(err)
        }
      );
		} else {
      alert('Please upload jpeg/jpg/png files only');
		}
  }

  saveImage(file, file_type) {
		var form_data = new FormData();
		form_data.append("file", file);
		form_data.append('file_type', file_type);
		form_data.append('up_dir', 'shop_image');
		this.userservice.uploadProfileImage(form_data).subscribe(
			res => {
				if(res['status']==1) {
            this.common.setShopImage(res['base64_image']);
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
  
  addGstinImage(event) {
    var files: any = {};
		var target: HTMLInputElement = event.target as HTMLInputElement;
		let fileType = target.files[0].type;
    files = target.files[0];
    console.log(target.files[0].type);
		var reader = new FileReader();
		reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
    target.files[0].type === "image/jpg" ||
    target.files[0].type === "image/png") {
      var form_data = new FormData();
		  form_data.append("file", files);
		  form_data.append('file_type', fileType);
		  form_data.append('up_dir', 'gstin_image');
      this.userservice.uploadProfileImage(form_data).subscribe(
        res => {
          if(res['status']==1) {
              this.common.setGstinCertificate(res['base64_image']);
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
		} else {
      alert('Please upload jpeg/jpg/png files only');
			// this.cs.openSnackBar('Please upload jpeg/jpg/png files only','');
		}
  }

  addFssaiImage(event) {
    var files: any = {};
		var target: HTMLInputElement = event.target as HTMLInputElement;
		let fileType = target.files[0].type;
    files = target.files[0];
    console.log(target.files[0].type);
		var reader = new FileReader();
		reader.readAsDataURL(target.files[0]);
    if (target.files[0].type === "image/jpeg" ||
    target.files[0].type === "image/jpg" ||
    target.files[0].type === "image/png") {
      var form_data = new FormData();
		  form_data.append("file", files);
		  form_data.append('file_type', fileType);
		  form_data.append('up_dir', 'fssai_image');
      this.userservice.uploadProfileImage(form_data).subscribe(
        res => {
          if(res['status']==1) {
              this.common.setFssaiCertificate(res['base64_image']);
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
		} else {
      alert('Please upload jpeg/jpg/png files only');
			// this.cs.openSnackBar('Please upload jpeg/jpg/png files only','');
		}
  }

}
