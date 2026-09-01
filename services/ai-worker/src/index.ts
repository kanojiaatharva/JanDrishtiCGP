import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The default score formula:
// Priority = 0.30*Demand + 0.20*Severity + 0.20*NeedGap + 0.15*Infrastructure + 0.10*Population + 0.05*PlanGap

export class PriorityEngine {
  calculateScore(components: {
    demand: number;
    severity: number;
    needGap: number;
    infrastructureGap: number;
    populationNeed: number;
    planGap: number;
  }): number {
    const score = 
      0.30 * components.demand +
      0.20 * components.severity +
      0.20 * components.needGap +
      0.15 * components.infrastructureGap +
      0.10 * components.populationNeed +
      0.05 * components.planGap;
      
    // Return rounded score
    return Math.round(score);
  }

  async processHotspot(clusterId: string) {
    console.log(`Processing hotspot: ${clusterId}`);
    
    // In MVP, we mock the retrieval of complex evidence from BigQuery
    const components = {
      demand: 93, // e.g., 1284 reports is very high
      severity: 90, // Unsafe drinking water is highly severe
      needGap: 90, 
      infrastructureGap: 93, // Low coverage
      populationNeed: 90, 
      planGap: 100 // No active projects
    };

    const finalScore = this.calculateScore(components);
    
    console.log(`Calculated priority score: ${finalScore}`);
    
    // Save to database
    await prisma.priorityScore.create({
      data: {
        clusterId,
        score: finalScore,
        demandComponent: components.demand * 0.30,
        severityComponent: components.severity * 0.20,
        needGapComponent: components.needGap * 0.20,
        infrastructureComponent: components.infrastructureGap * 0.15,
        populationComponent: components.populationNeed * 0.10,
        planGapComponent: components.planGap * 0.05,
        evidenceCompleteness: 100,
        confidence: 0.95
      }
    });

    console.log(`Saved priority score to database.`);
  }
}

// Example usage
async function run() {
  console.log('Starting AI Worker...');
  // The worker would typically listen to Pub/Sub here.
}

run();
