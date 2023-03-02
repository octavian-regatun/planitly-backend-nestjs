import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendshipDto } from './dto/createFriendship.dto';
import { FriendshipStatus } from './entities/FriendshipStatus';
import { FriendshipType } from './entities/FriendshipType';

@Injectable()
export class FriendshipsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async checkIfFriendshipExists(
    requesterId: number,
    recipientId: number,
  ) {
    return this.prismaService.friendship.findFirst({
      where: {
        requesterId,
        recipientId,
      },
    });
  }

  async findByUserId(authenticatedUserId: number, targetUserId) {
    try {
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
    } catch (e) {
      throw new HttpException("Can't find friendship", HttpStatus.BAD_REQUEST);
    }
  }

  async getAll(userId: number, options: GetAllOptions) {
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
        {
          status: 'PENDING',
        },
        {
          status: 'ACCEPTED',
        },
      ];

    return this.prismaService.friendship.findMany({
      ...query,
      include: {
        recipient: true,
        requester: true,
      },
    });
  }

  async create(requesterId: number, createFriendshipDto: CreateFriendshipDto) {
    const recipientId = parseInt(createFriendshipDto.recipientId);

    if (requesterId === recipientId) throw new Error('Cannot add yourself');

    if (await this.checkIfFriendshipExists(requesterId, recipientId))
      throw new Error('Friendship already exists');

    return this.prismaService.friendship.create({
      data: {
        requesterId,
        recipientId,
        status: 'PENDING',
      },
    });
  }

  async accept(requesterId: number, recipientId: number) {
    const friendship = await this.checkIfFriendshipExists(
      requesterId,
      recipientId,
    );

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

  async delete(friendshipId: number, userId: number) {
    const friendship = await this.prismaService.friendship.findFirst({
      where: {
        id: friendshipId,
        OR: [
          {
            recipientId: userId,
          },
          {
            requesterId: userId,
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
