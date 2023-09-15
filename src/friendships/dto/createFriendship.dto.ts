import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFriendshipDto {
  @ApiProperty()
  @IsNumber()
  recipientId!: number;
}
