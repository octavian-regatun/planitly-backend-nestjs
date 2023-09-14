import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}

  async find(authenticatedUserId: number) {
    return await this.prismaService.group.findMany({
      where: {
        groupMembers: {
          some: {
            userId: authenticatedUserId,
          },
        },
      },
    });
  }

  async findById(authenticatedUserId: number, groupId: number) {
    return await this.prismaService.group.findUnique({
      where: {
        id: groupId,
        AND: {
          groupMembers: {
            some: {
              userId: authenticatedUserId,
            },
          },
        },
      },
      include: {
        groupMembers: true,
      },
    });
  }

  async create(authenticatedUserId: number, data: CreateGroupDto) {
    return await this.prismaService.group.create({
      data: {
        ...data,
        groupMembers: {
          create: {
            role: 'ADMIN',
            userId: authenticatedUserId,
          },
        },
      },
    });
  }

  // TODO: check if user is admin of group
  async update(
    authenticatedUserId: number,
    updateGroupDto: UpdateGroupDto,
    groupId: number,
  ) {
    const group = await this.prismaService.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        groupMembers: true,
      },
    });

    if (!group) throw new Error('Group not found');

    const membersToAdd = updateGroupDto.groupMembersIds.filter(
      (groupMemberId) =>
        !group.groupMembers.some(
          (groupMember) => groupMember.userId === groupMemberId,
        ),
    );

    const membersToRemove = group.groupMembers.filter(
      (groupMember) =>
        !updateGroupDto.groupMembersIds.includes(groupMember.userId),
    );

    const addMembers = this.prismaService.groupMember.createMany({
      data: membersToAdd.map((userId) => ({
        groupId,
        userId,
        role: 'MEMBER',
      })),
    });

    const removeMembers = this.prismaService.groupMember.deleteMany({
      where: {
        id: {
          in: membersToRemove.map((groupMember) => groupMember.id),
        },
      },
    });

    await Promise.allSettled([addMembers, removeMembers]);

    const updatedGroup = await this.prismaService.group.findUnique({
      where: {
        id: groupId,
      },
    });

    return updatedGroup;
  }

  // TODO: check if user is admin of group
  delete(authenticatedUserId: number, groupId: number) {
    return this.prismaService.group.delete({
      where: {
        id: groupId,
      },
    });
  }
}
