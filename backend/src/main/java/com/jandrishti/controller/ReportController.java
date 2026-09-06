package com.jandrishti.controller;

import com.jandrishti.dto.request.ReportRequest;
import com.jandrishti.dto.response.ReportResponse;
import com.jandrishti.security.CustomUserDetails;
import com.jandrishti.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody ReportRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        ReportResponse response = reportService.createReport(request, userDetails.getUser());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReportResponse>> getMyReports(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<ReportResponse> reports = reportService.getMyReports(userDetails.getUser());
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        ReportResponse report = reportService.getReportById(id, userDetails.getUser());
        return ResponseEntity.ok(report);
    }
    
    // PATCH endpoint could be added here for updates if needed for Phase 1
}
