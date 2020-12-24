import { CategoryListComponent } from './dynamic_menu/category-list/category-list.component';
import { CityAreaComponent } from './admin/city-area/city-area.component';
import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SignuplayoutComponent } from './layouts/signuplayout/signuplayout.component';
import { LoginComponent } from './signups_logins/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { VendorInfoComponent } from './vendors/vendor-info/vendor-info.component';
import { CategoryItemListComponent } from './dynamic_menu/category-item-list/category-item-list.component';

const LOGIN_SIGNUP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent }
];

const MAIN_LAYOUT: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'vendor-list', component: VendorListComponent},
  { path: 'vendor-info/:list_id', component: VendorInfoComponent},
  { path: 'city-area', component: CityAreaComponent},
  { path: 'category', component: CategoryListComponent},
  { path: 'cat-ietm/:list_id', component: CategoryItemListComponent}
];

const APP_ROUTES: Routes = [
  { path: '', component: SignuplayoutComponent, children: LOGIN_SIGNUP_ROUTES },
  { path: '', component: MainLayoutComponent, children: MAIN_LAYOUT },
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
