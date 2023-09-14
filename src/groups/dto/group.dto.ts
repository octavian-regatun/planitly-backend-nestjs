import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { PublicUserDto } from 'src/users/dto/public-user.dto';

export class GroupDto {
  @ApiProperty()
  @IsNumber()
  id!: number;
  @ApiProperty()
  @IsString()
  name!: string;
  @ApiProperty()
  @IsString()
  description!: string;
  @ApiProperty()
  @IsString()
  picture!: string;
  @ApiProperty({ type: PublicUserDto, isArray: true })
  groupMembers!: PublicUserDto[];
}
