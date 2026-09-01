import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DashboardController } from './dashboard.controller.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [],
  controllers: [AppController, DashboardController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
