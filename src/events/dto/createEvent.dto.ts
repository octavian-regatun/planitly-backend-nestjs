export class CreateEventDto {
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  startAt: Date;
  endAt: Date;
  picture: string;
}
