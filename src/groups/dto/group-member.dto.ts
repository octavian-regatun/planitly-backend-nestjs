import { ApiProperty } from '@nestjs/swagger';
import { GroupMemberRole } from '@prisma/client';
import { IsNumber } from 'class-validator';
import { PublicUserDto } from 'src/users/dto/public-user.dto';

export class GroupMemberDto {
  @ApiProperty()
  role!: GroupMemberRole;
  @ApiProperty()
  @IsNumber()
  groupId!: number;
  @ApiProperty()
  @IsNumber()
  userId!: number;
  @ApiProperty()
  user!: PublicUserDto;
}
