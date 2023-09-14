import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiProperty()
  groupMembersIds!: number[];
}
