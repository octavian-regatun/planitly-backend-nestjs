import { ApiProperty } from '@nestjs/swagger';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';

export class FriendshipDto {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  recipientId!: number;
  @ApiProperty()
  recipient!: PublicUserDto;
  @ApiProperty()
  requesterId!: number;
  @ApiProperty()
  requester!: PublicUserDto;
  @ApiProperty()
  status!: string;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;
}
