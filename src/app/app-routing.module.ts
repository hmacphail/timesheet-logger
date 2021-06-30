import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MonthSummaryComponent } from './month-summary/month-summary.component';

const routes: Routes = [
  {
    path: "",
    component: MonthSummaryComponent
  },
  // {
  //   path: "",
  //   component:
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
