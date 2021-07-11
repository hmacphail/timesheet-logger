import { Component, OnInit } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { TimeEntryService } from "src/app/services/time-entry.service";
import { ITimeEntry } from "src/app/models/time-entry";

@Component({
  templateUrl: "./month-summary.component.html",
  styleUrls: ["./month-summary.component.scss"]
})
export class MonthSummaryComponent implements OnInit {

  timeEntries: ITimeEntry[] = [];

  constructor(
    private timeEntryService: TimeEntryService,
    private loaderService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.start();
    this.getTimeEntries();
  }

  getTimeEntries() {
    this.timeEntryService.getAllTimeEntries().subscribe((entries) => {
      // sort time entries
      this.timeEntries = entries.sort((a, b) => {
        if (a.startTime < b.startTime) return -1;
        else if (a.startTime > b.startTime) return 1;
        else return 0;
      });
      // complete page load animation
      this.loaderService.stop();
    });
  }

}
