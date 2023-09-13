import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/createGroup.dto';

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}

  async find(authenticatedUserId: number) {
    return await this.prismaService.group.findMany({
      where: {
        GroupMember: {
          some: {
            userId: authenticatedUserId,
          },
        },
      },
    });
  }
  async create(authenticatedUserId: number, data: CreateGroupDto) {
    return await this.prismaService.group.create({
      data: {
        ...data,
        GroupMember: {
          create: {
            role: 'ADMIN',
            userId: authenticatedUserId,
          },
        },
      },
    });
  }
}
