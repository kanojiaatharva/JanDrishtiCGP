package com.jandrishti.service;

import com.jandrishti.dto.request.ReportRequest;
import com.jandrishti.dto.response.ReportResponse;
import com.jandrishti.entity.Report;
import com.jandrishti.entity.User;
import com.jandrishti.entity.enums.ReportStatus;
import com.jandrishti.entity.enums.Role;
import com.jandrishti.entity.ReportAIAnalysis;
import com.jandrishti.repository.ReportRepository;
import com.jandrishti.repository.ReportAIAnalysisRepository;
import com.jandrishti.ai.GeminiService;
import com.jandrishti.ai.StructuredAnalysisResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportAIAnalysisRepository aiAnalysisRepository;
    private final GeminiService geminiService;
    private final DemandClusterService demandClusterService;

    public ReportService(ReportRepository reportRepository,
                         ReportAIAnalysisRepository aiAnalysisRepository,
                         GeminiService geminiService,
                         DemandClusterService demandClusterService) {
        this.reportRepository = reportRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.geminiService = geminiService;
        this.demandClusterService = demandClusterService;
    }

    @Transactional
    public ReportResponse createReport(ReportRequest request, User currentUser) {
        Report report = new Report();
        report.setReportCode("REP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report.setCitizenId(currentUser.getId());
        report.setOriginalText(request.getOriginalText());
        report.setLanguage(request.getLanguage());
        
        // Populate optional fields
        report.setCategory(request.getCategory());
        report.setSubcategory(request.getSubcategory());
        report.setDescription(request.getDescription());
        report.setWard(request.getWard());
        report.setDistrict(request.getDistrict());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        
        // Status is set to SUBMITTED initially
        report.setStatus(ReportStatus.SUBMITTED);
        Report savedReport = reportRepository.save(report);

        // Invoke AI processing synchronously for prototype
        StructuredAnalysisResult analysisResult = geminiService.processReport(request.getOriginalText(), request.getLanguage());

        if (analysisResult != null) {
            ReportAIAnalysis aiAnalysis = new ReportAIAnalysis();
            aiAnalysis.setReportId(savedReport.getId());
            aiAnalysis.setDetectedCategory(analysisResult.getCategory());
            aiAnalysis.setDetectedSubcategory(analysisResult.getSubcategory());
            aiAnalysis.setDetectedLanguage(analysisResult.getLanguage());
            aiAnalysis.setSummary(analysisResult.getSummary());
            aiAnalysis.setConfidence(analysisResult.getConfidence());
            aiAnalysis.setExtractedEntities(String.join(", ", analysisResult.getEntities() != null ? analysisResult.getEntities() : List.of()));
            
            int urgencyInt = mapUrgencyStringToInt(analysisResult.getUrgency());
            aiAnalysis.setUrgency(urgencyInt);
            aiAnalysisRepository.save(aiAnalysis);

            // Update Report with AI findings
            savedReport.setCategory(analysisResult.getCategory());
            savedReport.setSubcategory(analysisResult.getSubcategory());
            if (analysisResult.getLocation() != null) {
                if (savedReport.getWard() == null) savedReport.setWard(analysisResult.getLocation().getWard());
                if (savedReport.getDistrict() == null) savedReport.setDistrict(analysisResult.getLocation().getDistrict());
            }
            savedReport.setUrgency(urgencyInt);
            savedReport.setAiConfidence(analysisResult.getConfidence());
            savedReport.setStatus(ReportStatus.AI_PROCESSED);
            reportRepository.save(savedReport);

            // Trigger clustering
            demandClusterService.processReportForClustering(savedReport, aiAnalysis);
        }

        return mapToResponse(savedReport);
    }
    
    private int mapUrgencyStringToInt(String urgencyStr) {
        if (urgencyStr == null) return 2;
        switch (urgencyStr.toUpperCase()) {
            case "LOW": return 1;
            case "MEDIUM": return 2;
            case "HIGH": return 3;
            case "CRITICAL": return 4;
            default: return 2;
        }
    }

    public List<ReportResponse> getMyReports(User currentUser) {
        List<Report> reports = reportRepository.findByCitizenId(currentUser.getId());
        return reports.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ReportResponse getReportById(Long id, User currentUser) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
                
        // Ensure the current user has access (Citizen can only view their own)
        if (currentUser.getRole() == Role.CITIZEN && !report.getCitizenId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to access this report");
        }
        
        return mapToResponse(report);
    }

    public ReportResponse mapToResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getReportCode(),
                report.getOriginalText(),
                report.getCategory(),
                report.getSubcategory(),
                report.getWard(),
                report.getDistrict(),
                report.getUrgency(),
                report.getAiConfidence(),
                report.getStatus(),
                report.getCreatedAt()
        );
    }
}
