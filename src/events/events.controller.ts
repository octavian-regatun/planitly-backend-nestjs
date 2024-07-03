import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';

@ApiSecurity('jwt')
@ApiTags('events')
@UseGuards(AuthGuard('jwt'))
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    return await this.eventsService.find(req.user!.id);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsService.findById(id);
  }

  @Post()
  async create(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create({
      ...createEventDto,
      authorId: req.user!.id,
    });
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(req.user!.id, id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsService.remove(id);
  }
}
