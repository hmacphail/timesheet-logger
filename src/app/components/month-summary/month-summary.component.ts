import { Component, OnInit } from "@angular/core";
import { DateTime } from "luxon";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { TimeEntryService } from "src/app/services/time-entry.service";
import { ITimeEntry } from "src/app/models/time-entry";

@Component({
  templateUrl: "./month-summary.component.html",
  styleUrls: ["./month-summary.component.scss"]
})
export class MonthSummaryComponent implements OnInit {

  allTimeEntries: ITimeEntry[] = [];
  visibleTimeEntries: ITimeEntry[] = [];

  selectedMonth: number = DateTime.now().month;
  months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

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
      this.setupTimeEntries(entries);
    });
  }

  setupTimeEntries(entries: ITimeEntry[]) {
    // sort time entries
    this.allTimeEntries = entries.sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      else if (a.startTime > b.startTime) return 1;
      else return 0;
    });

    // filter by selected month
    this.setMonthFilter(this.allTimeEntries);

    // complete page load animation
    this.loaderService.stop();
  }

  getDuration(timeEntry: ITimeEntry) {
    const start = DateTime.fromISO(timeEntry.startTime as string);
    const end = DateTime.fromISO(timeEntry.endTime as string);

    const duration = end.diff(start, ["hours", "minutes"]);
    const paddedMins = (duration.minutes < 10) ? "0" + duration.minutes : duration.minutes.toString();

    if (duration.hours > 0) {
      return `${duration.hours}h${paddedMins}m`;
    }
    return `${paddedMins}m`;
  }

  setMonthFilter(allEntries?: ITimeEntry[]) {
    if (!allEntries) {
      allEntries = this.allTimeEntries;
    }
    this.visibleTimeEntries = allEntries.filter((te) => {
      const dateTime = DateTime.fromISO(te.startTime as string);
      return dateTime.month == this.selectedMonth && dateTime.year == DateTime.now().year;
    });
  }

}
