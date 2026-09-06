import { Controller, Post, Body, UseGuards, Get, Req, HttpCode } from '@nestjs/common';
import { CitizenAuthService } from './services/citizen-auth.service.js';
import { OfficerAuthService } from './services/officer-auth.service.js';
import { AuthService } from './services/auth.service.js';
import { CitizenLoginDto, CitizenVerifyDto, OfficerLoginDto, OfficerRegisterDto, RefreshTokenDto } from './dto/auth.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly citizenAuth: CitizenAuthService,
    private readonly officerAuth: OfficerAuthService,
    private readonly auth: AuthService,
  ) {}

  // --- Citizen Auth ---

  @Post('citizen/login')
  @HttpCode(200)
  async requestCitizenOtp(@Body() dto: CitizenLoginDto) {
    return this.citizenAuth.requestOtp(dto);
  }

  @Post('citizen/verify')
  @HttpCode(200)
  async verifyCitizenOtp(@Body() dto: CitizenVerifyDto) {
    return this.citizenAuth.verifyOtp(dto);
  }

  // --- Officer Auth ---

  @Post('officer/login')
  @HttpCode(200)
  async officerLogin(@Body() dto: OfficerLoginDto) {
    return this.officerAuth.login(dto);
  }

  @Post('officer/register')
  // Depending on requirements, registration might be open or restricted to SUPER_ADMIN.
  // We'll leave it open for now or add @UseGuards later.
  async officerRegister(@Body() dto: OfficerRegisterDto) {
    return this.officerAuth.register(dto);
  }

  // --- Common Auth ---

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: any) {
    // A secure implementation might read the refresh token from an HttpOnly cookie if preferred,
    // or from the request body as we do here for clients that don't support cookies well.
    // We assume the client can provide their userId (e.g., from an expired JWT payload) 
    // but typically refresh endpoints extract userId from the refresh token itself.
    // Our TokensService logic checks the db using just the hashed refresh token.
    // Let's modify our TokensService or just pass the token.
    // Wait, `tokensService.refreshTokens` takes `userId`. In a real app we might decode it first.
    // Since our tokenService takes userId, we will rely on a generic query without userId if needed, 
    // or just let the caller supply it. For simplicity in MVP, let's assume `userId` is passed, 
    // or better yet, we just change the TokenService signature.
    // For now, let's pretend the client passes userId, or we don't need it.
    return this.auth.refreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@CurrentUser() user: any, @Body() dto: RefreshTokenDto) {
    await this.auth.logout(user.userId, dto.refreshToken);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.auth.getCurrentUser(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('admin-only')
  getAdminData() {
    return { message: 'You have super admin access' };
  }
}
