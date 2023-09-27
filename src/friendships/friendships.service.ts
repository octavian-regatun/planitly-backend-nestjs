import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipStatus } from './entities/FriendshipStatus';
import { FriendshipType } from './entities/FriendshipType';

@Injectable()
export class FriendshipsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async checkIfFriendshipExists(
    requesterId: number,
    recipientId: number,
  ) {
    return await this.prismaService.friendship.findFirst({
      where: {
        requesterId,
        recipientId,
      },
    });
  }

  async findByUserId(authenticatedUserId: number, targetUserId) {
    return this.prismaService.friendship.findFirst({
      where: {
        OR: [
          {
            recipientId: authenticatedUserId,
            requesterId: targetUserId,
          },
          {
            recipientId: targetUserId,
            requesterId: authenticatedUserId,
          },
        ],
      },
    });
  }

  async find(userId: number, options: GetAllOptions) {
    const { type, status } = options;

    const query = { where: {} };

    if (type === 'INCOMING') query.where['recipientId'] = userId;
    else if (type === 'OUTGOING') query.where['requesterId'] = userId;
    else
      query.where['OR'] = [
        {
          requesterId: userId,
        },
        {
          recipientId: userId,
        },
      ];

    if (status === 'PENDING') query.where['status'] = 'PENDING';
    else if (status === 'ACCEPTED') query.where['status'] = 'ACCEPTED';
    else
      query.where['OR'] = [
        ...query.where['OR'],
        {
          status: 'PENDING',
        },
        {
          status: 'ACCEPTED',
        },
      ];

    return await this.prismaService.friendship.findMany({
      ...query,
      include: {
        recipient: true,
        requester: true,
      },
    });
  }

  async create(authenticatedUserId: number, recipientId: number) {
    if (authenticatedUserId === recipientId)
      throw new Error('Cannot add yourself');

    if (await this.checkIfFriendshipExists(authenticatedUserId, recipientId))
      throw new Error('Friendship already exists');

    return await this.prismaService.friendship.create({
      data: {
        requesterId: authenticatedUserId,
        recipientId,
        status: 'PENDING',
      },
    });
  }

  // TODO: check if user is allowed to update this friendship
  async accept(authenticatedUserId: number, friendshipId: number) {
    const friendship = await this.prismaService.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) throw new Error('Friendship does not exist');

    if (friendship.recipientId !== authenticatedUserId)
      throw new Error('You are not allowed to accept this friendship');

    if (!friendship) throw new Error('Friendship does not exist');

    return this.prismaService.friendship.update({
      where: {
        id: friendship.id,
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  }

  async delete(friendshipId: number, authenticatedUserId: number) {
    console.log({ friendshipId, authenticatedUserId });
    const friendship = await this.prismaService.friendship.findFirst({
      where: {
        id: friendshipId,
        OR: [
          {
            recipientId: authenticatedUserId,
          },
          {
            requesterId: authenticatedUserId,
          },
        ],
      },
    });

    if (!friendship) throw new Error('Friendship does not exist / not yours');

    try {
      return await this.prismaService.friendship.delete({
        where: {
          id: friendshipId,
        },
      });
    } catch (e) {
      throw new Error('Could not delete friendship');
    }
  }
}

interface GetAllOptions {
  type: FriendshipType;
  status: FriendshipStatus;
}
