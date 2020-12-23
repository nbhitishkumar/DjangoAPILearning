import { OnInit } from '@angular/core';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform } from '@ionic/angular';
import { GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { LoadingController } from '@ionic/angular';  
import { AlertController } from '@ionic/angular'; 
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
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
  selector: 'app-mystore',
  templateUrl: './mystore.page.html',
  styleUrls: ['./mystore.page.scss'],
})
export class MystorePage implements OnInit {
  options : GeolocationOptions;
  currentPos : Geoposition;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public navCtrl: NavController,
    private platform: Platform) {
  }

  // options = {
  //   timeout: 10000, 
  //   enableHighAccuracy: true, 
  //   maximumAge: 3600
  // };


  ngOnInit() {
    this.getUserPosition();
  }

  getUserPosition(){
    this.options = {
      enableHighAccuracy : false
  };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;     

        console.log(pos);
        this.addMap(12.9716,77.5946);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
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
}

  // loadMap() {
  //   this.geolocation.getCurrentPosition().then((resp) => {

  //     this.latitude = resp.coords.latitude;
  //     this.longitude = resp.coords.longitude;

  //     let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 15,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     }

  //     this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //     this.map.addListener('dragend', () => {

  //       this.latitude = this.map.center.lat();
  //       this.longitude = this.map.center.lng();

  //       this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
  //     });

  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }

  // getAddressFromCoords(lattitude, longitude) {
  //   console.log("getAddressFromCoords " + lattitude + " " + longitude);
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };

  //   this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       this.address = "";
  //       let responseAddress = [];
  //       for (let [key, value] of Object.entries(result[0])) {
  //         if (value.length > 0)
  //           responseAddress.push(value);

  //       }
  //       responseAddress.reverse();
  //       for (let value of responseAddress) {
  //         this.address += value + ", ";
  //       }
  //       this.address = this.address.slice(0, -2);
  //     })
  //     .catch((error: any) => {
  //       this.address = "Address Not Available!";
  //     });

  // }


// }