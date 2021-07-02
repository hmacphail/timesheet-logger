import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ITimeEntry } from "../models/time-entry";

@Injectable({
  providedIn: "root"
})
export class TimeEntryService {
  serverUrl: string = "/api";

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllTimeEntries() {
    const url = this.serverUrl + "/timeEntry";
    return this.httpClient.get(url);
  }

  getTimeEntryById(timeEntryId: number) {
    const url = this.serverUrl + "/timeEntry/" + timeEntryId;
    return this.httpClient.get(url);
  }

  createTimeEntry(timeEntry: ITimeEntry) {
    const url = this.serverUrl + "/timeEntry";
    return this.httpClient.post(url, timeEntry);
  }

}
