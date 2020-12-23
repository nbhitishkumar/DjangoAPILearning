import { Component, OnInit, ViewChild } from '@angular/core';
import {AgmMap, MapsAPILoader  } from '@agm/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(AgmMap,{static: true}) public agmMap: AgmMap;
  lat = 20.5937;
  lng = 78.9629;

  constructor() { }

  ngOnInit(): void {
  }

}
