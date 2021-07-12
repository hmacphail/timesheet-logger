import { Component, OnInit } from "@angular/core";
import { DateTime } from "luxon";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { DefaultRent, RentDiscount, WeeklyDiscountTiers } from "src/app/models/discount";
import { TimeEntryService } from "src/app/services/time-entry.service";
import { ITimeEntry } from "src/app/models/time-entry";

@Component({
  templateUrl: "./month-summary.component.html",
  styleUrls: ["./month-summary.component.scss"]
})
export class MonthSummaryComponent implements OnInit {

  allTimeEntries: ITimeEntry[] = [];
  visibleTimeEntries: ITimeEntry[] = [];

  readonly NOW = DateTime.now();
  selectedMonth: number = this.NOW.month;
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

  readonly WEEKS_PER_MNTH = 4.2;

  discountTableEntries: IDiscountTableEntry[] = [];

  currentHrsPerWk: number = 0;
  currentHrsPerMnth: number = 0;
  currentDiscount: number = 0;
  currentRent: number = DefaultRent;

  constructor(
    private timeEntryService: TimeEntryService,
    private loaderService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.start();
    this.getTimeEntries();
    this.setupDiscountTable();
  }

  // ---------- PAGE SETUP -------------

  getTimeEntries(): void {
    this.timeEntryService.getAllTimeEntries().subscribe((entries) => {
      this.setupTimeEntries(entries);
    });
  }

  setupTimeEntries(entries: ITimeEntry[]): void {
    // sort time entries
    this.allTimeEntries = entries.sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      else if (a.startTime > b.startTime) return 1;
      else return 0;
    });

    // filter by selected month
    this.setMonthFilter();

    // complete page load animation
    this.loaderService.stop();
  }

  setupDiscountTable(): void {
    for (const wkTier in WeeklyDiscountTiers) {
      const weekTier: number = Number.parseInt(wkTier);
      if (!isNaN(weekTier)) {
        const rentDiscount = RentDiscount[wkTier];
        const isExtraTier = (weekTier == WeeklyDiscountTiers.Six || weekTier == WeeklyDiscountTiers.Seven
          || weekTier == WeeklyDiscountTiers.Eight || weekTier == WeeklyDiscountTiers.Nine);

        this.discountTableEntries.push({
          discount: rentDiscount,
          hrsPerWk: weekTier,
          hrsPerMnth: Math.round(weekTier * this.WEEKS_PER_MNTH),
          rent: DefaultRent - rentDiscount,
          isExtraTier: isExtraTier
        });
      }
    }
  }

  // -------- INTERFACE ACTIONS ---------

  getDuration(timeEntry: ITimeEntry): string {
    const start = DateTime.fromISO(timeEntry.startTime as string);
    const end = DateTime.fromISO(timeEntry.endTime as string);

    const duration = end.diff(start, ["hours", "minutes"]);
    const paddedMins = (duration.minutes < 10) ? "0" + duration.minutes : duration.minutes.toString();

    if (duration.hours > 0) {
      return `${duration.hours}h${paddedMins}m`;
    }
    return `${paddedMins}m`;
  }

  setMonthFilter(): void {
    // filter entries table to selected month
    this.visibleTimeEntries = this.allTimeEntries.filter((te) => {
      const dateTime = DateTime.fromISO(te.startTime as string);
      return dateTime.month == this.selectedMonth && dateTime.year == this.NOW.year;
    });

    // re-calculate discount for selected month
    this.calculateMonthlyData();
  }

  private calculateMonthlyData(): void {
    // reset data
    this.currentHrsPerMnth = 0;
    this.currentHrsPerWk = 0;
    this.currentDiscount = 0;
    this.currentRent = DefaultRent;

    const thisWeekNumber = this.NOW.weekNumber;

    // iterate through filtered time entries
    for (const monthEntry of this.visibleTimeEntries) {
      const startDateTime = DateTime.fromISO(monthEntry.startTime as string);
      const endDateTime = DateTime.fromISO(monthEntry.endTime as string);
      const duration = endDateTime.diff(startDateTime, "hours");

      this.currentHrsPerMnth += duration.hours;
      if (startDateTime.weekNumber == thisWeekNumber) {
        this.currentHrsPerWk += duration.hours;
      }
    }

    // calculate rent and discount
    for (const wkTier in WeeklyDiscountTiers) {
      const weekTier: number = Number.parseInt(wkTier);
      if (!isNaN(weekTier)) {
        const mnthTier = weekTier * this.WEEKS_PER_MNTH;

        // if monthly hours is greater than tier, tier has been hit, continue
        if (this.currentHrsPerMnth >= mnthTier) {
          this.currentDiscount = RentDiscount[wkTier];
        }
        else {
          break;
        }
      }
    }
    this.currentRent = DefaultRent - this.currentDiscount;
  }

}

interface IDiscountTableEntry {
  discount: number;
  rent: number;
  hrsPerWk: number;
  hrsPerMnth: Number;
  isExtraTier: boolean;
}
