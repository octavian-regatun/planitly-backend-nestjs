import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserDto implements User {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  username!: string;
  @ApiProperty()
  picture!: string;
  @ApiProperty()
  firstName!: string;
  @ApiProperty()
  lastName!: string;
  @ApiProperty()
  email!: string;
  @ApiProperty()
  gender!: string;
  @ApiProperty()
  role!: string;
  @ApiProperty()
  authProvider!: string;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;
}
