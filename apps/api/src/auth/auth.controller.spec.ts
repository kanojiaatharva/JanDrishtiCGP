import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { CitizenAuthService } from './services/citizen-auth.service.js';
import { OfficerAuthService } from './services/officer-auth.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

describe('AuthController', () => {
  let controller: AuthController;
  let officerAuth: OfficerAuthService;
  let citizenAuth: CitizenAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            logout: vi.fn(),
            refreshToken: vi.fn(),
          },
        },
        {
          provide: CitizenAuthService,
          useValue: {
            requestOtp: vi.fn(),
            verifyOtp: vi.fn(),
          },
        },
        {
          provide: OfficerAuthService,
          useValue: {
            login: vi.fn(),
            register: vi.fn(),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<AuthController>(AuthController);
    officerAuth = module.get<OfficerAuthService>(OfficerAuthService);
    citizenAuth = module.get<CitizenAuthService>(CitizenAuthService);
  });

  describe('Citizen', () => {
    it('should request OTP', async () => {
      vi.spyOn(citizenAuth, 'requestOtp').mockResolvedValue({ message: 'OTP sent successfully' });
      const result = await controller.requestCitizenOtp({ phone: '123' });
      expect(result.message).toBe('OTP sent successfully');
    });

    it('should verify OTP and return tokens', async () => {
      vi.spyOn(citizenAuth, 'verifyOtp').mockResolvedValue({ accessToken: 'a', refreshToken: 'r' });
      const result = await controller.verifyCitizenOtp({ phone: '123', otp: '123456' });
      expect(result.accessToken).toBe('a');
    });
  });

  describe('Officer', () => {
    it('should login and return tokens', async () => {
      vi.spyOn(officerAuth, 'login').mockResolvedValue({ accessToken: 'x', refreshToken: 'y' });
      const result = await controller.officerLogin({ email: 'test@gov.in', password: 'password' });
      expect(result.accessToken).toBe('x');
    });

    it('should throw on invalid credentials (propagated from service)', async () => {
      vi.spyOn(officerAuth, 'login').mockRejectedValue(new Error('Invalid credentials'));
      await expect(controller.officerLogin({ email: 'test@gov.in', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });

    it('should register a new officer', async () => {
      vi.spyOn(officerAuth, 'register').mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });
      const result = await controller.officerRegister({
        email: 'new@gov.in',
        password: 'pass',
        firstName: 'John',
        lastName: 'Doe',
        designation: 'Clerk'
      });
      expect(result.accessToken).toBe('a');
    });
  });
});
