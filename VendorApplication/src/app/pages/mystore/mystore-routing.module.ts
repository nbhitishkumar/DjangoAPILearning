import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MystorePage } from './mystore.page';

const routes: Routes = [
  {
    path: '',
    component: MystorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MystorePageRoutingModule {}
