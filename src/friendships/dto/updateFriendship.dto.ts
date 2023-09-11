import { ApiProperty } from '@nestjs/swagger';

export class UpdateFriendshipDto {
  @ApiProperty()
  requesterId: number;
}
