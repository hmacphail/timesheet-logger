import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { ITimeEntry } from "src/app/models/time-entry";

import { TimeEntryService } from "src/app/services/time-entry.service";

@Component({
  templateUrl: "./new-entry.component.html",
  styleUrls: ["./new-entry.component.scss"]
})
export class NewEntryComponent implements OnInit {

  readonly START_BUFFER = (24 * 60 * 60 * 1000); // 24 hours

  newEntryForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  constructor(
    private timeEntryService: TimeEntryService,
    private formBuilder: FormBuilder,
    private dateParser: NgbDateParserFormatter
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    const defaultDate: NgbDateStruct | null = this.dateParser.parse(new Date().toLocaleString());
    const defaultTime: NgbTimeStruct = { hour: 12, minute: 0, second: 0 };

    const timestampControl = new FormControl(defaultTime, [Validators.required, (ctrl) => {
      if (!ctrl.value) return null;
      if (ctrl.value.hour < 12) return { outOfRange: true };
      return null;
    }]);

    this.newEntryForm = this.formBuilder.group({
      subject: [null, [Validators.required]],
      activity: [null, [Validators.required]],
      comments: null,
      entryDate: [defaultDate, [Validators.required]],
      startTimestamp: timestampControl,
      endTimestamp: timestampControl,
      attachment: null
    });

    this.newEntryForm.controls.entryDate.valueChanges.subscribe((entryDate) => {
      // if date is today, start limit is 12am, end limit is now
      // if date is yesterday, start limit is 24 hours ago (so now on the clock), end limit is 11:59pm

      // both start and end time boxes should reset to default
      this.newEntryForm.controls.startTimestamp.setValue(defaultTime);
      this.newEntryForm.controls.endTimestamp.setValue(defaultTime);
    });
  }

  get datePickerStart(): NgbDateStruct {
    const startLimit = new Date(Date.now() - this.START_BUFFER);
    const dateStart: NgbDateStruct = {
      day: startLimit.getDate(), month: startLimit.getMonth() + 1, year: startLimit.getFullYear()
    };
    return dateStart;
  }

  get datePickerEnd(): NgbDateStruct {
    const endLimit = new Date(Date.now());
    const dateEnd: NgbDateStruct = {
      day: endLimit.getDate(), month: endLimit.getMonth() + 1, year: endLimit.getFullYear()
    };
    return dateEnd;
  }

  // get timePickerStart(): NgbTimeStruct {

  // }

  // get timePickerEnd(): NgbTimeStruct {

  // }

  submitForm() {
    if (this.newEntryForm.invalid) {
      this.newEntryForm.markAllAsTouched();
      return;
    }

    const newEntry = this.newEntryForm.value;
    const timeEntry: ITimeEntry = newEntry;

    // parse dates
    timeEntry.startTime = new Date(newEntry.entryDate.year, newEntry.entryDate.month - 1, newEntry.entryDate.day,
      newEntry.startTimestamp.hour, newEntry.startTimestamp.minute, newEntry.startTimestamp.second);
    timeEntry.endTime = new Date(newEntry.entryDate.year, newEntry.entryDate.month - 1, newEntry.entryDate.day,
      newEntry.endTimestamp.hour, newEntry.endTimestamp.minute, newEntry.endTimestamp.second);

    // setup attachment bool
    timeEntry.attachment = (newEntry.attachment !== null);

    // this.timeEntryService.createTimeEntry(timeEntry).subscribe(() => {
    //
    // });

  }

}
