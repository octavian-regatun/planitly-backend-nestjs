import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async find(authenticatedUserId: number) {
    return await this.prismaService.event.findMany({
      where: {
        group: {
          groupMembers: {
            some: {
              userId: authenticatedUserId,
            },
          },
        },
      },
    });
  }

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

  async create(data: CreateEventDto & { authorId: number }) {
    return await this.prismaService.event.create({ data });
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

    if (!event) throw new Error('Event not found');

    const isAuthor = await this.isAuthor(userId, event.authorId);
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

  private async isAuthor(userId: number, eventAuthorId: number) {
    return userId === eventAuthorId;
  }
}
