import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  name!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty()
  picture!: string;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;
}
