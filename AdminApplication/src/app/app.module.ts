import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SignuplayoutComponent } from './layouts/signuplayout/signuplayout.component';
import { LoginComponent } from './signups_logins/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from './services/common/common.service';
import { ConfigurationService } from './services/config/configuration.service';
import { ProfileComponent } from './user/profile/profile.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { HttpClient, HttpHeaders, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VendorInfoComponent } from './vendors/vendor-info/vendor-info.component';
import { CityAreaComponent } from './admin/city-area/city-area.component';
import { AddEditServiceAreaComponent } from './admin/add-edit-service-area/add-edit-service-area.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddCityComponent } from './admin/add-city/add-city.component';
import { AddStateComponent } from './admin/add-state/add-state.component';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AgmCoreModule } from '@agm/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ShowImageComponent } from './vendors/show-image/show-image.component';
import { AddEditCategoryComponent } from './admin/add-edit-category/add-edit-category.component';
import { CategoryListComponent } from './admin/category-list/category-list.component';
import { AgmDrawingModule } from '@agm/drawing'


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SignuplayoutComponent,
    LoginComponent,
    ProfileComponent,
    DashboardComponent,
    VendorListComponent,
    VendorInfoComponent,
    CityAreaComponent,
    AddEditServiceAreaComponent,
    AddCityComponent,
    AddStateComponent,
    ShowImageComponent,
    AddEditCategoryComponent,
    CategoryListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5eb89wDUlHL1b-SCBtptGpOfqG09BH-k',
      libraries: ['places', 'drawing', 'geometry']
     }),
     AgmDrawingModule
  ],
  entryComponents: [
    AddEditServiceAreaComponent,
    AddCityComponent,
    AddStateComponent,
    ShowImageComponent,
    AddEditCategoryComponent
  ],
  providers: [
    CommonService,
		ConfigurationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
