import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async findAllPending(@Query('districtId') districtId?: string) {
    return this.recommendationsService.findAllPending(districtId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decision')
  async makeDecision(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { decision: string; reason: string }
  ) {
    return this.recommendationsService.makeDecision(user.userId, id, body.decision, body.reason);
  }
}
