import { ApiProperty } from '@nestjs/swagger';

export class PublicUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  picture: string;
}
