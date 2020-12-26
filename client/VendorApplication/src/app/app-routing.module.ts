import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SignuplayoutComponent } from './layouts/signuplayout/signuplayout.component';
import { LoginComponent } from './signups_logins/login/login.component';

const LOGIN_SIGNUP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent }
];

const MAIN_LAYOUT: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  // { path: 'vendor-list', component: VendorListComponent},
  // { path: 'vendor-info/:list_id', component: VendorInfoComponent},
  // { path: 'city-area', component: CityAreaComponent},
  // { path: 'category', component: CategoryListComponent},
  // { path: 'cat-ietm/:list_id', component: CategoryItemListComponent}
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
