import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: "./new-entry.component.html",
  styleUrls: ["./new-entry.component.scss"]
})
export class NewEntryComponent implements OnInit {

  newEntryForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.newEntryForm = this.formBuilder.group({
      subject: [null, [Validators.required]],
      activity: [null, [Validators.required]],
      comments: null,
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      attachment: null
    });
  }

  submitForm() {

  }

}
