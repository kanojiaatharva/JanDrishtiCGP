import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('extract')
  async extract(@Body() dto: { text: string }) {
    return this.aiService.extractInformation(dto.text);
  }
}
