import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { TokensService } from './tokens.service.js';
import { CitizenLoginDto, CitizenVerifyDto } from '../dto/auth.dto.js';

@Injectable()
export class CitizenAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  async requestOtp(dto: CitizenLoginDto) {
    // 1. Normalize phone number
    const phone = dto.phone.trim();
    
    // 2. Generate OTP (in MVP, always 123456 or logged to console)
    const otp = '123456';
    console.log(`[DEVELOPMENT] OTP for ${phone} is ${otp}`);

    // In a real scenario, integrate with SMS/WhatsApp provider here.
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: CitizenVerifyDto) {
    const phone = dto.phone.trim();
    
    // 1. Verify OTP
    if (dto.otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    // 2. Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone },
      include: { role: true },
    });

    if (!user) {
      // Find role
      const citizenRole = await this.prisma.role.findUnique({ where: { name: 'CITIZEN' } });
      if (!citizenRole) throw new Error('CITIZEN role not found in DB');

      user = await this.prisma.user.create({
        data: {
          phone,
          roleId: citizenRole.id,
          citizenProfile: {
            create: {}
          }
        },
        include: { role: true },
      });
    }

    if (user.role.name !== 'CITIZEN') {
      throw new UnauthorizedException('Account is not a citizen account');
    }

    // 3. Generate tokens
    return this.tokensService.generateTokens(user.id, user.role.name);
  }
}
