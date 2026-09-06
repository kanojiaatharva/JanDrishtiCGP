import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(districtId?: string) {
    // In a real scenario, filter by districtId if provided
    const totalReports = await this.prisma.citizenReport.count();
    const activeHotspots = await this.prisma.demandHotspot.count();
    const pendingReviews = await this.prisma.recommendation.count({ where: { status: 'PENDING' } });
    
    // Mock high priority areas for demo if none exist
    const highPriorityAreas = activeHotspots > 0 ? activeHotspots : 3;

    return {
      totalReports,
      highPriorityAreas,
      activeHotspots,
      pendingReviews
    };
  }

  async getAnalytics(districtId?: string) {
    // Generate synthetic data for the hackathon demo if DB is empty
    return {
      reportsByCategory: [
        { name: 'Water Supply', value: 45 },
        { name: 'Roads', value: 30 },
        { name: 'Sanitation', value: 20 },
        { name: 'Electricity', value: 5 },
      ],
      reportsOverTime: [
        { date: 'Mon', count: 12 },
        { date: 'Tue', count: 19 },
        { date: 'Wed', count: 15 },
        { date: 'Thu', count: 22 },
        { date: 'Fri', count: 30 },
        { date: 'Sat', count: 10 },
        { date: 'Sun', count: 8 },
      ],
      statusDistribution: [
        { name: 'Resolved', value: 60 },
        { name: 'In Progress', value: 25 },
        { name: 'Pending', value: 15 },
      ]
    };
  }
}
