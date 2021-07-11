import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderModule } from "ngx-ui-loader";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { MonthSummaryComponent } from "./components/month-summary/month-summary.component";
import { NewEntryComponent } from "./components/new-entry/new-entry.component";

@NgModule({
  declarations: [
    AppComponent,
    MonthSummaryComponent,
    NewEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxUiLoaderModule.forRoot({
      hasProgressBar: false,
      fgsColor: "rgba(255,255,255,0.8)",
      overlayColor: "rgba(0,0,0,0.5)"
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
