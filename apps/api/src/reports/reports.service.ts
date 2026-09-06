import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateReportDto } from './dto/report.dto.js';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReportDto) {
    // Ensure the citizen profile exists for the user.
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { citizenProfile: true },
    });

    if (!user || !user.citizenProfile) {
      throw new NotFoundException('Citizen profile not found');
    }

    return this.prisma.citizenReport.create({
      data: {
        citizenId: user.citizenProfile.id,
        originalInput: dto.originalInput,
        language: dto.language || 'hi',
        channel: dto.channel || 'WEB',
        transcription: dto.transcription,
        normalizedText: dto.normalizedText,
        urgency: dto.urgency,
        severity: dto.severity,
        // Mock category for now if we don't look it up
        status: 'SUBMITTED',
      },
    });
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { citizenProfile: true },
    });

    if (!user || !user.citizenProfile) return [];

    return this.prisma.citizenReport.findMany({
      where: { citizenId: user.citizenProfile.id },
      orderBy: { createdAt: 'desc' },
      include: { location: true, category: true },
    });
  }

  async findOne(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { citizenProfile: true },
    });

    if (!user || !user.citizenProfile) {
      throw new NotFoundException('Citizen profile not found');
    }

    const report = await this.prisma.citizenReport.findFirst({
      where: {
        id,
        citizenId: user.citizenProfile.id,
      },
      include: { location: true, category: true, statusHistory: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }
}
