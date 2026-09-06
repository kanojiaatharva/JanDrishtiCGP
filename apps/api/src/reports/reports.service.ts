import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateReportDto } from './dto/report.dto.js';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReportDto & { _aiMetadata?: any }) {
    // Ensure the citizen profile exists for the user.
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { citizenProfile: true },
    });

    if (!user || !user.citizenProfile) {
      throw new NotFoundException('Citizen profile not found');
    }

    // Wrap in a transaction to create the report and the AI analysis (if provided)
    return this.prisma.$transaction(async (tx) => {
      const report = await tx.citizenReport.create({
        data: {
          citizenId: user.citizenProfile!.id,
          originalInput: dto.originalInput,
          language: dto.language || 'hi',
          channel: dto.channel || 'WEB',
          transcription: dto.transcription,
          normalizedText: dto.normalizedText,
          urgency: dto.urgency,
          severity: dto.severity,
          status: 'SUBMITTED',
        },
      });

      // If the frontend passed along the AI extraction metadata, save it!
      // In a more robust worker architecture, a Pub/Sub event would trigger this.
      if (dto._aiMetadata) {
        await tx.aIAnalysis.create({
           data: {
             reportId: report.id,
             provider: 'GEMINI',
             model: dto._aiMetadata.model,
             modelVersion: dto._aiMetadata.modelVersion,
             promptVersion: dto._aiMetadata.promptVersion,
             latency: dto._aiMetadata.latency,
             confidence: dto._aiMetadata.confidence,
             structuredResult: dto._aiMetadata.structuredResult
           }
        });
      }

      return report;
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
