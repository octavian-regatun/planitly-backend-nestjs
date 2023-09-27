import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title!: string;
  @ApiProperty()
  @IsString()
  description!: string;
  @ApiProperty()
  @IsString()
  color!: string;
  @ApiProperty()
  @IsBoolean()
  allDay!: boolean;
  @ApiProperty()
  @IsNumber()
  groupId!: number;
  @ApiProperty()
  @IsDateString()
  startAt!: Date;
  @ApiProperty()
  @IsDateString()
  endAt!: Date;
  @ApiProperty()
  @IsString()
  picture!: string;
}
