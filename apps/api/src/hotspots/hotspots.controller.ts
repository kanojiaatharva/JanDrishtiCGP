import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HotspotsService } from './hotspots.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('hotspots')
export class HotspotsController {
  constructor(private readonly hotspotsService: HotspotsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('districtId') districtId?: string) {
    return this.hotspotsService.findAll(districtId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hotspotsService.findOne(id);
  }
}
