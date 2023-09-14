import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name!: string;
  @ApiProperty()
  @IsString()
  description!: string;
  @ApiProperty()
  @IsString()
  picture!: string;
  @ApiProperty({
    type: [Number],
  })
  groupMembersIds!: number[];
}
