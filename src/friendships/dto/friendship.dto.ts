import { ApiProperty } from '@nestjs/swagger';

export class FriendshipDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  recipientId: number;
  @ApiProperty()
  requesterId: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
