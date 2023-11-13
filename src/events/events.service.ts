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
        groups: {
          some: {
            groupMembers: {
              some: {
                userId: authenticatedUserId,
              },
            },
          },
        },
      },
      include: {
        groups: true,
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
      include: {
        groups: {
          include: {
            groupMembers: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateEventDto & { authorId: number }) {
    return await this.prismaService.event.create({
      data: {
        title: data.title,
        description: data.description,
        color: data.color,
        allDay: data.allDay,
        startAt: data.startAt,
        endAt: data.endAt,
        authorId: data.authorId,
        picture: data.picture,
        groups: {
          connect: data.groupIds.map((id) => ({ id })),
        },
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
