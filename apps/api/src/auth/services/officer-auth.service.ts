import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { TokensService } from './tokens.service.js';
import { OfficerLoginDto, OfficerRegisterDto } from '../dto/auth.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class OfficerAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  async login(dto: OfficerLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Must be at least an officer or admin
    if (user.role.name === 'CITIZEN') {
      throw new UnauthorizedException('Access denied');
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.tokensService.generateTokens(user.id, user.role.name);
  }

  async register(dto: OfficerRegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const officerRole = await this.prisma.role.findUnique({ where: { name: 'OFFICER' } });
    if (!officerRole) throw new Error('OFFICER role not found');

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        roleId: officerRole.id,
        officerProfile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            designation: dto.designation,
            districtId: dto.districtId,
          }
        }
      },
      include: { role: true },
    });

    return this.tokensService.generateTokens(user.id, user.role.name);
  }
}
