import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendshipDto {
  @ApiProperty()
  recipientId!: number;
}
