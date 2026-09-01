import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller('api/v1')
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('dashboard/summary')
  async getSummary() {
    const totalReports = await this.prisma.report.count();
    const hotspots = await this.prisma.issueCluster.count();
    
    return {
      data: {
        totalReports,
        hotspots,
        resolutionRate: 0.85,
      }
    };
  }

  @Get('dashboard/hotspots')
  async getHotspots() {
    const clusters = await this.prisma.issueCluster.findMany({
      include: {
        ward: true,
      },
    });

    return {
      data: clusters.map(c => ({
        id: c.id,
        title: c.title,
        area: c.ward?.name || 'Unknown',
        reportCount: c.reportCount,
        priorityScore: c.hotspotScore,
        centroid: { lat: 22.71, lng: 75.85 },
      }))
    };
  }

  @Get('clusters/:id')
  async getClusterDetails(@Param('id') id: string) {
    const cluster = await this.prisma.issueCluster.findUnique({
      where: { id },
      include: {
        category: true,
        ward: true,
        priorityScores: {
          take: 1,
          orderBy: { computedAt: 'desc' }
        },
        recommendations: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cluster) {
      return { error: { message: 'Cluster not found' } };
    }

    return {
      data: {
        cluster,
        priorityScore: cluster.priorityScores[0],
        recommendation: cluster.recommendations[0]
      }
    };
  }

  @Patch('recommendations/:id/decision')
  async makeDecision(@Param('id') id: string, @Body() body: any) {
    // Mock human-in-the-loop decision
    const recommendation = await this.prisma.recommendation.update({
      where: { id },
      data: {
        status: body.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'
      }
    });

    return { data: recommendation };
  }
}
