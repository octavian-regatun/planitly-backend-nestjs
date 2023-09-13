import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  title!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty()
  color!: string;
  @ApiProperty()
  allDay!: boolean;
  @ApiProperty()
  startAt!: Date;
  @ApiProperty()
  endAt!: Date;
  @ApiProperty()
  picture!: string;
}
