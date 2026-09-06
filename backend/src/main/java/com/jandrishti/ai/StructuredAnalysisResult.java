package com.jandrishti.ai;

import java.util.List;

public class StructuredAnalysisResult {
    private String category;
    private String subcategory;
    private String language;
    private String summary;
    private String description;
    private String urgency;
    private Location location;
    private List<String> entities;
    private Double confidence;

    public static class Location {
        private String ward;
        private String district;

        public String getWard() { return ward; }
        public void setWard(String ward) { this.ward = ward; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
    }

    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
    public List<String> getEntities() { return entities; }
    public void setEntities(List<String> entities) { this.entities = entities; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
