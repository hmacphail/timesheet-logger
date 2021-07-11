export interface ITimeEntry {
  id?: number;
  subject: string;
  activity: string;
  comments: string;
  startTime: Date | string;
  endTime: Date | string;
  attachment: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
