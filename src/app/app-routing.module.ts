import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MonthSummaryComponent } from "./components/month-summary/month-summary.component";
import { NewEntryComponent } from "./components/new-entry/new-entry.component";

const routes: Routes = [
  {
    path: "",
    component: NewEntryComponent
  },
  {
    path: "month",
    component: MonthSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
