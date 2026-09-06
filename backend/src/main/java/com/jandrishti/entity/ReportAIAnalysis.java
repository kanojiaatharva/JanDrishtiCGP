package com.jandrishti.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_ai_analysis")
public class ReportAIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reportId;

    private String detectedCategory;
    private String detectedSubcategory;
    private String detectedLanguage;

    @Column(columnDefinition = "TEXT")
    private String summary;
    
    private Integer urgency;
    private Double confidence;

    @Column(columnDefinition = "TEXT")
    private String extractedEntities;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public String getDetectedCategory() { return detectedCategory; }
    public void setDetectedCategory(String detectedCategory) { this.detectedCategory = detectedCategory; }
    public String getDetectedSubcategory() { return detectedSubcategory; }
    public void setDetectedSubcategory(String detectedSubcategory) { this.detectedSubcategory = detectedSubcategory; }
    public String getDetectedLanguage() { return detectedLanguage; }
    public void setDetectedLanguage(String detectedLanguage) { this.detectedLanguage = detectedLanguage; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public Integer getUrgency() { return urgency; }
    public void setUrgency(Integer urgency) { this.urgency = urgency; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public String getExtractedEntities() { return extractedEntities; }
    public void setExtractedEntities(String extractedEntities) { this.extractedEntities = extractedEntities; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
