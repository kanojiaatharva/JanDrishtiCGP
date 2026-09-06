package com.jandrishti.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReportRequest {

    @NotBlank
    @Size(min = 10, max = 2000)
    private String originalText;

    @NotBlank
    private String language;

    // Optional fields (extracted by AI or provided by user)
    private String category;
    private String subcategory;
    private String description;
    private String ward;
    private String district;
    private Double latitude;
    private Double longitude;

    // Getters and Setters
    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
