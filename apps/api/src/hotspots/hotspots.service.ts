import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class HotspotsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(districtId?: string) {
    // Return mock data for the map if the database is empty
    return [
      {
        id: 'hs-1',
        area: 'Ward 14, Main Street',
        primaryIssue: 'Water Supply',
        reportCount: 35,
        trend: 'INCREASING',
        severity: 'HIGH',
        priorityScore: 92,
        coverageGap: 'Severe',
        lat: 23.2599,
        lng: 77.4126
      },
      {
        id: 'hs-2',
        area: 'Ward 7, Market Road',
        primaryIssue: 'Road Infrastructure',
        reportCount: 22,
        trend: 'STABLE',
        severity: 'MEDIUM',
        priorityScore: 75,
        coverageGap: 'Moderate',
        lat: 23.2650,
        lng: 77.4200
      }
    ];
  }

  async findOne(id: string) {
    // Detailed synthetic data for the hackathon demo
    return {
      id,
      area: 'Ward 14, Main Street',
      primaryIssue: 'Water Supply',
      demand: {
        reportCount: 35,
        uniqueCitizens: 28,
        recurrence: 'High',
        trend: 'Increasing rapidly over last 7 days'
      },
      evidence: {
        infrastructureCoverage: '30% pipelines functional',
        demographicIndicators: 'High population density (4500/sq km)',
        existingSchemes: 'Jal Jeevan Mission (Pending implementation)',
        investmentPlans: '₹50L allocated for 2026'
      },
      aiAssessment: {
        issueCategory: 'Critical Infrastructure',
        severity: 'HIGH',
        confidence: 0.94,
        recommendation: 'Prioritize drinking-water intervention in Ward 14.'
      },
      priority: {
        totalScore: 92,
        breakdown: [
          { name: 'Demand', score: 30, max: 35 },
          { name: 'Severity', score: 20, max: 20 },
          { name: 'Need Gap', score: 18, max: 20 },
          { name: 'Plan Gap', score: 15, max: 15 },
          { name: 'Trend', score: 9, max: 10 }
        ]
      }
    };
  }
}
