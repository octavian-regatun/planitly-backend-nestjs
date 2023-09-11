import { CreateEventDto } from './createEvent.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty()
  authorId?: number;
}
