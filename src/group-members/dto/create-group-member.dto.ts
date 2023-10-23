import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateGroupMemberDto {
  @ApiProperty()
  @IsNumber()
  userId!: number;
  @ApiProperty()
  @IsNumber()
  groupId!: number;
}
