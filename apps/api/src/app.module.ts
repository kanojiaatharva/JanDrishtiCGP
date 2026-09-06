import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { PrismaService } from './prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [AuthModule, ReportsModule, AiModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
