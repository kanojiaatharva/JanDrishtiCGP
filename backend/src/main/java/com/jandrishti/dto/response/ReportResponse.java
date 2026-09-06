package com.jandrishti.dto.response;

import com.jandrishti.entity.enums.ReportStatus;
import java.time.LocalDateTime;

public class ReportResponse {
    
    private Long id;
    private String reportCode;
    private String originalText;
    private String category;
    private String subcategory;
    private String ward;
    private String district;
    private Integer urgency;
    private Double aiConfidence;
    private ReportStatus status;
    private LocalDateTime createdAt;

    public ReportResponse() {}

    public ReportResponse(Long id, String reportCode, String originalText, String category,
                          String subcategory, String ward, String district, Integer urgency,
                          Double aiConfidence, ReportStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.reportCode = reportCode;
        this.originalText = originalText;
        this.category = category;
        this.subcategory = subcategory;
        this.ward = ward;
        this.district = district;
        this.urgency = urgency;
        this.aiConfidence = aiConfidence;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReportCode() { return reportCode; }
    public void setReportCode(String reportCode) { this.reportCode = reportCode; }
    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public Integer getUrgency() { return urgency; }
    public void setUrgency(Integer urgency) { this.urgency = urgency; }
    public Double getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Double aiConfidence) { this.aiConfidence = aiConfidence; }
    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
