import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupMembersService {
  constructor(private prismaService: PrismaService) {}

  async create(authenticatedUserId: number, groupId: number, userId: number) {
    if (authenticatedUserId === userId)
      throw new Error('You cannot add yourself to a group.');

    return await this.prismaService.groupMember.create({
      data: {
        groupId,
        userId,
        status: 'PENDING',
        role: 'MEMBER',
      },
      include: {
        user: true,
        group: true,
      },
    });
  }

  async deleteById(authenticatedUserId: number, id: number) {
    return await this.prismaService.groupMember.delete({
      where: {
        id,
        OR: [
          {
            group: {
              groupMembers: {
                some: {
                  userId: authenticatedUserId,
                  role: 'ADMIN',
                },
              },
            },
          },
          {
            userId: authenticatedUserId,
          },
        ],
      },
    });
  }

  // TODO: check if user is member of group
  async findByGroupId(authenticatedUserId: number, groupId: number) {
    return await this.prismaService.groupMember.findMany({
      where: {
        groupId,
      },
    });
  }

  async accept(authenticatedUserId: number, memberId: number) {
    const groupMember = await this.prismaService.groupMember.findFirst({
      where: {
        id: memberId,
      },
    });

    if (!groupMember) throw new Error('Group member not found.');

    if (groupMember.userId !== authenticatedUserId)
      throw new Error('You are not allowed to accept this request.');

    if (!groupMember) throw new Error('Group member not found.');

    return await this.prismaService.groupMember.update({
      where: {
        id: groupMember.id,
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  }
}
