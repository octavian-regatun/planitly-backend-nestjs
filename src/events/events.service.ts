import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async findByIsAuthor(id: number) {
    return await this.prismaService.event.findMany({
      where: {
        authorId: id,
      },
    });
  }

  async findById(id: number) {
    return await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });
  }

  async create(userId: number, createEventDto: CreateEventDto) {
    const { title, description, color, allDay, startAt, endAt } =
      createEventDto;

    return await this.prismaService.event.create({
      data: {
        title,
        description,
        color,
        allDay,
        startAt,
        endAt,
        authorId: userId,
      },
    });
  }

  async update(userId: number, id: number, updateEventDto: UpdateEventDto) {
    const {
      title,
      description,
      color,
      allDay,
      startAt,
      endAt,
      authorId,
      picture,
    } = updateEventDto;

    const event = await this.findById(id);

    const isAuthor = await this._isAuthor(userId, event.authorId);
    if (!isAuthor) throw new Error('You are not the author of this event');

    return await this.prismaService.event.update({
      where: { id },
      data: {
        title,
        description,
        color,
        allDay,
        startAt,
        endAt,
        authorId,
        picture,
      },
    });
  }

  async remove(id: number) {
    return await this.prismaService.event.delete({
      where: { id },
    });
  }

  private async _isAuthor(userId: number, eventAuthorId: number) {
    return userId === eventAuthorId;
  }
}
