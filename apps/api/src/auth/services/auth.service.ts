import { Injectable } from '@nestjs/common';
import { TokensService } from './tokens.service.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly prisma: PrismaService,
  ) {}

  async logout(userId: string, refreshToken: string) {
    return this.tokensService.revokeToken(userId, refreshToken);
  }

  async refreshToken(refreshToken: string) {
    return this.tokensService.refreshTokens(refreshToken);
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        createdAt: true,
        role: true,
        citizenProfile: true,
        officerProfile: {
          include: { district: true }
        }
      }
    });
  }
}
