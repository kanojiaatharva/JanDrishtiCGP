package com.jandrishti;

import com.jandrishti.entity.DemandCluster;
import com.jandrishti.service.PriorityScoringService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class PriorityScoringTests {

    private final PriorityScoringService priorityScoringService = new PriorityScoringService();

    @Test
    public void testPriorityCalculation() {
        DemandCluster cluster = new DemandCluster();
        cluster.setReportCount(20); // Demand score will be 20 * 2.5 = 50
        // Growth > 10 reports -> 80
        // Service Gap = 70
        // Population = 60
        cluster.setUrgencyScore(90.0); // Urgency = 90
        
        // Final:
        // 0.35 * 50 = 17.5
        // 0.25 * 80 = 20.0
        // 0.20 * 70 = 14.0
        // 0.10 * 60 = 6.0
        // 0.10 * 90 = 9.0
        // Total = 66.5
        
        priorityScoringService.calculatePriority(cluster);
        
        assertEquals(66.5, cluster.getPriorityScore(), 0.01);
    }
}
