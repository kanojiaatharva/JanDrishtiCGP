package com.jandrishti.controller.officer;

import com.jandrishti.dto.response.ReportResponse;
import com.jandrishti.entity.Report;
import com.jandrishti.repository.ReportRepository;
import com.jandrishti.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/officer/reports")
@PreAuthorize("hasRole('OFFICER')")
public class OfficerReportController {

    private final ReportRepository reportRepository;
    private final ReportService reportService;

    public OfficerReportController(ReportRepository reportRepository, ReportService reportService) {
        this.reportRepository = reportRepository;
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        List<ReportResponse> response = reports.stream()
                .map(reportService::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
