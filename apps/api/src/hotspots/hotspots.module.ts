import { Module } from '@nestjs/common';
import { HotspotsController } from './hotspots.controller.js';
import { HotspotsService } from './hotspots.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [HotspotsController],
  providers: [HotspotsService, PrismaService],
})
export class HotspotsModule {}
