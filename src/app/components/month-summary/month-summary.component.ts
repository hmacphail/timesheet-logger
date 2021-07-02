import { Component, OnInit } from "@angular/core";

import { TimeEntryService } from "src/app/services/time-entry.service";
import { ITimeEntry } from "src/app/models/time-entry";

@Component({
  templateUrl: "./month-summary.component.html",
  styleUrls: ["./month-summary.component.scss"]
})
export class MonthSummaryComponent implements OnInit {

  timeEntries: ITimeEntry[] = [];

  constructor(
    private timeEntryService: TimeEntryService
  ) { }

  ngOnInit(): void {
    this.getTimeEntries();
  }

  getTimeEntries() {
    this.timeEntryService.getAllTimeEntries().subscribe((entries) => {
      this.timeEntries = entries;
    });
  }

}
