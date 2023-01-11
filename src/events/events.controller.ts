import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { EventsService } from './events.service';

@UseGuards(JwtGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('isAuthor', ParseBoolPipe) isAuthor: boolean,
    // @Query('isParticipating', ParseBoolPipe) isParticipating: boolean,
  ) {
    if (isAuthor) return await this.eventsService.findByIsAuthor(req.user.id);
  }

  @Post()
  async create(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(req.user.id, createEventDto);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(req.user.id, id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsService.remove(id);
  }
}
