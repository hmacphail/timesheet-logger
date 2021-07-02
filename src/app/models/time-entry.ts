export interface ITimeEntry {
  id?: number;
  subject: string;
  activity: string;
  comments: string;
  startTime: Date;
  endTime: Date;
  attachment: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
