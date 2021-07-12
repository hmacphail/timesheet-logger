import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { DateTime } from "luxon";

import { TimeEntryService } from "src/app/services/time-entry.service";
import { ITimeEntry } from "src/app/models/time-entry";
import { SubjectOptions } from "src/app/models/subject-options";

@Component({
  templateUrl: "./new-entry.component.html",
  styleUrls: ["./new-entry.component.scss"]
})
export class NewEntryComponent implements OnInit {

  readonly START_BUFFER = (24 * 60 * 60 * 1000); // 24 hours

  subjectOptions = SubjectOptions;
  defaultDate: NgbDateStruct = this.dateParser.parse(new Date().toLocaleString())!;
  defaultTime: NgbTimeStruct = { hour: 10, minute: 30, second: 0 };

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

  // --------- FORM SETUP ----------

  buildForm(): void {
    this.newEntryForm = this.formBuilder.group({
      subject: ["", [Validators.required]],
      activity: [null, [Validators.required]],
      comments: null,
      entryDate: [this.defaultDate, [Validators.required, this.dateOutOfRange.bind(this)]],
      startTimestamp: [this.defaultTime, [Validators.required, this.timeOutOfRange.bind(this), this.startTimeValidator.bind(this)]],
      endTimestamp: [this.defaultTime, [Validators.required, this.timeOutOfRange.bind(this)]],
      attachment: null
    });

    this.subscribeTimeEventChanges();
  }

  subscribeTimeEventChanges(): void {
    const entryDateControl = this.newEntryForm.controls.entryDate;
    const startTimestampControl = this.newEntryForm.controls.startTimestamp;
    const endTimestampControl = this.newEntryForm.controls.endTimestamp;

    entryDateControl.valueChanges.subscribe((ds: NgbDateStruct) => {
      // re-evaluate other time validators
      startTimestampControl.updateValueAndValidity({ emitEvent: false });
      endTimestampControl.updateValueAndValidity({ emitEvent: false });
    });

    startTimestampControl.valueChanges.subscribe((ts: NgbTimeStruct) => {
      // re-evaluate other time validator
      endTimestampControl.updateValueAndValidity({ emitEvent: false });

      // update value to nearest 15 minutes, suppress events to prevent recursive call
      startTimestampControl.setValue(this.roundTimestamp(ts), {
        emitViewToModelChange: false, emitEvent: false
      });
    });

    endTimestampControl.valueChanges.subscribe((ts: NgbTimeStruct) => {
      // re-evaluate other time validator
      startTimestampControl.updateValueAndValidity({ emitEvent: false });

      // update value to nearest 15 minutes, suppress events to prevent recursive call
      endTimestampControl.setValue(this.roundTimestamp(ts), {
        emitViewToModelChange: false, emitEvent: false
      });
    });
  }

  roundTimestamp(ts: NgbTimeStruct): NgbTimeStruct {
    if (!ts) {
      return ts;
    }
    const timestamp = DateTime.fromFormat(`${ts.hour} ${ts.minute} ${ts.second}`, "h m s");
    const rem = (timestamp.minute % 15);
    const dateTime = (rem < 7) ? timestamp.minus({ "minutes": rem }) : timestamp.plus({ "minutes": (15 - rem) });
    return {
      hour: dateTime.hour, minute: dateTime.minute, second: dateTime.second
    };
  }

  // --------- CUSTOM VALIDATORS ----------

  // date out of range custom validator
  dateOutOfRange(ctrl: AbstractControl): ValidationErrors | null {
    if (!ctrl.value) {
      return null;
    }
    if (!ctrl.value.year || !ctrl.value.month || !ctrl.value.day) {
      // not parsable to an NgbDateStruct
      return { outOfRange: true };
    }

    const start = this.datePickerStart;
    const end = this.datePickerEnd;

    const startDate = DateTime.fromFormat(`${start.year} ${start.month} ${start.day}`, "y m d");
    const endDate = DateTime.fromFormat(`${end.year} ${end.month} ${end.day}`, "y m d");
    const ctrlDate = DateTime.fromFormat(`${ctrl.value.year} ${ctrl.value.month} ${ctrl.value.day}`, "y m d")

    if (ctrlDate < startDate || ctrlDate > endDate) {
      return { outOfRange: true };
    }
    return null;
  }

  // time out of range custom validator
  timeOutOfRange(ctrl: AbstractControl): ValidationErrors | null {
    if (!ctrl.value) {
      return null;
    }
    if (this.newEntryForm?.value?.entryDate && this.newEntryForm.value.entryDate != this.defaultDate) {
      // no out of range error if date is not today
      return null;
    }
    const twoHoursFromNow = DateTime.now().plus({ "hour": 2 });
    if (ctrl.value.hour > twoHoursFromNow.hour) {
      return { outOfRange: true };
    }
    return null;
  }

  // start time before end time custom validator
  startTimeValidator(ctrl: AbstractControl): ValidationErrors | null {
    if (!ctrl.value) {
      return null;
    }
    if (this.newEntryForm?.value?.endTimestamp) {
      const startTime = this.parseTimestampToJSDate(ctrl.value);
      const endTime = this.parseTimestampToJSDate(this.newEntryForm.value.endTimestamp);
      if (startTime.getTime() >= endTime.getTime()) {
        return { afterEndTime: true }
      }
    }
    return null;
  }

  // --------- DATE RANGE GETTERS -----------

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

  // --------- FORM SUBMIT ----------

  submitForm(): void {
    if (this.newEntryForm.invalid) {
      this.newEntryForm.markAllAsTouched();
      return;
    }

    const newEntry = this.newEntryForm.value;
    const timeEntry: ITimeEntry = newEntry;

    // parse dates
    timeEntry.startTime = this.parseTimestampToJSDate(newEntry.startTimestamp, newEntry.entryDate);
    timeEntry.endTime = this.parseTimestampToJSDate(newEntry.endTimestamp, newEntry.entryDate);

    // setup attachment bool
    timeEntry.attachment = (newEntry.attachment !== null);

    // submit to database
    this.timeEntryService.createTimeEntry(timeEntry).subscribe((res) => {
      this.submitted = true;
    });
  }

  // --------- HELPER FUNCTIONS ----------

  private parseTimestampToJSDate(timestamp: NgbTimeStruct, entryDate?: NgbDateStruct): Date {
    if (!entryDate) {
      entryDate = this.defaultDate;
    }
    return new Date(entryDate.year, entryDate.month - 1, entryDate.day,
      timestamp.hour, timestamp.minute, timestamp.second);
  }

}
