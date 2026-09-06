package com.jandrishti.controller.officer;

import com.jandrishti.entity.enums.ReportStatus;
import com.jandrishti.repository.DemandClusterRepository;
import com.jandrishti.repository.NotificationRepository;
import com.jandrishti.repository.ReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/officer/dashboard")
@PreAuthorize("hasRole('OFFICER')")
public class DashboardController {

    private final ReportRepository reportRepository;
    private final DemandClusterRepository demandClusterRepository;
    private final NotificationRepository notificationRepository;

    public DashboardController(ReportRepository reportRepository,
                               DemandClusterRepository demandClusterRepository,
                               NotificationRepository notificationRepository) {
        this.reportRepository = reportRepository;
        this.demandClusterRepository = demandClusterRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        long totalReports = reportRepository.count();
        long totalClusters = demandClusterRepository.count();
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long inProgress = reportRepository.countByStatus(ReportStatus.ACTION_IN_PROGRESS);
        long aiProcessed = reportRepository.countByStatus(ReportStatus.AI_PROCESSED);
        long submitted = reportRepository.countByStatus(ReportStatus.SUBMITTED);

        List<Object[]> catCounts = reportRepository.countByCategory();
        List<Map<String, Object>> categoryBreakdown = new java.util.ArrayList<>();
        for (Object[] row : catCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0] != null ? row[0].toString() : "OTHER");
            map.put("count", row[1]);
            categoryBreakdown.add(map);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalReports", totalReports);
        summary.put("totalClusters", totalClusters);
        summary.put("resolved", resolved);
        summary.put("inProgress", inProgress);
        summary.put("aiProcessed", aiProcessed);
        summary.put("submitted", submitted);
        summary.put("resolutionRate", totalReports > 0 ? Math.round((double) resolved / totalReports * 100) : 0);
        summary.put("categoryBreakdown", categoryBreakdown);

        return ResponseEntity.ok(summary);
    }
}
