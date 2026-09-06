package com.jandrishti.service;

import com.jandrishti.entity.ClusterReport;
import com.jandrishti.entity.DemandCluster;
import com.jandrishti.entity.Report;
import com.jandrishti.entity.ReportAIAnalysis;
import com.jandrishti.repository.ClusterReportRepository;
import com.jandrishti.repository.DemandClusterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemandClusterService {

    private final DemandClusterRepository demandClusterRepository;
    private final ClusterReportRepository clusterReportRepository;
    private final PriorityScoringService priorityScoringService;

    public DemandClusterService(DemandClusterRepository demandClusterRepository,
                                ClusterReportRepository clusterReportRepository,
                                PriorityScoringService priorityScoringService) {
        this.demandClusterRepository = demandClusterRepository;
        this.clusterReportRepository = clusterReportRepository;
        this.priorityScoringService = priorityScoringService;
    }

    @Transactional
    public void processReportForClustering(Report report, ReportAIAnalysis analysis) {
        if (report.getCategory() == null) {
            return; // Needs category to cluster
        }

        String ward = report.getWard() != null ? report.getWard() : "Unknown";
        String district = report.getDistrict() != null ? report.getDistrict() : "Unknown";

        DemandCluster cluster = demandClusterRepository.findByCategoryAndWardAndDistrict(
                report.getCategory(), ward, district
        ).orElseGet(() -> {
            DemandCluster newCluster = new DemandCluster();
            newCluster.setCategory(report.getCategory());
            newCluster.setSubcategory(report.getSubcategory()); // Take first subcategory
            newCluster.setWard(ward);
            newCluster.setDistrict(district);
            newCluster.setReportCount(0);
            return newCluster;
        });

        cluster.setReportCount(cluster.getReportCount() + 1);

        // Update running urgency average
        int reportUrgency = mapUrgencyToInt(analysis.getUrgency());
        double currentUrgencyScore = cluster.getUrgencyScore() != null ? cluster.getUrgencyScore() : 50.0;
        cluster.setUrgencyScore((currentUrgencyScore * (cluster.getReportCount() - 1) + reportUrgency) / cluster.getReportCount());

        priorityScoringService.calculatePriority(cluster);
        
        DemandCluster savedCluster = demandClusterRepository.save(cluster);

        ClusterReport cr = new ClusterReport();
        cr.setClusterId(savedCluster.getId());
        cr.setReportId(report.getId());
        clusterReportRepository.save(cr);
    }

    private int mapUrgencyToInt(Integer urgency) {
        // Assuming AI Analysis mapped LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4
        if (urgency == null) return 50;
        switch (urgency) {
            case 1: return 25;
            case 2: return 50;
            case 3: return 75;
            case 4: return 100;
            default: return 50;
        }
    }
}
