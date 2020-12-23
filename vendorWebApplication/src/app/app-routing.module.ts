import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SignuplayputComponent } from './layouts/signuplayput/signuplayput.component';
import { LoginComponent } from './signups_logins/login/login.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
];


const LOGIN_SIGNUP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent }
];

const MAIN_LAYOUT: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
];

const APP_ROUTES: Routes = [
  { path: '', component: SignuplayputComponent, children: LOGIN_SIGNUP_ROUTES },
  { path: '', component: MainLayoutComponent, children: MAIN_LAYOUT },
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
