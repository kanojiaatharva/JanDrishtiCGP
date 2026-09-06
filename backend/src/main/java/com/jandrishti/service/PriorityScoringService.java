package com.jandrishti.service;

import com.jandrishti.entity.DemandCluster;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PriorityScoringService {

    public void calculatePriority(DemandCluster cluster) {
        // Transparent scoring engine
        // Priority: 35% Demand Score, 25% Growth Score, 20% Service Gap Score, 10% Population Impact, 10% Urgency
        
        // Mocking some internal metrics for the prototype
        // In a real app, these would be calculated based on historical reports and external population data
        
        // Normalize demand score (0-100 based on report count)
        double demandScore = Math.min(100.0, cluster.getReportCount() * 2.5);
        
        // Mock growth (0-100)
        double growthScore = cluster.getReportCount() > 10 ? 80.0 : 40.0;
        
        // Mock service gap (0-100)
        double serviceGapScore = 70.0; 
        
        // Mock population impact (0-100)
        double populationImpactScore = 60.0;
        
        // Urgency derived from AI (0-100)
        double urgencyScore = cluster.getUrgencyScore() != null ? cluster.getUrgencyScore() : 50.0;

        double finalPriority = (0.35 * demandScore) + 
                               (0.25 * growthScore) + 
                               (0.20 * serviceGapScore) + 
                               (0.10 * populationImpactScore) + 
                               (0.10 * urgencyScore);
                               
        cluster.setDemandScore(demandScore);
        cluster.setGrowthRate(growthScore);
        cluster.setServiceGapScore(serviceGapScore);
        cluster.setPopulationImpactScore(populationImpactScore);
        cluster.setUrgencyScore(urgencyScore);
        cluster.setPriorityScore(Math.round(finalPriority * 100.0) / 100.0);
        
        cluster.setSummary(generateExplanation(cluster));
    }
    
    private String generateExplanation(DemandCluster cluster) {
        List<String> reasons = new ArrayList<>();
        if (cluster.getDemandScore() > 70) reasons.add("High citizen demand volume");
        if (cluster.getGrowthRate() > 70) reasons.add("Rapidly increasing reports");
        if (cluster.getUrgencyScore() > 80) reasons.add("Critical urgency signaled by AI");
        if (cluster.getPriorityScore() > 80) reasons.add("Requires immediate officer review");
        
        return "Priority Score is " + cluster.getPriorityScore() + ". Key factors: " + String.join(", ", reasons);
    }
}
